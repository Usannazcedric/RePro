<template>
  <div class="profile-page">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="static-section">
        <h2>{{ username }}</h2>
        <div class="profile-picture"></div>
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
        <button @click="logout">Se déconnecter</button>
      </nav>
    </div>
    
    <!-- Content Area -->
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      prenom: '',
      nom: '',
      progress: 50 // Exemple de progression
    };
  },
  created() {
    this.checkAuthentication();
  },
  methods: {
    async checkAuthentication() {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
      } else {
        this.fetchUserProfile();
      }
    },
    async fetchUserProfile() {
      try {
        const response = await fetch('http://localhost:1337/api/users/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          this.username = data.username;
          this.email = data.email;
          this.prenom = data.Prenom;
          this.nom = data.Nom;
        } else {
          console.error('Erreur lors de la récupération du profil utilisateur.');
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    },
    logout() {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
}
</script>

<style>
.profile-page {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 300px;
  background-color: #f8f9fa;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.static-section {
  text-align: center;
  margin-bottom: 20px;
}
.profile-picture {
  width: 100px;
  height: 100px;
  background-color: #ccc;
  border-radius: 50%;
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
}
.navigation a, .navigation button {
  text-decoration: none;
  color: black;
  padding: 10px;
  border-radius: 5px;
  transition: 0.3s;
}
.navigation a:hover, .navigation button:hover {
  background-color: #007BFF;
  color: white;
}
.content {
  flex: 1;
  padding: 20px;
}
</style>
