<aside class="col-left-side card" id="carte-compte">
    <?php if (!$estConnecte): ?>
        <!-- Formulaire de Connexion -->
        <div class="login-head">
            <span class="login-icon">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>
            </span>
            <h2>Connexion</h2>
            <p class="muted">Connectez-vous pour réserver votre place.</p>
        </div>

        <div id="msg-login" class="msg-erreur" role="alert"></div>

        <form onsubmit="connecter(event);" class="form-stack">
            <div class="field">
                <label for="login_identifiant">Identifiant</label>
                <input type="text" id="login_identifiant" autocomplete="username" placeholder="Votre identifiant" required>
            </div>

            <div class="field">
                <label for="login_mdp">Mot de passe</label>
                <input type="password" id="login_mdp" autocomplete="current-password" placeholder="••••••••" required>
            </div>

            <button type="submit" class="btn btn-primary btn-block">Se connecter</button>
        </form>
    <?php else: ?>
        <!-- Dashboard Client -->
        <div class="user-head">
            <div class="avatar"><?= htmlspecialchars(mb_strtoupper(mb_substr($nomUtilisateur, 0, 2))) ?></div>
            <div class="user-meta">
                <span class="muted small">Bonjour,</span>
                <strong><?= htmlspecialchars($nomUtilisateur) ?></strong>
            </div>
            <button onclick="deconnecter();" class="btn btn-ghost btn-sm" title="Se déconnecter">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
                Quitter
            </button>
        </div>

        <div class="section-title">
            <h3>Mes réservations</h3>
            <span class="count-badge" id="nb-reservations">0</span>
        </div>

        <div id="conteneur-mes-reservations">
            <p class="muted">Chargement de vos réservations...</p>
        </div>
    <?php endif; ?>
</aside>
