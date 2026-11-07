<?php
session_start();
require '../BD/bd.php';

header("Content-Type: application/json; charset=UTF-8");
// Vérification si l'utilisateur est connecté
if (!isset($_SESSION['utilisateur_id'])) {
    echo json_encode(["succes" => false, "message" => "Utilisateur non connecté."]);
    exit();
}
// Récupération des réservations de l'utilisateur connecté
$stmt =$pdo->prepare("
    SELECT r.id, p.numero, r.heure_debut, r.heure_fin 
    FROM reservations r 
    JOIN places p ON r.id_place = p.id 
    WHERE r.id_utilisateur = :user 
    ORDER BY r.heure_debut DESC
");
$stmt->execute(['user' =>$_SESSION['utilisateur_id']]);
$reservations =$stmt->fetchAll(PDO::FETCH_ASSOC);
// Retourne les réservations sous forme de JSON
echo json_encode(["succes" => true, "donnees" => $reservations]);
?>