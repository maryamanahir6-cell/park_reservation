<?php
session_start();
$estConnecte = isset($_SESSION['utilisateur_id']);
$nomUtilisateur = $_SESSION['identifiant'] ?? '';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Gestion du Parking en Temps Réel</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <h1> Système de Parking Intelligent - Temps Réel</h1>

    <div class="layout-container">
        <!-- Inclusion de la colonne gauche -->
        <?php include 'IHM/c_gauche.php'; ?>

        <!-- Inclusion de la colonne droite -->
        <?php include 'IHM/c_droite.php'; ?>
    </div>

    <script>
        // Injection de la variable d'état PHP vers le JS
        window.estConnecte = <?= $estConnecte ? 'true' : 'false' ?>;
    </script>
    <script src="js/app.js"></script>
</body>
</html>