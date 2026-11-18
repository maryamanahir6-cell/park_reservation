var places = [
  { numero: "A01", etat: "Libre" },
  { numero: "A02", etat: "Occupée" },
];

var html = ""; // un texte vide au départ

for (var i = 0; i < places.length; i++) {
  // pour chaque place...
  if (places[i].etat === "Libre") {
    html += "<button>" + places[i].numero + "</button>"; // ...un bouton avec le numéro
  } else {
    html += "<button>🚗</button>"; // ...ou une voiture
  }
}

document.getElementById("parking-lot").innerHTML = html; // on colle tout dans la page
