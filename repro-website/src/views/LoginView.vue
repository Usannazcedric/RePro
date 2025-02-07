<template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div>
          <label for="username">Nom d'utilisateur:</label>
          <input type="text" id="username" v-model="username" required>
        </div>
        <div>
          <label for="password">Mot de passe:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <div>
          <button type="submit">Se connecter</button>
        </div>
      </form>
      <div>
        <button @click="redirectToRegister">Créer un compte</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      async login() {
        try {
          const response = await fetch('http://localhost:1337/api/auth/local', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              identifier: this.username,
              password: this.password
            })
          });
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.jwt); 
            window.location.href = '/profile'; 
          } else {
            const errorData = await response.json();
            console.error(`Erreur lors de la connexion: ${errorData.message}`);
          }
        } catch (error) {
          console.error('Erreur:', error);
        }
      },
      redirectToRegister() {
        window.location.href = '/register';
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