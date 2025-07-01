<template>
  <div class="settings-grid">
    <!-- Colonne gauche -->
    <div class="settings-left">

      <div class="settings-block">
        <h3 class="settings-subtitle">Langues</h3>
        <div class="language-selector">
          <div class="custom-select" @click="toggleDropdown" :class="{ active: dropdownOpen }">
            <div class="selected-option">
              <span class="flag">🇫🇷 </span>
              <span>Français</span>
            </div>
            <div class="dropdown-arrow">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div v-if="dropdownOpen" class="dropdown-options">
              <div class="dropdown-option" @click.stop="selectLanguage('fr')">
                <span class="flag">🇫🇷 </span>
                <span>Français</span>
              </div>
              <div class="dropdown-option" @click.stop="selectLanguage('en')">
                <span class="flag">🇬🇧 </span>
                <span>Anglais</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="settings-block">
        <h3 class="settings-subtitle">Autre</h3>
        <div class="switch-row">
          <span class="span-title">Désactiver les notifications</span>
          <label class="switch">
            <input type="checkbox" v-model="notifications" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="switch-row">
          <span class="span-title">Activer le dark mode</span>
          <label class="switch">
            <input type="checkbox" v-model="darkMode" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="switch-row">
          <span class="span-title" >Recevoir des <a href="#" class="blue-link">Actualités et Offres</a></span>
          <label class="switch">
            <input type="checkbox" v-model="newsletter" />
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
          <button class="twofa-button">Activer 2FA</button>
        </div>
      </div>
      <div class="settings-block">
        <h3 class="settings-subtitle">Suppression du compte</h3>
        <div class="delete-block">
          <p class="delete-text">
            Vous pouvez utiliser cette fonctionnalité pour demander la suppression de votre compte. Une fois la demande effectuée, l'accès à vos formations et données personnelles sera désactivé, mais vous pourrez encore, durant un court délai, récupérer vos certificats ou contacter notre support en cas de besoin.
          </p>
          <button class="main-save-btn">Supprimer le compte</button>
        </div>
        <div class="delete-warning">
          <div class="warning-icon">
            <svg width="20" height="21" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 28C16.6418 28.002 18.2679 27.6796 19.7847 27.0513C21.3015 26.423 22.6793 25.5012 23.8388 24.3388C25.0012 23.1793 25.923 21.8015 26.5513 20.2847C27.1796 18.7679 27.502 17.1418 27.5 15.5C27.502 13.8582 27.1796 12.2322 26.5513 10.7153C25.923 9.19848 25.0012 7.82074 23.8388 6.66126C22.6793 5.49886 21.3015 4.57702 19.7847 3.94871C18.2679 3.32039 16.6418 2.99798 15 3.00001C13.3582 2.99798 11.7322 3.32039 10.2153 3.94871C8.69848 4.57702 7.32074 5.49886 6.16126 6.66126C4.99886 7.82074 4.07702 9.19848 3.44871 10.7153C2.82039 12.2322 2.49798 13.8582 2.50001 15.5C2.49798 17.1418 2.82039 18.7679 3.44871 20.2847C4.07702 21.8015 4.99886 23.1793 6.16126 24.3388C7.32074 25.5012 8.69848 26.423 10.2153 27.0513C11.7322 27.6796 13.3582 28.002 15 28Z" stroke="#7376FF" stroke-width="2.16667" stroke-linejoin="round"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M15 23.625C15.4144 23.625 15.8118 23.4604 16.1049 23.1674C16.3979 22.8743 16.5625 22.4769 16.5625 22.0625C16.5625 21.6481 16.3979 21.2507 16.1049 20.9576C15.8118 20.6646 15.4144 20.5 15 20.5C14.5856 20.5 14.1882 20.6646 13.8951 20.9576C13.6021 21.2507 13.4375 21.6481 13.4375 22.0625C13.4375 22.4769 13.6021 22.8743 13.8951 23.1674C14.1882 23.4604 14.5856 23.625 15 23.625Z" fill="#7376FF"/>
              <path d="M15 8V18" stroke="#7376FF" stroke-width="2.16667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="warning-text">
            Une fois votre compte supprimé, il sera impossible de revenir en arrière, même en cas de changement d'avis ou de demande de réactivation future.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      dropdownOpen: false,
      selectedLanguage: 'fr',
      notifications: false,
      darkMode: true,
      newsletter: false
    }
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    selectLanguage(lang) {
      this.selectedLanguage = lang;
      this.dropdownOpen = false;
    }
  },
  mounted() {
    // Fermer le dropdown quand on clique ailleurs
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.dropdownOpen = false;
      }
    });
  }
}
</script>

<style scoped>

.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.75rem;
  padding: 2rem 1.5rem;
  align-items: start;
}

.settings-left, .settings-right {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

}

.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #000;
  font-family: 'Nunito', sans-serif;
}
.settings-block {
  /* background-color: grey; */
  /* display: flex; */
  flex-direction: column;
  /* gap: 20px; */
}

.settings-subtitle {
  font-size: 1.15rem;
  font-weight: 700;
  color: #000;
}

.delete-block {
  display: flex;
  flex-direction: column;
  border: 1px solid #e1e5e9;
  border-radius: 0.5rem;
  padding: 0.875rem;
}

.delete-text {
  color : #808080;
  font-size: 0.75rem;
  margin: 0;
}

.main-save-btn {
  background: #7376FF;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-family: 'Nunito', sans-serif;
  cursor: pointer;
  margin-top: 1.125rem;
  /* transition: background 0.2s; */
}

.language-selector {
  /* background-color: blue; */
  display: flex;
  align-items: center;
  gap: 1.125rem;

  margin-top: 2.75rem;
}

.custom-select {
  position: relative;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.custom-select:hover {
  border-color: #7376FF;
}

.custom-select.active {
  border-color: #7376FF;
}

.selected-option {
  /* display: flex; */
  align-items: center;
  gap: 0.5rem;
}

.flag {
  font-size: 1.1rem;
}

.dropdown-arrow {
  transition: transform 0.2s ease;
}

.custom-select.active .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e1e5e9;
  border-top: none;
  border-radius: 0 0 0.5rem 0.5rem;
  z-index: 10;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1);
}

.dropdown-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-option:hover {
  background-color: #f8f9fa;
}

.dropdown-option:last-child {
  border-radius: 0 0 0.5rem 0.5rem;
}
.input-row {
  display: flex;
  align-items: center;
  gap: 1.125rem;
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
  margin-bottom: 1.25rem;
  font-size: 1rem;
  color: #374151;
  padding: 0.938rem;
  border: 1px solid #e1e5e9;
  border-radius: 0.75rem;
}

.span-title {
  font-size: 0.75rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 2.5rem;
  height: 1.25rem;
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
  background-color: #E5E7EB;
  border-radius: 1.25rem;
  transition: .3s;
}

.switch input:checked + .slider {
  background-color: #7376FF;
}

.slider:before {
  position: absolute;
  content: '';
  height: 1rem;
  width: 1rem;
  left: 0.125rem;
  bottom: 0.125rem;
  background-color: white;
  border-radius: 50%;
  transition: .3s;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
}

.switch input:checked + .slider:before {
  transform: translateX(1.25rem);
}
.blue-link {
  color: #7376FF;
  text-decoration: underline;
}
.twofa-block {
  /* background-color: blue; */
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e1e5e9;
  border-radius: 0.75rem;
  padding: 0.9375rem;
  /* margin-bottom: 10px; */
}
.twofa-label {
  font-size: 0.75rem;
  color: #808080;
  margin-bottom: 0.25rem;
}
.twofa-status {
  color: #444;
  font-size: 0.75rem;
  margin-bottom: 0;
}

.twofa-button {
  background: #7376FF;
  color: #fff;
  border: none;
  border-radius: 0.375rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: 'Nunito', sans-serif;
  cursor: pointer;
}

.main-save-btn:hover {
  background: #5d60d6;
}
.main-save-btn.danger {
  background: #7376FF;
  color: #fff;
  margin-top: 1.125rem;
}
.delete-warning {
  display: flex;
  align-items: center;
  padding: 0.625rem 0.938rem;
  margin-top: 2.5rem;
  font-size: 0.98rem;
  border: 0.063rem solid #7376FF;
  border-radius: 12px;
}
.warning-icon {
  display: flex;
  align-items: center;
  margin-right: 0.625rem;
  flex-shrink: 0;
}

.warning-text {
  font-size: 0.75rem;
  color : #808080;
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