<template>
    <div>
      <h1>Mon Profil</h1>
      <p>Nom d'utilisateur : {{ username }}</p>
      <p>Email : {{ email }}</p>
      <p>Prénom : {{ prenom }}</p>
      <p>Nom : {{ nom }}</p>
      <p>Biographie : {{ biographie }}</p>
      <p>Date de naissance : {{ birth }}</p>
      <button @click="logout">Déconnexion</button>
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
        biographie: '',
        birth: ''
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
            this.biographie = data.Biographie;
            this.birth = data.Birth;
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
    div {
      margin-bottom: 10px;
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