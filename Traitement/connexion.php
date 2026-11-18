<?php
session_start();
require '../BD/bd.php';

header("Content-Type: application/json; charset=UTF-8");
// Récupération des données JSON envoyées depuis le front-end 
//le php://input est un flux qui permet de lire les données brutes envoyées dans le corps de la requête HTTP.
$donnees = json_decode(file_get_contents("php://input"), true);
$identifiant = $donnees['identifiant'] ?? '';
$motDePasse = $donnees['mot_de_passe'] ?? '';

if (empty($identifiant) || empty($motDePasse)) {
    echo json_encode(["succes" => false, "message" => "Veuillez remplir tous les champs."]);
    exit();
}

// Recherche de l'utilisateur
$stmt = $pdo->prepare("SELECT id, identifiant, mot_de_passe FROM utilisateurs WHERE identifiant = :identifiant");
$stmt->execute(['identifiant' => $identifiant]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Vérification de l'existence et du mot de passe haché
if ($user && password_verify($motDePasse, $user['mot_de_passe'])) {
    // Création de la session
    $_SESSION['utilisateur_id'] = $user['id'];
    $_SESSION['identifiant'] = $user['identifiant'];

    echo json_encode(["succes" => true, "message" => "Connexion réussie !"]);
} else {
    echo json_encode(["succes" => false, "message" => "Identifiant ou mot de passe incorrect."]);
}
?>