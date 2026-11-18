function chargerMesReservations() {
  if (!window.estConnecte) return;

  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "Traitement/get_mes_reservations.php?t=" + new Date().getTime(),
    true,
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;

    var res;
    try {
      res = JSON.parse(xhr.responseText);
    } catch (e) {
      return;
    }
    var conteneur = document.getElementById("conteneur-mes-reservations");
    var badge = document.getElementById("nb-reservations");
    if (!conteneur) return;

    if (res.succes && res.donnees.length > 0) {
      var maintenant = new Date();
      var html = '<ul class="resa-list">';
      for (var i = 0; i < res.donnees.length; i++) {
        var r = res.donnees[i];
        var d = parserDate(r.heure_debut);
        var f = parserDate(r.heure_fin);

        var statut, classe;
        if (f < maintenant) {
          statut = "Terminée";
          classe = "fini";
        } else if (d <= maintenant) {
          statut = "En cours";
          classe = "encours";
        } else {
          statut = "À venir";
          classe = "avenir";
        }

        var quand =
          jourCourt(d) === jourCourt(f)
            ? jourCourt(d) + " · " + heureCourte(d) + " → " + heureCourte(f)
            : jourCourt(d) +
              " " +
              heureCourte(d) +
              " → " +
              jourCourt(f) +
              " " +
              heureCourte(f);

        html +=
          '<li class="resa resa-' +
          classe +
          '">' +
          '<span class="resa-pill">' +
          esc(r.numero) +
          "</span>" +
          '<div class="resa-info"><strong>Place ' +
          esc(r.numero) +
          "</strong>" +
          '<span class="muted small">' +
          esc(quand) +
          "</span></div>" +
          '<span class="statut statut-' +
          classe +
          '">' +
          statut +
          "</span></li>";
      }
      html += "</ul>";
      conteneur.innerHTML = html;
      if (badge) badge.innerText = res.donnees.length;
    } else {
      conteneur.innerHTML =
        '<div class="vide"><span>🅿️</span><p>Vous n\'avez aucune réservation enregistrée.</p></div>';
      if (badge) badge.innerText = "0";
    }
  };
  xhr.send(null);
}

function connecter(event) {
  event.preventDefault();
  var identifiant = document.getElementById("login_identifiant").value;
  var mdp = document.getElementById("login_mdp").value;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "Traitement/connexion.php", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var reponse = JSON.parse(xhr.responseText);
      if (reponse.succes) {
        location.reload();
      } else {
        document.getElementById("msg-login").innerText = reponse.message;
      }
    }
  };
  //stringify convertit un objet JavaScript en une chaîne JSON (ex: {identifiant: "user", mot_de_passe: "pass"} devient '{"identifiant":"user","mot_de_passe":"pass"}')
  xhr.send(JSON.stringify({ identifiant: identifiant, mot_de_passe: mdp }));
}

function deconnecter() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "Traitement/deconnexion.php", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      location.reload();
    }
  };
  //stringify convertit un objet JavaScript en une chaîne JSON
  xhr.send(JSON.stringify({}));
}
