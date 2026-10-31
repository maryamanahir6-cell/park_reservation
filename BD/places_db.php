<?php
require_once __DIR__ . '/bd.php';

function recupererPlacesAvecEtat($pdo) {
    $sql = "SELECT p.id, p.numero, 
                   CASE 
                       WHEN r.id IS NOT NULL THEN 'Occupée'
                       ELSE 'Libre'
                   END AS etat
            FROM places p
            LEFT JOIN reservations r 
                   ON p.id = r.id_place 
                  AND NOW() BETWEEN r.heure_debut AND r.heure_fin";

    $stmt = $pdo->query($sql);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?>