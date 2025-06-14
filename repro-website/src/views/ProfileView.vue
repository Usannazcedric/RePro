<template>
  <div class="profile-page">
    <div class="sidebar">
      <div class="static-section centered-content">
        <div class="profile-picture"></div>
        <h2>{{ userProfile?.username || 'Chargement...' }}</h2>
        <div class="progress-bar">
          <div class="progress" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
      <nav class="navigation">
        <RouterLink to="/profile/notifications">Notifications</RouterLink>
        <RouterLink to="/profile/profile">Profil</RouterLink>
        <RouterLink to="/profile/statistics">Statistiques</RouterLink>
        <RouterLink to="/profile/affiliates">Affiliés</RouterLink>
        <RouterLink to="/profile/privacy">Confidentialité</RouterLink>
        <RouterLink to="/profile/verification">Vérification en cours</RouterLink>
        <RouterLink to="/profile/settings">Paramètres</RouterLink>
        <RouterLink to="/profile/transactions">Transactions</RouterLink>
        <a href="#" @click.prevent="logout" class="logout-link">Se déconnecter</a>
      </nav>
    </div>
    
    <div class="content">
      <div v-if="userProfile" class="user-info">
        <h2>Informations du profil</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>Nom d'utilisateur</label>
            <p>{{ userProfile.username }}</p>
          </div>
          <div class="info-item">
            <label>Email</label>
            <p>{{ user?.email }}</p>
          </div>
          <div class="info-item">
            <label>Prénom</label>
            <p>{{ userProfile.prenom || 'Non renseigné' }}</p>
          </div>
          <div class="info-item">
            <label>Nom</label>
            <p>{{ userProfile.nom || 'Non renseigné' }}</p>
          </div>
        </div>
      </div>
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
      progress: 50
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
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error.message);
      }
    },

    async logout() {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        // Nettoyer le localStorage
        localStorage.removeItem('userProfile');
        
        // Rediriger vers la page de connexion
        window.location.href = '/login';
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error.message);
      }
    }
  }
}
</script>

<style scoped>
.user-info {
  padding: 20px;
  color: white;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.info-item {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
}

.info-item label {
  color: #AEB2C2;
  font-size: 0.9em;
  margin-bottom: 5px;
  display: block;
}

.info-item p {
  margin: 0;
  font-size: 1.1em;
}

.centered-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  font-size: 0.9em;
  color: white;
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
  background-color: #20212B;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 40px;
}

.static-section {
  justify-content: center;
  text-align: center;
  margin-bottom: 20px;
  width: 100%;
}

.profile-picture {
  width: 73px;
  height: 73px;
  background-color: #0084FF;
  border-radius: 20px;
  margin: 10px 0;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #ddd;
  border-radius: 5px;
  overflow: hidden;
  margin: 10px 0;
}

.progress {
  height: 100%;
  background-color: #007BFF;
}

.navigation {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.navigation a, .logout-link {
  text-decoration: none;
  color: #AEB2C2;
  padding: 10px;
  border-radius: 5px;
  transition: 0.3s;
  cursor: pointer;
}

.navigation a:hover, .logout-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #20212B;
  border-radius: 40px;
  color: white;
}
</style>
