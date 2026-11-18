var placeSelectionneeId = null;
var placeSelectionneeNumero = "";
var derniereReponsePlaces = null;
var timerFermeture = null;
var reservationEnCours = false;
var timerDispo = null;
var ICONE_CHECK =
  '<svg class="icone-check" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg>';

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

function parserDate(s) {
  return new Date(String(s).replace(" ", "T"));
}

function jourCourt(d) {
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function heureCourte(d) {
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
