<?php
session_start();

// Libération et destruction de toutes les variables de session
session_unset();
session_destroy();

header("Content-Type: application/json; charset=UTF-8");
echo json_encode(["succes" => true, "message" => "Déconnexion réussie."]);
?>