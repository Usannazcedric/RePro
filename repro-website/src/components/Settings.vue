<template>
  <div class="settings-grid">
    <!-- Colonne gauche -->
    <div class="settings-left">
      <h2 class="section-title">Vérifications</h2>

      <div class="settings-block">
        <h3 class="settings-subtitle">Langues</h3>
        <div class="input-row">
          <label class="settings-label">Langues :</label>
          <select class="settings-input">
            <option>🇫🇷 Français</option>
            <option>🇬🇧 Anglais</option>
          </select>
        </div>
      </div>

      <div class="settings-block">
        <h3 class="settings-subtitle">Autre</h3>
        <div class="switch-row">
          <span>Désactiver les notifications</span>
          <label class="switch">
            <input type="checkbox" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="switch-row">
          <span>Activer le dark mode</span>
          <label class="switch">
            <input type="checkbox" checked />
            <span class="slider"></span>
          </label>
        </div>
        <div class="switch-row">
          <span>Recevoir des <a href="#" class="blue-link">Actualités et Offres</a></span>
          <label class="switch">
            <input type="checkbox" />
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>

    <!-- Colonne droite -->
    <div class="settings-right">
      <div class="settings-block">
        <h3 class="settings-subtitle">2FA</h3>
        <div class="twofa-block">
          <div>
            <div class="twofa-label">Authentification à deux facteurs</div>
            <div class="twofa-status">2FA Désactivé</div>
          </div>
          <button class="main-save-btn">Activer 2FA</button>
        </div>
      </div>
      <div class="settings-block">
        <h3 class="settings-subtitle">Suppression du compte</h3>
        <div class="delete-block">
          <p>
            Vous pouvez utiliser cette fonctionnalité pour demander la suppression de votre compte. Une fois la demande effectuée, l'accès à vos formations et données personnelles sera désactivé, mais vous pourrez encore, durant un court délai, récupérer vos certificats ou contacter notre support en cas de besoin.
          </p>
          <button class="main-save-btn danger">Supprimer le compte</button>
          <div class="delete-warning">
            <span class="warning-icon">⚠️</span>
            Une fois votre compte supprimé, il sera impossible de revenir en arrière, même en cas de changement d'avis ou de demande de réactivation future.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings'
}
</script>

<style scoped>
.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  padding: 32px 24px;
  align-items: start;
}

.settings-left, .settings-right {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.section-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 24px;
  color: #7376FF;
  font-family: 'Nunito', sans-serif;
}
.settings-block {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-subtitle {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 18px;
  color: #7376FF;
}
.input-row {
  display: flex;
  align-items: center;
  gap: 18px;
}
.settings-label {
  font-weight: 600;
  color: #444;
}
.settings-input {
  /* padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #D2D6E8; */
  background: #fff;
  font-size: 0.95rem;
  font-family: 'Nunito', sans-serif;
  color: #222;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}
.settings-input:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px #7376FF;
}
.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  font-size: 1.05rem;
}
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ececec;
  border-radius: 24px;
  transition: .4s;
}
.switch input:checked + .slider {
  background-color: #7376FF;
}
.slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: .4s;
}
.switch input:checked + .slider:before {
  transform: translateX(20px);
}
.blue-link {
  color: #7376FF;
  text-decoration: underline;
}
.twofa-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 0;
  margin-bottom: 10px;
}
.twofa-label {
  font-weight: 600;
  color: #444;
  margin-bottom: 4px;
}
.twofa-status {
  color: #bbb;
  font-size: 1rem;
  margin-bottom: 0;
}
.main-save-btn {
  background: #7376FF;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 700;
  font-family: 'Nunito', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
}
.main-save-btn:hover {
  background: #5d60d6;
}
.main-save-btn.danger {
  background: #7376FF;
  color: #fff;
  margin-top: 18px;
}
.delete-block {
  padding: 18px 0;
}
.delete-warning {
  display: flex;
  align-items: center;
  padding: 12px 0;
  margin-top: 16px;
  font-size: 0.98rem;
}
.warning-icon {
  font-size: 1.3rem;
  margin-right: 10px;
}
@media (max-width: 900px) {
  .settings-grid {
    flex-direction: column;
    gap: 0;
  }
  .settings-left, .settings-right {
    min-width: 0;
  }
}
</style>