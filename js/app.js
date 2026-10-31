var placeSelectionneeId = null;
var placeSelectionneeNumero = "";
var derniereReponsePlaces = null;
var timerFermeture = null;
var reservationEnCours = false; // vrai dès que MON formulaire est soumis
var libreALOuverture = false; // la place était libre quand j'ai ouvert le pop-up

var ICONE_CHECK =
  '<svg class="icone-check" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';

/* ---------- Utilitaires ---------- */

function esc(texte) {
  var d = document.createElement("div");
  d.appendChild(document.createTextNode(texte == null ? "" : texte));
  return d.innerHTML.replace(/"/g, "&quot;");
}

function formatDatePourInput(date) {
  var tzoffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzoffset).toISOString().slice(0, 16);
}

function afficherToast(message, type) {
  var zone = document.getElementById("toasts");
  if (!zone) {
    zone = document.createElement("div");
    zone.id = "toasts";
    document.body.appendChild(zone);
  }
  var t = document.createElement("div");
  t.className = "toast toast-" + (type || "info");
  t.textContent = message;
  zone.appendChild(t);
  setTimeout(function () {
    t.classList.add("toast-sortie");
    setTimeout(function () {
      if (t.parentNode) t.parentNode.removeChild(t);
    }, 300);
  }, 3200);
}

/* ---------- Restrictions des champs date ---------- */

function initialiserRestrictions() {
  var inputDebut = document.getElementById("res_heure_debut");
  var inputFin = document.getElementById("res_heure_fin");
  if (!inputDebut || !inputFin) return;

  inputDebut.addEventListener("change", function () {
    if (inputDebut.value) {
      inputFin.min = inputDebut.value;
      if (inputFin.value && inputFin.value < inputDebut.value) {
        inputFin.value = inputDebut.value;
      }
    }
  });
}

/* ---------- Plan du parking ---------- */

function htmlVoiture() {
  // Un seul modèle de voiture pour toutes les places occupées
  return '<svg class="car" viewBox="0 0 60 110"><use href="#car-shape"/></svg>';
}

function htmlPlace(p, rang, derniere) {
  // rang 1-2 : rangées du haut (nez vers le haut) ; 3-4 : rangées du bas
  var position = rang <= 2 ? "haut" : "bas";
  var estOccupee = p.etat !== "Libre";
  var mienne = !!p.mienne;
  var classe = mienne ? "mienne" : estOccupee ? "occupee" : "libre";
  var contenu;
  var label;

  if (mienne) {
    contenu =
      '<span class="pill pill-mine">' + esc(p.numero) + ICONE_CHECK + "</span>";
    label = "Place " + p.numero + " : ma réservation";
  } else if (estOccupee) {
    contenu = htmlVoiture();
    label = "Place " + p.numero + " : occupée";
  } else {
    contenu = '<span class="pill pill-free">' + esc(p.numero) + "</span>";
    label = "Place " + p.numero + " : libre";
  }

  return (
    '<button type="button" class="slot slot-' +
    position +
    " rang" +
    rang +
    " " +
    classe +
    (derniere ? " derniere" : "") +
    '"' +
    ' data-id="' +
    esc(p.id) +
    '" data-numero="' +
    esc(p.numero) +
    '"' +
    ' data-etat="' +
    esc(p.etat) +
    '" data-mienne="' +
    (mienne ? "1" : "0") +
    '"' +
    ' title="' +
    esc(label) +
    '" aria-label="' +
    esc(label) +
    '">' +
    contenu +
    "</button>"
  );
}

function verifierConflitLive(places) {
  if (placeSelectionneeId === null) return;
  // Ma propre réservation ne doit JAMAIS déclencher l'alerte "occupée par un autre"
  if (reservationEnCours) return;
  var overlay = document.getElementById("panel-reservation");
  if (overlay.hidden) return;

  var modal = overlay.querySelector(".modal");
  var msgConflit = document.getElementById("msg-conflit-live");
  var btn = document.getElementById("btn-soumettre-res");

  for (var i = 0; i < places.length; i++) {
    var p = places[i];
    if (String(p.id) !== String(placeSelectionneeId)) continue;

    // Alerte uniquement si un AUTRE utilisateur prend la place pendant que le pop-up est ouvert
    if (libreALOuverture && p.etat !== "Libre" && !p.mienne) {
      modal.classList.add("alerte-conflit");
      msgConflit.innerText =
        "Attention ! Cette place vient d'être occupée à l'instant par un autre utilisateur.";
      btn.disabled = true;
    }
  }
}

function chargerParking() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "Traitement/get_places.php?t=" + new Date().getTime(), true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;

    // Rien n'a changé : on évite de re-dessiner (pas de clignotement)
    if (xhr.responseText === derniereReponsePlaces) return;

    var places;
    try {
      places = JSON.parse(xhr.responseText);
    } catch (e) {
      return;
    }
    derniereReponsePlaces = xhr.responseText;

    var nb = places.length;
    var colonnes = Math.ceil(nb / 4);
    var r = ["", "", "", ""],
      couloir = "";

    // Chaque colonne = 2 places en haut, le numéro au centre, 2 places en bas
    for (var k = 0; k < colonnes; k++) {
      var derniere = k === colonnes - 1;
      for (var j = 0; j < 4; j++) {
        var p = places[4 * k + j];
        r[j] += p
          ? htmlPlace(p, j + 1, derniere)
          : '<div class="slot slot-vide rang' +
            (j + 1) +
            (derniere ? " derniere" : "") +
            '"></div>';
      }
      couloir += '<div class="lane-cell"><span>' + (k + 1) + "</span></div>";
    }

    var lot = document.getElementById("parking-lot");
    lot.style.setProperty("--cols", colonnes);
    lot.innerHTML = r[0] + r[1] + couloir + r[2] + r[3];

    // Statistiques
    var libres = 0;
    for (var i = 0; i < nb; i++) {
      if (places[i].etat === "Libre" || places[i].mienne) libres++;
    }
    var stats = document.getElementById("parking-stats");
    if (stats) {
      stats.innerHTML = "<b>" + libres + "</b> / " + nb + " disponibles";
      stats.className = "stats-chip" + (libres === 0 ? " stats-plein" : "");
    }

    verifierConflitLive(places);
  };
  xhr.send(null);
}

/* ---------- Pop-up de réservation ---------- */

function selectionnerPlace(id, numero, etat, mienne) {
  if (!window.estConnecte) {
    afficherToast(
      "Connectez-vous dans la colonne de gauche pour réserver une place.",
      "info",
    );
    var carte = document.getElementById("carte-compte");
    var champ = document.getElementById("login_identifiant");
    if (carte) {
      carte.classList.remove("pulse");
      void carte.offsetWidth;
      carte.classList.add("pulse");
    }
    if (champ) champ.focus();
    return;
  }

  if (etat === "Occupée" && !mienne) {
    afficherToast("Cette place est actuellement occupée.", "erreur");
    return;
  }

  placeSelectionneeId = id;
  placeSelectionneeNumero = numero;
  reservationEnCours = false;
  libreALOuverture = etat === "Libre" && !mienne;
  clearTimeout(timerFermeture);

  // Valeurs par défaut : prochain quart d'heure, durée 1 h
  var debut = new Date();
  debut.setSeconds(0, 0);
  debut.setMinutes(Math.ceil((debut.getMinutes() + 1) / 15) * 15);
  var fin = new Date(debut.getTime() + 60 * 60000);

  var inputDebut = document.getElementById("res_heure_debut");
  var inputFin = document.getElementById("res_heure_fin");
  var maintenant = formatDatePourInput(new Date());
  inputDebut.min = maintenant;
  inputDebut.value = formatDatePourInput(debut);
  inputFin.min = inputDebut.value;
  inputFin.value = formatDatePourInput(fin);

  document.getElementById("res_id_place").value = id;
  document.getElementById("titre-reservation").innerText =
    "Réserver la place " + numero;
  document.getElementById("modal-place-badge").innerText = numero;
  document.getElementById("msg-retour-res").innerText = "";
  document.getElementById("msg-retour-res").className = "msg-retour";
  document.getElementById("msg-conflit-live").innerText = "";
  document.getElementById("btn-soumettre-res").disabled = false;

  var overlay = document.getElementById("panel-reservation");
  overlay.querySelector(".modal").classList.remove("alerte-conflit");
  overlay.hidden = false;
  document.body.classList.add("no-scroll");
  setTimeout(function () {
    inputDebut.focus();
  }, 50);
}

function fermerReservation() {
  clearTimeout(timerFermeture);
  var overlay = document.getElementById("panel-reservation");
  if (!overlay || overlay.hidden) return;
  overlay.hidden = true;
  document.body.classList.remove("no-scroll");
  placeSelectionneeId = null;
}

function effectuerReservation(event) {
  event.preventDefault();

  var idPlace = document.getElementById("res_id_place").value;
  var debut = document.getElementById("res_heure_debut").value;
  var fin = document.getElementById("res_heure_fin").value;
  var btn = document.getElementById("btn-soumettre-res");
  var msgDiv = document.getElementById("msg-retour-res");

  btn.disabled = true;
  reservationEnCours = true;

  function echec(texte) {
    reservationEnCours = false;
    msgDiv.className = "msg-retour msg-ko";
    msgDiv.innerText = texte;
    btn.disabled = false;
  }

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "Traitement/reserver.php", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4) return;
    if (xhr.status != 200)
      return echec("Erreur de communication avec le serveur.");

    var res;
    try {
      res = JSON.parse(xhr.responseText);
    } catch (e) {
      return echec("Réponse invalide du serveur.");
    }

    if (res.succes) {
      // Une seule notification : on ferme le pop-up puis un seul message de succès
      var numero = placeSelectionneeNumero;
      fermerReservation();
      afficherToast("Place " + numero + " réservée avec succès.", "ok");
      derniereReponsePlaces = null;
      chargerParking();
      chargerMesReservations();
    } else {
      echec(res.message);
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

/* ---------- Mes réservations (colonne gauche) ---------- */

function parserDate(s) {
  return new Date(String(s).replace(" ", "T"));
}

function jourCourt(d) {
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function heureCourte(d) {
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
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

/* ---------- Authentification ---------- */

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

/* ---------- Initialisation ---------- */

window.onload = function () {
  chargerParking();
  chargerMesReservations();
  initialiserRestrictions();

  // Clic sur une place (délégation d'évènement)
  document
    .getElementById("parking-lot")
    .addEventListener("click", function (e) {
      var slot = e.target.closest(".slot[data-id]");
      if (!slot) return;
      selectionnerPlace(
        slot.getAttribute("data-id"),
        slot.getAttribute("data-numero"),
        slot.getAttribute("data-etat"),
        slot.getAttribute("data-mienne") === "1",
      );
    });

  // Fermeture du pop-up : clic sur le fond ou touche Échap
  var overlay = document.getElementById("panel-reservation");
  overlay.addEventListener("mousedown", function (e) {
    if (e.target === overlay) fermerReservation();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fermerReservation();
  });

  // Short Polling toutes les 3 secondes
  setInterval(chargerParking, 3000);
  // Mise à jour des statuts (En cours / Terminée) chaque minute
  setInterval(chargerMesReservations, 60000);
};
