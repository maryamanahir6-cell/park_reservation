var placeSelectionneeId = null;
var placeSelectionneeNumero = "";

function formatDatePourInput(date) {
  var tzoffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzoffset).toISOString().slice(0, 16);
}

function initialiserRestrictions() {
  var inputDebut = document.getElementById("res_heure_debut");
  var inputFin = document.getElementById("res_heure_fin");
  if (!inputDebut || !inputFin) return;

  var maintenant = formatDatePourInput(new Date());
  inputDebut.min = maintenant;
  inputFin.min = maintenant;

  inputDebut.addEventListener("change", function () {
    if (inputDebut.value) {
      inputFin.min = inputDebut.value;
      if (inputFin.value && inputFin.value < inputDebut.value) {
        inputFin.value = inputDebut.value;
      }
    }
  });
}

function chargerParking() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "Traitement/get_places.php?t=" + new Date().getTime(), true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var places = JSON.parse(xhr.responseText);
      var lotHtml = "";

      for (var i = 0; i < places.length; i++) {
        var p = places[i];
        var estLibre = p.etat === "Libre";
        var classEtat = estLibre ? "libre" : "occupee";
        var badge = estLibre
          ? '<span class="badge-libre">Libre</span>'
          : '🚗 <span class="badge-occupe">Occupée</span>';

        lotHtml +=
          '<div class="parking-slot ' +
          classEtat +
          '" onclick="selectionnerPlace(' +
          p.id +
          ", '" +
          p.numero +
          "', '" +
          p.etat +
          "')\">";
        lotHtml += "<span>Place " + p.numero + "</span>";
        lotHtml += '<div class="slot-status">' + badge + "</div>";
        lotHtml += "</div>";

        // Détection de conflit en temps réel
        if (placeSelectionneeId === p.id) {
          var panel = document.getElementById("panel-reservation");
          var msgConflit = document.getElementById("msg-conflit-live");
          var btn = document.getElementById("btn-soumettre-res");

          if (!estLibre) {
            panel.classList.add("alerte-conflit");
            msgConflit.innerText =
              "❌ Attention ! Cette place vient d'être occupée à l'instant par un autre utilisateur.";
            btn.disabled = true;
          } else {
            panel.classList.remove("alerte-conflit");
            msgConflit.innerText = "";
            btn.disabled = false;
          }
        }
      }

      document.getElementById("parking-lot").innerHTML = lotHtml;
    }
  };
  xhr.send(null);
}

function selectionnerPlace(id, numero, etat) {
  if (!window.estConnecte) {
    alert(
      "Veuillez vous connecter dans la colonne de droite pour effectuer une réservation.",
    );
    return;
  }

  if (etat === "Occupée") {
    alert("Cette place est actuellement occupée.");
    return;
  }

  placeSelectionneeId = id;
  placeSelectionneeNumero = numero;

  document.getElementById("res_id_place").value = id;
  document.getElementById("titre-reservation").innerText =
    "Réserver la Place : " + numero;
  document.getElementById("panel-reservation").style.display = "block";
  document.getElementById("msg-retour-res").innerText = "";
}

function effectuerReservation(event) {
  event.preventDefault();

  var idPlace = document.getElementById("res_id_place").value;
  var debut = document.getElementById("res_heure_debut").value;
  var fin = document.getElementById("res_heure_fin").value;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "Traitement/reserver.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var res = JSON.parse(xhr.responseText);
      var msgDiv = document.getElementById("msg-retour-res");

      if (res.succes) {
        msgDiv.style.color = "green";
        msgDiv.innerText = res.message;
        chargerParking();
        chargerMesReservations();
      } else {
        msgDiv.style.color = "red";
        msgDiv.innerText = res.message;
      }
    }
  };

  var params =
    "id_place=" +
    encodeURIComponent(idPlace) +
    "&heure_debut=" +
    encodeURIComponent(debut) +
    "&heure_fin=" +
    encodeURIComponent(fin);
  xhr.send(params);
}

function chargerMesReservations() {
  if (!window.estConnecte) return;

  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "Traitement/get_mes_reservations.php?t=" + new Date().getTime(),
    true,
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var res = JSON.parse(xhr.responseText);
      var conteneur = document.getElementById("conteneur-mes-reservations");

      if (res.succes && res.donnees.length > 0) {
        var html =
          "<table><thead><tr><th>Place</th><th>Début</th><th>Fin</th></tr></thead><tbody>";
        for (var i = 0; i < res.donnees.length; i++) {
          html += "<tr>";
          html += "<td><b>" + res.donnees[i].numero + "</b></td>";
          html += "<td>" + res.donnees[i].heure_debut + "</td>";
          html += "<td>" + res.donnees[i].heure_fin + "</td>";
          html += "</tr>";
        }
        html += "</tbody></table>";
        conteneur.innerHTML = html;
      } else {
        conteneur.innerHTML =
          "<p>Vous n'avez aucune réservation enregistrée.</p>";
      }
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
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

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
  xhr.send(
    "identifiant=" +
      encodeURIComponent(identifiant) +
      "&mot_de_passe=" +
      encodeURIComponent(mdp),
  );
}

function deconnecter() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "Traitement/deconnexion.php", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      location.reload();
    }
  };
  xhr.send(null);
}

window.onload = function () {
  chargerParking();
  chargerMesReservations();
  initialiserRestrictions();

  // Short Polling toutes les 3 secondes
  setInterval(chargerParking, 3000);
};
