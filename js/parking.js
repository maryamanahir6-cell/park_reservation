function htmlVoiture() {
  return '<svg class="car" viewBox="0 0 60 110"><use href="#car-shape"/></svg>';
}

var etatsConnusParPlace = Object.create(null);

function htmlPlace(p, rang) {
  var position = rang <= 2 ? "haut" : "bas";
  var estOccupee = p.etat !== "Libre";
  var mienne = !!p.mienne; // convertit en booléen
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

function chargerParking() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "Traitement/get_places.php?t=" + new Date().getTime(), true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    if (xhr.responseText === derniereReponsePlaces) return;

    var places;
    try {
      places = JSON.parse(xhr.responseText);
    } catch (e) {
      return;
    }
    derniereReponsePlaces = xhr.responseText;

    var nb = places.length;
    var colonnes = Math.ceil(nb / 4); //ceiling pour arrondir au supérieur
    var html = "";

    for (var i = 0; i < nb; i++) {
      var place = places[i]; // place courante
      var idPlace = String(place.id);
      var etatPrecedent = etatsConnusParPlace[idPlace];

      if (
        etatPrecedent === "Libre" &&
        place.etat === "Occupée" &&
        window.estConnecte &&
        !place.mienne
      ) {
        afficherToast(
          "La place " + place.numero + " est maintenant occupée.",
          "ok",
        );
      }

      etatsConnusParPlace[idPlace] = place.etat;
    }

    for (var k = 0; k < colonnes; k++) {
      html += '<div class="parking-col">';
      for (var j = 0; j < 4; j++) {
        var p = places[4 * k + j];
        html += p
          ? htmlPlace(p, j + 1)
          : '<div class="slot slot-vide rang' + (j + 1) + '"></div>';
        if (j === 1)
          html += '<div class="lane-cell"><span>' + (k + 1) + "</span></div>";
      }
      html += "</div>";
    }

    document.getElementById("parking-lot").innerHTML = html;

    var libres = 0;
    for (var i = 0; i < nb; i++) {
      if (places[i].etat === "Libre" || places[i].mienne) libres++;
    }
    var stats = document.getElementById("parking-stats");
    if (stats) {
      stats.innerHTML = "<b>" + libres + "</b> / " + nb + " disponibles";
      stats.className = "stats-chip" + (libres === 0 ? " stats-plein" : "");
    }
  };
  xhr.send(null);
}
