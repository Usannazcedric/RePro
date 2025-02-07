<template>
    <div>
      <h1>Créer un compte</h1>
      <form @submit.prevent="register" v-if="!isRegistered">
        <div>
          <label for="username">Nom d'utilisateur:</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div>
          <label for="password">Mot de passe:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <div>
          <label for="confirmPassword">Confirmer le mot de passe:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required>
        </div>
        <div>
          <button type="submit">Suivant</button>
        </div>
      </form>
      <form @submit.prevent="updateUserDetails" v-else>
        <div>
          <label for="prenom">Prénom:</label>
          <input type="text" id="prenom" v-model="prenom" required>
        </div>
        <div>
          <label for="nom">Nom:</label>
          <input type="text" id="nom" v-model="nom" required>
        </div>
        <div>
          <label for="biographie">Biographie:</label>
          <input type="text" id="biographie" v-model="biographie" required>
        </div>
        <div>
          <button type="submit">Mettre à jour les informations</button>
        </div>
      </form>
      <div>
        <button @click="redirectToLogin">Se connecter</button>
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
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              prenom: this.prenom,
              nom: this.nom,
              Biographie: this.biographie
            })
          });
          if (!response.ok) {
            const errorData = await response.json();
            console.error(`Erreur lors de la mise à jour des informations: ${errorData.message}`);
          }
        } catch (error) {
          console.error('Erreur:', error);
        }
      },
      redirectToLogin() {
        window.location.href = '/login';
      }
    }
  }
  </script>
  
  <style>
    div {
      margin-bottom: 10px;
    }
    label {
      display: block;
      margin-bottom: 5px;
    }
    input {
      width: 100%;
      padding: 8px;
      box-sizing: border-box;
    }
    button {
      padding: 10px 15px;
      background-color: #007BFF;
      color: white;
      border: none;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
  </style>