<?php
/**
 * Ajoute des places dans la table `places` pour allonger chaque rangée du plan.
 *
 * Utilisation (navigateur) :
 *   BD/ajouter_places.php               -> complète jusqu'à 32 places (8 par rangée)
 *   BD/ajouter_places.php?total=40      -> complète jusqu'à 40 places
 *   BD/ajouter_places.php?demo=1        -> en plus, occupe ~2/3 des nouvelles places
 *                                          pendant 4 h (pour voir les voitures)
 *
 * Le format des numéros est déduit de la dernière place existante (A14 -> A15, A16...).
 * À SUPPRIMER après utilisation.
 */
require_once __DIR__ . '/bd.php';
header('Content-Type: text/plain; charset=UTF-8');

$cible = max(4, min(120, (int)($_GET['total'] ?? 32)));
$demo  = isset($_GET['demo']);

$existants = $pdo->query("SELECT numero FROM places ORDER BY id")->fetchAll(PDO::FETCH_COLUMN);
$nb = count($existants);

// Déduction du format : préfixe + nombre (avec zéros éventuels)
$prefixe = 'P'; $n = $nb; $largeur = 2;
if ($nb > 0 && preg_match('/^(\D*)(\d+)$/', end($existants), $m)) {
    $prefixe = $m[1]; $n = (int)$m[2]; $largeur = strlen($m[2]);
}

$insert  = $pdo->prepare("INSERT INTO places (numero) VALUES (:numero)");
$nouvelles = [];
while ($nb < $cible) {
    $n++;
    $numero = $prefixe . str_pad((string)$n, $largeur, '0', STR_PAD_LEFT);
    if (in_array($numero, $existants, true)) continue;
    $insert->execute(['numero' => $numero]);
    $nouvelles[(int)$pdo->lastInsertId()] = $numero;
    $existants[] = $numero;
    $nb++;
}
echo count($nouvelles) . " place(s) ajoutée(s) : " . implode(', ', $nouvelles) . "\n";
echo "Total : $nb places.\n";

if ($demo && $nouvelles) {
    $uid = $pdo->query("SELECT id FROM utilisateurs ORDER BY id DESC LIMIT 1")->fetchColumn();
    if ($uid) {
        $res = $pdo->prepare(
            "INSERT INTO reservations (id_utilisateur, id_place, heure_debut, heure_fin)
             VALUES (:u, :p, NOW() - INTERVAL 1 HOUR, NOW() + INTERVAL 4 HOUR)"
        );
        $i = 0; $occ = 0;
        foreach ($nouvelles as $idPlace => $numero) {
            if ($i++ % 3 === 0) continue; // 1 place sur 3 reste libre
            $res->execute(['u' => $uid, 'p' => $idPlace]);
            $occ++;
        }
        echo "Démo : $occ réservation(s) créées avec l'utilisateur n°$uid.\n";
    }
}
echo "\nPensez à supprimer ce fichier après utilisation.\n";
?>
