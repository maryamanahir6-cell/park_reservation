<?php
session_start();
require '../BD/bd.php';

header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate");

$id_place = $_GET['id_place'] ?? '';
$debut    = str_replace('T', ' ', $_GET['heure_debut'] ?? '');
$fin      = str_replace('T', ' ', $_GET['heure_fin'] ?? '');

if ($id_place === '' || $debut === '' || $fin === '' || strtotime($debut) >= strtotime($fin)) {
    echo json_encode(["disponible" => true]);
    exit();
}

// Même règle de chevauchement que dans reserver.php
$stmt = $pdo->prepare("SELECT id_utilisateur FROM reservations
                       WHERE id_place = :place
                         AND heure_debut < :fin AND heure_fin > :debut
                       LIMIT 1");
$stmt->execute(['place' => $id_place, 'debut' => $debut, 'fin' => $fin]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    echo json_encode(["disponible" => true]);
    exit();
}

$parMoi = isset($_SESSION['utilisateur_id']) && (int)$row['id_utilisateur'] === (int)$_SESSION['utilisateur_id'];
echo json_encode([
    "disponible" => false,
    "par_moi"    => $parMoi,
    "message"    => $parMoi
        ? "Vous avez déjà réservé cette place sur ce créneau."
        : "Cette place vient d'être réservée par un autre utilisateur sur ce créneau."
]);
?>