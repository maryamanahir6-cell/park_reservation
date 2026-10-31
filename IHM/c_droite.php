<div class="col-left">
    <h2>Plan du Parking</h2>
    <p><small>Cliquez sur une place <b>Libre (Verte)</b> pour réserver.</small></p>
    
    <div id="parking-lot" class="parking-lot">
        <!-- Généré dynamiquement par AJAX -->
    </div>

    <div id="panel-reservation" class="reservation-panel" style="display:none;">
        <h3 id="titre-reservation">Réservation de la Place</h3>
        <div id="msg-conflit-live" style="color:#c0392b; font-weight:bold; margin-bottom:10px;"></div>
        
        <form id="form-reservation" onsubmit="effectuerReservation(event);">
            <input type="hidden" id="res_id_place">
            
            <label for="res_heure_debut">Heure de Début :</label>
            <input type="datetime-local" id="res_heure_debut" required>

            <label for="res_heure_fin">Heure de Fin :</label>
            <input type="datetime-local" id="res_heure_fin" required>

            <button type="submit" id="btn-soumettre-res" style="margin-top:15px;">Confirmer la Réservation</button>
        </form>
        <div id="msg-retour-res" style="margin-top:10px;"></div>
    </div>
</div>