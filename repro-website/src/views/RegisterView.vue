<template>
    <div class="register-wrapper">
      <div class="register-container">

        <img src="../public/Logo.svg" alt="Background" class="background-image" />

        <div class="left-section">
          <p>Salut</p>
        </div>
        <div class="right-section">
          <h1>Créer un compte</h1>
          <form @submit.prevent="register" v-if="!isRegistered">
            <div class="input-container">
              <label for="username">Nom d'utilisateur</label>
              <input type="text" id="username" v-model="username" required>
            </div>
            <div class="input-container">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="email" required>
            </div>
            <div class="password-container">
              <div class="input-container">
                <label for="password">Mot de passe</label>
                <input type="password" id="password" v-model="password" required>
              </div>
              <div class="input-container">
                <label for="confirmPassword">Confirmer le mot de passe</label>
                <input type="password" id="confirmPassword" v-model="confirmPassword" required>
              </div>
            </div>
            <button type="submit" class="submit-button">Suivant</button>
          </form>
          <form @submit.prevent="updateUserDetails" v-else>
            <div class="input-container">
              <label for="prenom">Prénom</label>
              <input type="text" id="prenom" v-model="prenom" required>
            </div>
            <div class="input-container">
              <label for="nom">Nom</label>
              <input type="text" id="nom" v-model="nom" required>
            </div>
            <div class="input-container">
              <label for="biographie">Biographie</label>
              <input type="text" id="biographie" v-model="biographie" required>
            </div>
            <div class="input-container">
              <label for="birth">Date de naissance</label>
              <input type="date" id="birth" v-model="birth" required>
            </div>
            <button type="submit" class="submit-button">Mettre à jour les informations</button>
          </form>
          <div v-if="isRegistered">
            <button @click="redirectToProfile" class="submit-button">Suivant</button>
          </div>
          <div class="login-link">
            <span>Déjà membre ? <a @click="redirectToLogin">Connectez-vous</a></span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      prenom: '',
      nom: '',
      biographie: '',
      birth: '',
      isRegistered: false,
      userId: null
    };
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        console.error('Les mots de passe ne correspondent pas.');
        return;
      }
      try {
        const response = await fetch('http://localhost:1337/api/auth/local/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            email: this.email,
            password: this.password
          })
        });
        if (response.ok) {
          const data = await response.json();
          this.userId = data.user.id;
          localStorage.setItem('token', data.jwt);
          this.isRegistered = true;
        } else {
          const errorData = await response.json();
          console.error(`Erreur lors de l'inscription: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    },
    async updateUserDetails() {
      try {
        const response = await fetch(`http://localhost:1337/api/users/${this.userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            Prenom: this.prenom,
            Nom: this.nom,
            Biographie: this.biographie,
            Birth: this.birth
          })
        });
        if (response.ok) {
          this.isProfileUpdated = true;
        } else {
          const errorData = await response.json();
          console.error(`Erreur lors de la mise à jour des informations: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    },
    redirectToProfile() {
      window.location.href = '/profile';
    },
    redirectToLogin() {
      window.location.href = '/login';
    }
  }
}
</script>

<style scoped>
h1 {
  color: white;
  font-size: 35px;
  margin-bottom: 50px;
}

.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.register-container {
  display: flex;
  width: 90vw;
  height: 72vh;
  border-radius: 40px;
  background-color: rgba(38, 39, 52, 0.9);
  position: relative;
  overflow: hidden;
}


.background-image {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 300px; 
  height: auto;
  z-index: -1;
  opacity: 0.8;
}

.left-section, .right-section {
  width: 50%;
  padding: 20px;
}

.left-section {
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.right-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.input-container {
  background-color: #2b2b3b;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  width: 100%;
  color: #bbb;
  position: relative;
  margin-bottom: 10px;
}

.input-container label {
  font-size: 12px;
  position: absolute;
  top: -10px;
  left: 10px;
  background-color: #2b2b3b;
  padding: 2px 5px;
  border-radius: 5px;
}

.input-container input {
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  outline: none;
  flex-grow: 1;
  padding: 8px;
}

.password-container {
  display: flex;
  gap: 10px;
}

button.submit-button {
  width: 100%;
  height: 40px;
  background-color: #0084FF;
  color: white;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

button.submit-button:hover {
  background-color: #007BFF;
  box-shadow: 0 0 10px #007BFF;
}

.login-link {
  text-align: right;
  margin-top: 10px;
}

.login-link a {
  color: #0084FF;
  cursor: pointer;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
