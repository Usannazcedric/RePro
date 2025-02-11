<template>
    <img
      src="../../public/background-register.svg"
      alt="Background"
      class="background-image"
    />
    <div class="login-wrapper">
      <div class="login-container">
        <div class="left-section">
            <div class="title-left">
                <h1>
                    Accédez à une plateforme de <span class="blue-exclamation">formations</span> enrichissantes et<br />
                    partagez votre <span class="blue-exclamation">expertise</span> avec le monde !
                </h1>
                </div>
                <h2 class="little-text">
                Connectez-vous pour retrouver vos formations, suivre votre progression et interagir avec les formateurs.
                </h2>
          <div class="buttons">
            <button class="outlined">En savoir plus</button>
          </div>
        </div>
        <div class="right-section">
          <h1>
            Connectez vous dès maintenant <span class="blue-exclamation">!</span>
          </h1>
          <form @submit.prevent="login">
            <div class="input-container">
              <label for="username">Nom d'utilisateur</label>
              <input type="text" id="username" v-model="username" required />
            </div>
            <div class="input-container">
              <label for="password">Mot de passe</label>
              <input type="password" id="password" v-model="password" required />
            </div>
            <div class="forgot-password">
              <a href="/recoverpassword">Mot de passe oublié ?</a>
            </div>
            <button type="submit" class="submit-button">Se connecter</button>
          </form>
          <div class="login-link">
            <span>Pas encore membre ? <a @click="redirectToRegister">Créer un compte</a></span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  export default {
    data() {
      return {
        username: "",
        password: "",
      };
    },
    methods: {
      async login() {
        try {
          const response = await fetch("http://localhost:1337/api/auth/local", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              identifier: this.username,
              password: this.password,
            }),
          });
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.jwt);
            window.location.href = "/profile";
          } else {
            const errorData = await response.json();
            console.error(`Erreur lors de la connexion: ${errorData.message}`);
          }
        } catch (error) {
          console.error("Erreur:", error);
        }
      },
      redirectToRegister() {
        window.location.href = "/register";
      },
    },
  };
  </script>
  
  <style scoped>
    .forgot-password {
    text-align: right;
    margin-top: 5px;
    margin-bottom: 25px;
  }
  
  .forgot-password a {
    color: #0084ff;
    text-decoration: none;
    font-size: 14px;
  }
  
  .forgot-password a:hover {
    text-decoration: underline;
  }
  .free-trial {
    font-size: 1.3em;
    margin-bottom: 20px;
  }
  
  .little-text {
    font-size: 0.7em;
    line-height: 1.4;
    margin-top: -20px;
  }
  
  .title-left h1 {
    font-size: 35px;
    line-height: 1.3;
    margin-top: 10px;
  }
  
  h1 {
    color: white;
    font-size: 45px;
    margin-bottom: 30px;
  }
  
  .login-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .login-container {
    display: flex;
    width: 90vw;
    height: 72vh;
    border-radius: 40px;
    background-color: rgba(38, 39, 52, 0.9);
    position: relative;
    overflow: hidden;
    padding: 128px;
  }
  
  .background-image {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 850px;
    height: auto;
    z-index: -1;
    opacity: 0.8;
  }
  
  .left-section {
    width: calc(50% - 8px);
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  
  .buttons {
    margin-top: 20px;
    display: flex;
    gap: 10px;
  }
  
  .buttons button {
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .buttons .outlined {
    background-color: transparent;
    border: 1px solid white;
    color: white;
    font-size: 13px;
  }
  
  .buttons .filled {
    background-color: #0084ff;
    color: white;
    border: none;
    font-size: 13px;
  }
  
  .buttons .filled:hover {
    background-color: #007bff;
    box-shadow: 0 0 10px #007bff;
  }
  
  .buttons .outlined:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .right-section {
    margin-left: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: calc(50% - 8px);
    padding: 20px;
  }
  
  .left-section p {
    font-size: 20px;
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
    margin-bottom: 20px;
    border: 2px solid transparent;
    transition: border 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  }
  
  .input-container:focus-within {
    border: 2px solid #0084ff;
    box-shadow: 0 0 8px rgba(0, 132, 255, 0.8);
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
  
  .blue-exclamation {
    color: #0084ff;
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
  
  button.submit-button {
    width: 100%;
    height: 50px;
    background-color: #0084ff;
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
    background-color: #007bff;
    box-shadow: 0 0 10px #007bff;
  }
  
  .login-link {
    text-align: right;
    margin-top: 20px;
  }
  
  .login-link a {
    color: #0084ff;
    cursor: pointer;
    text-decoration: none;
  }
  
  .login-link a:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .login-container {
      flex-direction: column;
      padding: 20px;
      height: auto;
      border-radius: 20px;
    }
  
    .left-section {
      display: none;
    }
  
    .left-section,
    .right-section {
      width: 100%;
      padding: 10px;
      margin-left: 0;
    }
  
    .title-left h1 {
      font-size: 24px;
    }
  
    h1 {
      font-size: 30px;
    }
  
    .little-text {
      font-size: 0.6em;
    }
  
    .buttons {
      flex-direction: column;
      gap: 5px;
    }
  
    .background-image {
      width: 100%;
      height: auto;
      object-fit: cover;
    }
  
    .login-link {
      text-align: center;
      margin-top: 20px;
    }
  }
  </style>
  