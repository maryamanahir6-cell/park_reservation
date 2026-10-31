<section class="col-right-main card">
    <div class="plan-head">
        <div>
            <h2>Plan du parking</h2>
            <p class="muted">Sélectionnez une place disponible pour la réserver.</p>
        </div>
        <div class="stats-chip" id="parking-stats">—</div>
    </div>

    <!-- Légende -->
    <ul class="legend">
        <li><span class="mini-pill mini-free"></span> Libre</li>
        <li><span class="mini-car"><svg viewBox="0 0 60 110"><use href="#car-shape"/></svg></span> Occupée</li>
        <li><span class="mini-pill mini-mine"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="#16a34a" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></span> Ma réservation</li>
    </ul>

    <!-- Plan : structure type "plan de cabine" pivotée à 90° -->
    <div class="parking-wrap">
        <div id="parking-lot" class="parking-lot">
            <!-- Généré dynamiquement par AJAX -->
        </div>
    </div>

    <!-- Symbole voiture (vue du dessus) réutilisé partout -->
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
        <defs>
            <g id="car-shape">
                <rect x="4" y="22" width="5" height="15" rx="2" fill="#15171c"/>
                <rect x="51" y="22" width="5" height="15" rx="2" fill="#15171c"/>
                <rect x="4" y="76" width="5" height="15" rx="2" fill="#15171c"/>
                <rect x="51" y="76" width="5" height="15" rx="2" fill="#15171c"/>
                <path d="M30 2 C42 2 50 8 51 22 L52 40 L52 86 C52 100 46 108 30 108 C14 108 8 100 8 86 L8 40 L9 22 C10 8 18 2 30 2 Z" fill="currentColor"/>
                <path d="M30 2 C18 2 10 8 9 22 L8 40 L8 86 C8 100 14 108 30 108 Z" fill="#fff" opacity=".13"/>
                <path d="M14 40 Q30 32 46 40 L43 57 H17 Z" fill="#17212f"/>
                <rect x="16" y="57" width="28" height="23" rx="5" fill="#000" opacity=".2"/>
                <path d="M17 80 H43 L46 92 Q30 98 14 92 Z" fill="#17212f"/>
                <path d="M13 17 Q18 12 25 13 L23 19 Q17 19 13 21 Z" fill="#fff6c4"/>
                <path d="M47 17 Q42 12 35 13 L37 19 Q43 19 47 21 Z" fill="#fff6c4"/>
                <rect x="12" y="100" width="12" height="3.5" rx="1.7" fill="#ff4d4d"/>
                <rect x="36" y="100" width="12" height="3.5" rx="1.7" fill="#ff4d4d"/>
                <ellipse cx="5.5" cy="45" rx="3.2" ry="4.5" fill="currentColor"/>
                <ellipse cx="54.5" cy="45" rx="3.2" ry="4.5" fill="currentColor"/>
            </g>
        </defs>
    </svg>
</section>

<!-- ============ POP-UP DE RÉSERVATION (fenêtre modale) ============ -->
<div id="panel-reservation" class="modal-overlay" hidden>
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="titre-reservation">
        <button type="button" class="modal-close" onclick="fermerReservation();" aria-label="Fermer">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>

        <div class="modal-head">
            <div class="modal-badge" id="modal-place-badge">—</div>
            <div>
                <h3 id="titre-reservation">Réserver la place</h3>
                <p class="muted small">Choisissez votre créneau de stationnement</p>
            </div>
        </div>

        <div id="msg-conflit-live" class="msg-erreur" role="alert"></div>

        <form id="form-reservation" class="form-stack" onsubmit="effectuerReservation(event);">
            <input type="hidden" id="res_id_place">

            <div class="field">
                <label for="res_heure_debut">Heure de début</label>
                <input type="datetime-local" id="res_heure_debut" required>
            </div>

            <div class="field">
                <label for="res_heure_fin">Heure de fin</label>
                <input type="datetime-local" id="res_heure_fin" required>
            </div>

            <div id="msg-retour-res" class="msg-retour" role="status"></div>

            <div class="modal-actions">
                <button type="button" class="btn btn-ghost" onclick="fermerReservation();">Annuler</button>
                <button type="submit" id="btn-soumettre-res" class="btn btn-primary">Confirmer la réservation</button>
            </div>
        </form>
    </div>
</div>
