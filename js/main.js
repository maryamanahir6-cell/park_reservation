window.onload = function () {
  chargerParking();
  chargerMesReservations();
  initialiserRestrictions(); // initialisation des restrictions de date et heure pour le formulaire de réservation

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

  var overlay = document.getElementById("panel-reservation");
  overlay.addEventListener("mousedown", function (e) {
    if (e.target === overlay) fermerReservation();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fermerReservation();
  });

  setInterval(chargerParking, 1000);
  setInterval(chargerMesReservations, 60000);
};
