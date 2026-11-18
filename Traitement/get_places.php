<?php
session_start();
require '../BD/places_db.php';

header("Content-Type: application/json; charset=UTF-8"); 
header("Cache-Control: no-store, no-cache, must-revalidate");

// L'id utilisateur permet de marquer "mes réservations" (check) sur le plan
$idUtilisateur = $_SESSION['utilisateur_id'] ?? 0;
$places = recupererPlacesAvecEtat($pdo, $idUtilisateur);

echo json_encode($places); //transforme le tableau associatif en JSON pour l'envoyer au client
?>
