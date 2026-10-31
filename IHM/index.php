<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Parking TP</title>
</head>
<body>
    <h1>Réservation de Parking</h1>
    <div id="parking-container">
        <!-- Les places s'afficheront ici grâce à AJAX -->
    </div>

    <script>
        function chargerPlaces() {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "Traitement/get_places.php", true);
            
            xhr.onreadystatechange = function() {
                // Attente de l'état 4 : données disponibles chez le client
                if (xhr.readyState == 4) {
                    // Test du statut HTTP
                    if (xhr.status == 200) {
                        try {
                            var places = JSON.parse(xhr.responseText); // Conversion du texte en objet JSON
                            var affichage = "<ul>";
                            
                            for (var i = 0; i < places.length; i++) {
                                affichage += "<li>Place : " + places[i].numero + "</li>";
                            }
                            affichage += "</ul>";
                            
                            document.getElementById("parking-container").innerHTML = affichage;
                        } catch (e) {
                            document.getElementById("parking-container").innerHTML = 
                                "<p style='color:red;'>Erreur : le format de la réponse du serveur est invalide.</p>";
                        }
                    } else {
                        // Gestion des erreurs HTTP (404, 500, etc.)
                        alert("Erreur HTTP N°" + xhr.status); // Conformément à l'exemple du cours
                        document.getElementById("parking-container").innerHTML = 
                            "<p style='color:red;'>Impossible de charger les places de parking (Erreur " + xhr.status + ").</p>";
                    }
                }
            };
            
            xhr.send(null);
        }

        window.onload = chargerPlaces;
    </script>
</body>
</html>