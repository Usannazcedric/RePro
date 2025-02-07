<template>
    <div>
      <h1>Login</h1>
      <form action="/login" method="POST">
        <div>
          <label for="username">Nom d'utilisateur:</label>
          <input type="text" id="username" name="username" required>
        </div>
        <div>
          <label for="password">Mot de passe:</label>
          <input type="password" id="password" name="password" required>
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
    methods: {
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