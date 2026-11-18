<?php
session_start();
$estConnecte = isset($_SESSION['utilisateur_id']); //true si l'utilisateur est connecte
$nomUtilisateur = $_SESSION['identifiant'] ?? '';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Gestion du Parking en Temps Réel</title>
    <link rel="stylesheet" href="css/style.css?v=<?= filemtime(__DIR__ . '/css/style.css') ?>">
</head>
<body>

    <header class="topbar">
        <div class="topbar-inner">
            <div class="brand">
                <span class="brand-logo">P</span>
                <div>
                    <h1>Parking Intelligent</h1>
                    <p>Réservation de places en temps réel</p>
                </div>
            </div>
            <span class="live-chip"><i class="live-dot"></i> En direct</span>
        </div>
    </header>

    <main class="layout-container">
        <!-- Colonne gauche : connexion / espace client (historique des réservations) -->
        <?php include 'IHM/c_gauche.php'; ?>

        <!-- Colonne droite : plan du parking + pop-up de réservation -->
        <?php include 'IHM/c_droite.php'; ?>
    </main>

    <script>
        // variable d'état PHP vers le JS, si false, on deconnecte l'utilisateur et on le redirige vers la page de connexion
        window.estConnecte = <?= $estConnecte ? 'true' : 'false' ?>; 
    </script>
    <script src="js/common.js?v=<?= filemtime(__DIR__ . '/js/common.js') ?>"></script>
    <script src="js/account.js?v=<?= filemtime(__DIR__ . '/js/account.js') ?>"></script>
    <script src="js/parking.js?v=<?= filemtime(__DIR__ . '/js/parking.js') ?>"></script>
    <script src="js/reservation.js?v=<?= filemtime(__DIR__ . '/js/reservation.js') ?>"></script>
    <script src="js/main.js?v=<?= filemtime(__DIR__ . '/js/main.js') ?>"></script>
</body>
</html>
