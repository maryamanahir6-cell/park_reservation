<?php
require '../BD/places_db.php';

header("Content-Type: application/json; charset=UTF-8");

// Exécution de la requête via la fonction du dossier BD
$places = recupererPlacesAvecEtat($pdo);

// Envoi de la réponse HTTP
echo json_encode($places);
?>