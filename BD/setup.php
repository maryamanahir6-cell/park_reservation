<?php
// Connexion à la base de données MySQL
$host = 'localhost';
$dbname = 'parking_tp';
$username = 'root'; // Utilisateur par défaut de XAMPP
$password = ''; // Pas de mot de passe par défaut sur XAMPP

try {
    $pdo = new PDO("ysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    // Configuration pour afficher les erreurs SQL
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Préparation de la requête d'insertion
    $stmt = $pdo->prepare("INSERT INTO utilisateurs (identifiant, mot_de_passe) VALUES (:identifiant, :mot_de_passe)");

    // Hachage et insertion de l'étudiant
    $hashEtudiant = password_hash('azerty', PASSWORD_DEFAULT);
    $stmt->execute(['identifiant' => 'etudiant1', 'mot_de_passe' => $hashEtudiant]);

    // Hachage et insertion du professeur
    $hashProf = password_hash('admin', PASSWORD_DEFAULT);
    $stmt->execute(['identifiant' => 'prof', 'mot_de_passe' => $hashProf]);


} catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage();
}
?>