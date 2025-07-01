<template>
  <div class="profile-page">
    <div class="sidebar">
      <div class="static-section centered-content">
        <div class="profile-picture-container">
          <div class="profile-picture">
            <img 
              v-if="userProfile?.avatar_url" 
              :src="userProfile.avatar_url" 
              alt="Photo de profil"
              class="profile-image"
            />
            <div v-else class="profile-initial">
              {{ (userProfile?.username || 'U').charAt(0).toUpperCase() }}
            </div>
          </div>
          <button class="edit-profile-btn" @click="triggerFileUpload" :disabled="uploading">
            <svg v-if="!uploading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            <div v-else class="upload-spinner"></div>
          </button>
          <input 
            ref="fileInput" 
            type="file" 
            accept="image/*" 
            @change="handleFileUpload" 
            style="display: none;"
          />
        </div>
        <h2>{{ userProfile?.username || 'Chargement...' }}</h2>
        <div class="separator"></div>
      </div>
      <nav class="navigation">
        <RouterLink to="/profile/profile" class="nav-link" :class="{ active: $route.path === '/profile/profile' }">
          <img :src="$route.path === '/profile/profile' ? '/profile purple.svg' : '/profile grey.svg'" class="nav-icon" alt="Profil" />
          <span>Profil</span>
        </RouterLink>
        <RouterLink to="/profile/notifications" class="nav-link" :class="{ active: $route.path === '/profile/notifications' }">
          <img :src="$route.path === '/profile/notifications' ? '/notif purple.svg' : '/notif grey.svg'" class="nav-icon" alt="Notifications" />
          <span>Notifications</span>
        </RouterLink>
        <RouterLink to="/profile/statistics" class="nav-link" :class="{ active: $route.path === '/profile/statistics' }">
          <img :src="$route.path === '/profile/statistics' ? '/stat purple.svg' : '/stat grey.svg'" class="nav-icon" alt="Statistiques" />
          <span>Statistiques</span>
        </RouterLink>
        <RouterLink to="/profile/affiliates" class="nav-link" :class="{ active: $route.path === '/profile/affiliates' }">
          <img :src="$route.path === '/profile/affiliates' ? '/affiliate purple.svg' : '/affiliate grey.svg'" class="nav-icon" alt="Affiliés" />
          <span>Affiliés</span>
        </RouterLink>
        <RouterLink to="/profile/privacy" class="nav-link" :class="{ active: $route.path === '/profile/privacy' }">
          <img :src="$route.path === '/profile/privacy' ? '/privacy purple.svg' : '/privacy grey.svg'" class="nav-icon" alt="Confidentialité" />
          <span>Confidentialité</span>
        </RouterLink>
        <RouterLink to="/profile/verification" class="nav-link" :class="{ active: $route.path === '/profile/verification' }">
          <img :src="$route.path === '/profile/verification' ? '/verif purple.svg' : '/verif grey.svg'" class="nav-icon" alt="Vérification en cours" />
          <span>Vérification en cours</span>
        </RouterLink>
        <RouterLink to="/profile/settings" class="nav-link" :class="{ active: $route.path === '/profile/settings' }">
          <img :src="$route.path === '/profile/settings' ? '/setting purple.svg' : '/setting grey.svg'" class="nav-icon" alt="Paramètres" />
          <span>Paramètres</span>
        </RouterLink>
        <RouterLink to="/profile/transactions" class="nav-link" :class="{ active: $route.path === '/profile/transactions' }">
          <img :src="$route.path === '/profile/transactions' ? '/tx purple.svg' : '/tx grey.svg'" class="nav-icon" alt="Transactions" />
          <span>Transactions</span>
        </RouterLink>
        <a href="#" @click.prevent="logout" class="logout-link">Se déconnecter</a>
      </nav>
    </div>
    
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase'

export default {
  data() {
    return {
      user: null,
      userProfile: null,
      uploading: false,
      editProfile: {
        username: '',
        email: '',
        phone: ''
      }
    };
  },
  created() {
    this.checkAuthentication();
  },
  methods: {
    async checkAuthentication() {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        console.error('Non authentifié:', error?.message);
        window.location.href = '/login';
        return;
      }
      this.user = session.user;
      await this.fetchUserProfile();
    },
    async fetchUserProfile() {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', this.user.id)
          .single();
        if (error) throw error;
        this.userProfile = profile;
        this.editProfile.username = profile.username || '';
        this.editProfile.email = this.user.email || '';
        this.editProfile.phone = profile.phone || '';
        localStorage.setItem('userProfile', JSON.stringify(profile));
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error.message);
      }
    },
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('L\'image doit faire moins de 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result;
        try {
          const { error } = await supabase
            .from('profiles')
            .update({ avatar_url: base64 })
            .eq('id', this.user.id);
          if (error) throw error;
          this.userProfile.avatar_url = base64;
          localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
          window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { avatar_url: base64 } }));
          alert('Photo de profil mise à jour avec succès !');
        } catch (error) {
          console.error('Erreur lors du téléversement:', error);
          alert('Erreur lors du téléversement de l\'image. Veuillez réessayer.');
        }
      };
      reader.readAsDataURL(file);
    },
    async updateField(field) {
      let value = this.editProfile[field];
      if (field === 'email') {
        // Met à jour l'email dans Supabase Auth
        const { error } = await supabase.auth.updateUser({ email: value });
        if (error) {
          alert("Erreur lors de la mise à jour de l'email : " + error.message);
          return;
        }
        this.user.email = value;
      } else {
        // Met à jour le champ dans la table profiles
        const { error } = await supabase
          .from('profiles')
          .update({ [field]: value })
          .eq('id', this.user.id);
        if (error) {
          alert("Erreur lors de la mise à jour : " + error.message);
          return;
        }
        this.userProfile[field] = value;
      }
      alert('Champ mis à jour !');
    },
    async saveProfile() {
      // Met à jour tous les champs d'un coup
      const { error: error1 } = await supabase.auth.updateUser({ email: this.editProfile.email });
      const { error: error2 } = await supabase
        .from('profiles')
        .update({ username: this.editProfile.username, phone: this.editProfile.phone })
        .eq('id', this.user.id);
      if (error1 || error2) {
        alert('Erreur lors de la mise à jour du profil.');
        return;
      }
      this.userProfile.username = this.editProfile.username;
      this.userProfile.phone = this.editProfile.phone;
      this.user.email = this.editProfile.email;
      alert('Profil mis à jour !');
    },
    goToVerification() {
      this.$router.push('/profile/verification');
    },
    async logout() {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        localStorage.removeItem('userProfile');
        window.location.href = '/login';
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error.message);
      }
    }
  }
}
</script>

<style>
:global(html), :global(body) {
  overflow: hidden !important;
  height: 100%;
  scrollbar-width: none; /* Firefox */
}
:global(html)::-webkit-scrollbar, :global(body)::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>

<style scoped>
.user-info {
  padding: 20px;
  color: #374151;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.info-item {
  background-color: #f9fafb;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.2s;
}

.info-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.info-item label {
  color: #6b7280;
  font-size: 0.9em;
  margin-bottom: 5px;
  display: block;
  font-weight: 500;
}

.info-item p {
  margin: 0;
  font-size: 1.1em;
  color: #111827;
  font-weight: 600;
}

.centered-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  font-size: 0.9em;
  color: #111827;
  font-weight: 600;
}

.profile-page {
  display: flex;
  max-height: calc(100vh - 40px);
  padding: 20px;
  gap: 20px;
  margin-bottom: 20px;
}

.sidebar {
  width: 300px;
  background-color: #ffffff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 40px;
  box-shadow: 0 4px 18px rgba(115, 118, 255, 0.15);
  border: 1px solid #e5e7eb;
}

.static-section {
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;
  width: 100%;
}

.profile-picture-container {
  position: relative;
  display: inline-block;
}

.profile-picture {
  width: 73px;
  height: 73px;
  background-color: #7376FF;
  border-radius: 20px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  overflow: hidden;
  position: relative;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

.profile-initial {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
}

.edit-profile-btn {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 28px;
  height: 28px;
  background-color: #7376FF;
  border: 2px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.edit-profile-btn:hover {
  background-color: #5d60d6;
  transform: scale(1.1);
}

.edit-profile-btn svg {
  width: 14px;
  height: 14px;
}

.edit-profile-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.upload-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.separator {
  width: 114%;
  height: 1.4px;
  background-color: #B7B7B7;
  margin: 10px 0;
}

.navigation {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.nav-link.active::before {
  content: "";
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 32px;
  background: #7376FF;
  border-top-right-radius: 1000000px;
  border-bottom-right-radius: 1000000px;
}


.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: #6b7280;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 1.08rem;
}

.nav-link .nav-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.nav-link.active, .nav-link.router-link-active {
  color: #7376FF;
}

.nav-link.active span, .nav-link.router-link-active span {
  color: #7376FF;
}

.logout-link {
  margin-top: 24px;
  padding: 12px 0;
  border: 1.5px solid #7376FF;
  border-radius: 14px;
  text-align: center;
  color: #7376FF;
  font-weight: 700;
  font-size: 0.95rem;
  font-family: 'Nunito', sans-serif;
  display: block;
  width: 100%;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
}

.logout-link:hover {
  background-color: #f1f2ff;
}


.content {
  flex: 1;
  padding: 20px;
  background-color: #FAFAFA;
  border-radius: 40px;
  color: #374151;
  box-shadow: 0 4px 18px rgba(115, 118, 255, 0.15);
  border: 1px solid #e5e7eb;
}

.profile-main-grid {
  display: flex;
  gap: 32px;
}

.profile-edit-section, .profile-verification-section {
  /* background: #fff; */
  /* border-radius: 24px; */
  /* box-shadow: 0 2px 8px rgba(0,0,0,0.07); */
  padding: 32px 28px;
  flex: 1;
  min-width: 340px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #7376FF;
  margin-bottom: 24px;
  font-family: 'Nunito', sans-serif;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.edit-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.edit-row label {
  min-width: 120px;
  color: #444;
  font-weight: 600;
}

.edit-input {
  flex: 1;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1.5px solid #ececec;
  background: #f8f8fa;
  font-size: 1rem;
  font-family: 'Nunito', sans-serif;
  color: #222;
  transition: border 0.2s;
}

.edit-input:focus {
  outline: none;
  border-color: #7376FF;
}

.edit-btn {
  background: #ececec;
  color: #7376FF;
  border: none;
  border-radius: 8px;
  padding: 7px 18px;
  font-weight: 700;
  font-family: 'Nunito', sans-serif;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.edit-btn:hover {
  background: #7376FF;
  color: #fff;
}

.main-save-btn {
  margin-top: 18px;
  background: #7376FF;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 0;
  font-size: 1.1rem;
  font-weight: 800;
  font-family: 'Nunito', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
}

.main-save-btn:hover {
  background: #5d60d6;
}

.profile-verification-section {
  max-width: 420px;
}

.verif-block {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.verif-level {
  background: #f8f8fa;
  border-radius: 14px;
  padding: 18px 20px 12px 20px;
  margin-bottom: 8px;
  position: relative;
}

.verif-label {
  font-weight: 700;
  color: #7376FF;
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.verif-status {
  position: absolute;
  right: 20px;
  top: 18px;
  color: #7376FF;
  font-weight: 700;
  font-size: 1rem;
}

.verif-bar {
  width: 100%;
  height: 5px;
  background: #ececec;
  border-radius: 4px;
  margin: 12px 0 0 0;
}

.verif-bar-complete {
  background: linear-gradient(90deg, #7376FF 80%, #ececec 100%);
}

.verif-bar-locked {
  background: repeating-linear-gradient(90deg, #ececec 0 80%, #d1d5db 100%);
}

.verif-complete .verif-status {
  color: #22c55e;
}

.verif-complete .verif-bar {
  background: linear-gradient(90deg, #22c55e 100%, #ececec 100%);
}

.verif-locked .verif-status {
  color: #bbb;
}

.verif-locked .verif-bar {
  background: #ececec;
}

.verif-desc {
  margin-top: 10px;
  color: #444;
  font-size: 0.98rem;
}

.verif-btn {
  margin-top: 14px;
  background: #7376FF;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 24px;
  font-size: 1rem;
  font-weight: 700;
  font-family: 'Nunito', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
}

.verif-btn:hover {
  background: #5d60d6;
}
</style>
