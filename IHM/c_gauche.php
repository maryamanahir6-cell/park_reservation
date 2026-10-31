<div class="col-right">
    <?php if (!$estConnecte): ?>
        <!-- Formulaire de Connexion -->
        <h2>Espace Connexion</h2>
        <div id="msg-login" style="color:red;"></div>
        <form onsubmit="connecter(event);">
            <label for="login_identifiant">Identifiant :</label>
            <input type="text" id="login_identifiant" required>

            <label for="login_mdp">Mot de passe :</label>
            <input type="password" id="login_mdp" required>

            <button type="submit" style="margin-top:15px;">Se Connecter</button>
        </form>
    <?php else: ?>
        <!-- Dashboard Client -->
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <h2>Bienvenue, <?= htmlspecialchars($nomUtilisateur) ?></h2>
            <button onclick="deconnecter();" class="btn-logout" style="width:auto; padding:6px 12px;">Déconnexion</button>
        </div>
        <hr>
        <h3>Mes Réservations</h3>
        <div id="conteneur-mes-reservations">
            <p>Chargement de vos réservations...</p>
        </div>
    <?php endif; ?>
</div>