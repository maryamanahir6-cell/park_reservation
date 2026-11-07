<?php
require_once __DIR__ . '/bd.php';

function recupererPlacesAvecEtat($pdo, $idUtilisateur = 0) {
    $sql = "SELECT p.id, p.numero,
                   CASE
                       WHEN EXISTS (
                           SELECT 1 FROM reservations r
                           WHERE r.id_place = p.id
                             AND NOW() BETWEEN r.heure_debut AND r.heure_fin
                             AND r.id_utilisateur <> :u1
                       ) THEN 'Occupée'
                       ELSE 'Libre'
                   END AS etat,
                   EXISTS (
                       SELECT 1 FROM reservations r2
                       WHERE r2.id_place = p.id
                         AND r2.id_utilisateur = :u2
                         AND r2.heure_fin > NOW()
                   ) AS mienne
            FROM places p
            ORDER BY p.id"; //select 1 returns true if the subquery returns any rows, otherwise false. 

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['u1' => (int)$idUtilisateur, 'u2' => (int)$idUtilisateur]);
    $places = $stmt->fetchAll(PDO::FETCH_ASSOC); // Récupère toutes les places avec leur état et si elles appartiennent à l'utilisateur

    foreach ($places as &$p) { // Convertit le champ 'mienne' (0 ou 1) en booléen
        $p['mienne'] = (bool)$p['mienne'];
    }
    return $places; //return (id_place, numero, etat(libre/occupée), mienne(true/false))
}
?>
