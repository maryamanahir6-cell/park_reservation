<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Parking TP - Réservations</title>
</head>
<body>
    <h1>Réservation de Parking</h1>
    
    <div id="parking-container"></div>

    <hr>
    <h2>Faire une réservation</h2>
    <div id="msg-reservation"></div>

    <form id="form-reservation" onsubmit="effectuerReservation(event);">
        <label for="select-place">Place :</label><br>
        <select id="select-place" required></select><br><br>

        <label for="heure_debut">Heure de début :</label><br>
        <input type="datetime-local" id="heure_debut" required><br><br>

        <label for="heure_fin">Heure de fin :</label><br>
        <input type="datetime-local" id="heure_fin" required><br><br>

        <button type="submit">Réserver</button>
    </form>

    <script>
        // Fonction pour formater une date JS au format ISO requis par input datetime-local (YYYY-MM-THH:mm)
        function formatDatePourInput(date) {
            var tzoffset = date.getTimezoneOffset() * 60000;
            var localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
            return localISOTime;
        }

        function initialiserRestrictionsDates() {
            var champDebut = document.getElementById("heure_debut");
            var champFin = document.getElementById("heure_fin");

            // 1. Empêcher de réserver dans le passé : min = maintenant
            var maintenant = new Date();
            var minMaintenant = formatDatePourInput(maintenant);
            champDebut.min = minMaintenant;
            champFin.min = minMaintenant;

            // 2. Écouteur sur le changement de l'heure de début
            champDebut.addEventListener("change", function() {
                var valeurDebut = champDebut.value;
                if (valeurDebut) {
                    // L'heure de fin minimale devient l'heure de début choisie
                    champFin.min = valeurDebut;
                    
                    // Si la date de fin actuelle est antérieure à la nouvelle date de début, on la réinitialise
                    if (champFin.value && champFin.value < valeurDebut) {
                        champFin.value = valeurDebut;
                    }
                }
            });
        }

        function chargerPlaces() {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "Traitement/get_places.php", true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var places = JSON.parse(xhr.responseText);
                    var listHtml = "<ul>";
                    var selectHtml = "";

                    for (var i = 0; i < places.length; i++) {
                        listHtml += "<li>Place : " + places[i].numero + "</li>";
                        selectHtml += "<option value='" + places[i].id + "'>" + places[i].numero + "</option>";
                    }
                    listHtml += "</ul>";

                    document.getElementById("parking-container").innerHTML = listHtml;
                    document.getElementById("select-place").innerHTML = selectHtml;
                }
            };
            xhr.send(null);
        }

        function effectuerReservation(event) {
            event.preventDefault();

            var placeId = document.getElementById("select-place").value;
            var debut = document.getElementById("heure_debut").value;
            var fin = document.getElementById("heure_fin").value;

            var xhr = new XMLHttpRequest();
            xhr.open("POST", "Traitement/reserver.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var reponse = JSON.parse(xhr.responseText);
                    var msgDiv = document.getElementById("msg-reservation");

                    if (reponse.succes) {
                        msgDiv.style.color = "green";
                        msgDiv.innerText = reponse.message;
                    } else {
                        msgDiv.style.color = "red";
                        msgDiv.innerText = reponse.message;
                    }
                }
            };

            var params = "id_place=" + encodeURIComponent(placeId) +
                         "&heure_debut=" + encodeURIComponent(debut) +
                         "&heure_fin=" + encodeURIComponent(fin);
            xhr.send(params);
        }

        window.onload = function() {
            chargerPlaces();
            initialiserRestrictionsDates();
        };
    </script>
</body>
</html>