<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Connexion - Parking TP</title>
</head>
<body>
    <h2>Connexion</h2>
    <div id="message" style="color:red;"></div>

    <form id="loginForm" onsubmit="connecter(event);">
        <label for="identifiant">Identifiant :</label><br>
        <input type="text" id="identifiant" required><br><br>

        <label for="mot_de_passe">Mot de passe :</label><br>
        <input type="password" id="mot_de_passe" required><br><br>

        <button type="submit">Se connecter</button>
    </form>

    <script>
        function connecter(event) {
            event.preventDefault(); // Empêche le rechargement standard de la page

            var identifiant = document.getElementById("identifiant").value;
            var motDePasse = document.getElementById("mot_de_passe").value;

            var xhr = new XMLHttpRequest();
            xhr.open("POST", "../Traitement/connexion.php", true);
            
            // Format d'envoi standard pour les données de formulaire
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var reponse = JSON.parse(xhr.responseText);

                    if (reponse.succes) {
                        alert(reponse.message);
                        window.location.href = "../index.php"; // Redirection vers l'accueil
                    } else {
                        document.getElementById("message").innerText = reponse.message;
                    }
                }
            };

            // Envoi des paramètres sous forme de chaîne encodée
            var parametres = "identifiant=" + encodeURIComponent(identifiant) + 
                             "&mot_de_passe=" + encodeURIComponent(motDePasse);
            xhr.send(parametres);
        }
    </script>
</body>
</html>