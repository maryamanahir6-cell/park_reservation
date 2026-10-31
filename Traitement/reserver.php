<?php
session_start();
require '../BD/bd.php';

header("Content-Type: application/json; charset=UTF-8");

// Vérification de la session
if (!isset($_SESSION['utilisateur_id'])) {
    echo json_encode(["succes" => false, "message" => "Vous devez être connecté pour réserver."]);
    exit();
}

$id_utilisateur = $_SESSION['utilisateur_id'];
$id_place = $_POST['id_place'] ?? '';
$heure_debut = str_replace('T', ' ', $_POST['heure_debut'] ?? '');
$heure_fin   = str_replace('T', ' ', $_POST['heure_fin'] ?? '');

if (empty($id_place) || empty($heure_debut) || empty($heure_fin)) {
    echo json_encode(["succes" => false, "message" => "Tous les champs sont obligatoires."]);
    exit();
}

if (strtotime($heure_debut) >= strtotime($heure_fin)) {
    echo json_encode(["succes" => false, "message" => "L'heure de fin doit être supérieure à l'heure de début."]);
    exit();
}

// 1. Détection des conflits de réservation
$sqlConflict = "SELECT COUNT(*) FROM reservations 
                WHERE id_place = :id_place 
                AND (heure_debut < :heure_fin AND heure_fin > :heure_debut)";
$stmt = $pdo->prepare($sqlConflict);
$stmt->execute([
    'id_place' => $id_place,
    'heure_debut' => $heure_debut,
    'heure_fin' => $heure_fin
]);

if ($stmt->fetchColumn() > 0) {
    echo json_encode(["succes" => false, "message" => "Cette place est déjà réservée pour ce créneau."]);
    exit();
}

// 2. Insertion de la réservation
$stmtInsert = $pdo->prepare("INSERT INTO reservations (id_utilisateur, id_place, heure_debut, heure_fin) VALUES (:user, :place, :debut, :fin)");
$stmtInsert->execute([
    'user' => $id_utilisateur,
    'place' => $id_place,
    'debut' => $heure_debut,
    'fin' => $heure_fin
]);

echo json_encode(["succes" => true, "message" => "Réservation réussie !"]);
?>