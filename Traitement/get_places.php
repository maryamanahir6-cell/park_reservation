<?php
require '../BD/bd.php'; // Inclusion de la connexion

$stmt = $pdo->query("SELECT id, numero FROM places");
$places = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Définition de l'en-tête et renvoi des données en JSON
header("Content-Type: application/json; charset=UTF-8");
echo json_encode($places);
?>