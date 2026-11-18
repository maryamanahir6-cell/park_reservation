function initialiserRestrictions() {
  var inputDebut = document.getElementById("res_heure_debut");
  var inputFin = document.getElementById("res_heure_fin");
  if (!inputDebut || !inputFin) return;

  inputDebut.addEventListener("input", verifierDisponibiliteCreneau);
  inputFin.addEventListener("input", verifierDisponibiliteCreneau);

  inputDebut.addEventListener("change", function () {
    if (inputDebut.value) {
      inputFin.min = inputDebut.value;
      if (inputFin.value && inputFin.value < inputDebut.value) {
        inputFin.value = inputDebut.value;
      }
    }
    verifierDisponibiliteCreneau();
  });
  inputFin.addEventListener("change", verifierDisponibiliteCreneau);
}

function verifierDisponibiliteCreneau() {
  var overlay = document.getElementById("panel-reservation");
  if (!overlay || overlay.hidden || reservationEnCours) return;

  var idPlace = document.getElementById("res_id_place").value;
  var debut = document.getElementById("res_heure_debut").value;
  var fin = document.getElementById("res_heure_fin").value;
  if (!idPlace || !debut || !fin) return;

  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET",
    "Traitement/verifier_disponibilite.php?id_place=" +
      encodeURIComponent(idPlace) +
      "&heure_debut=" +
      encodeURIComponent(debut) +
      "&heure_fin=" +
      encodeURIComponent(fin) +
      "&t=" +
      new Date().getTime(),
    true,
  );

  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    if (overlay.hidden || reservationEnCours) return;
    if (document.getElementById("res_id_place").value !== idPlace) return;

    var r;
    try {
      r = JSON.parse(xhr.responseText);
    } catch (e) {
      return;
    }

    var modal = overlay.querySelector(".modal");
    var msg = document.getElementById("msg-conflit-live");
    var btn = document.getElementById("btn-soumettre-res");

    if (r.disponible) {
      modal.classList.remove("alerte-conflit");
      msg.innerText = "";
      btn.disabled = false;
    } else {
      if (!modal.classList.contains("alerte-conflit"))
        modal.classList.add("alerte-conflit");
      msg.innerText =
        r.message || "Cette place n'est plus disponible sur ce créneau.";
      btn.disabled = true;
    }
  };
  xhr.send(null);
}

function selectionnerPlace(id, numero, etat, mienne) {
  if (!window.estConnecte) {
    afficherToast(
      "Connectez-vous dans la colonne de gauche pour réserver une place.",
      "info",
    );
    var carte = document.getElementById("carte-compte"); // on met en évidence la carte de connexion
    var champ = document.getElementById("login_identifiant"); // on met le focus sur le champ identifiant
    // on fait un petit effet visuel pour attirer l'attention
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
  clearTimeout(timerFermeture);

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
  clearInterval(timerDispo);
  timerDispo = setInterval(verifierDisponibiliteCreneau, 2000);
  verifierDisponibiliteCreneau();
}

function fermerReservation() {
  clearTimeout(timerFermeture);
  clearInterval(timerDispo);
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
  xhr.setRequestHeader("Content-Type", "application/json");

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

  xhr.send(
    JSON.stringify({ id_place: idPlace, heure_debut: debut, heure_fin: fin }),
  );
}
