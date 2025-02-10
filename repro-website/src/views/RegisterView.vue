<template>
    <img
      src="../../public/background-register.svg"
      alt="Background"
      class="background-image"
    />
    <div class="register-wrapper">
      <div class="register-container">
        <div class="left-section">
          <p class="free-trial">Essayez gratuitement</p>
          <div class="title-left">
            <h1>
              Publiez vos formations,<br />
              <span class="blue-exclamation">propulsez-les</span> vers le <br />
              succès
            </h1>
          </div>
          <h2 class="little-text">
            Lancez vos formations sur la plateforme qui optimise vos <br />
            cours avec l’IA pour les rendre plus ludiques et interactifs !
          </h2>
          <div class="buttons">
            <button class="outlined">En savoir plus</button>
            <button class="filled">Nos abonnements</button>
          </div>
        </div>
        <div class="right-section">
          <h1>
            Créez votre compte <br />
            dès maintenant <span class="blue-exclamation">!</span>
          </h1>
          <form @submit.prevent="register" v-if="!isRegistered">
            <div class="input-container">
              <label for="username">Nom d'utilisateur</label>
              <input type="text" id="username" v-model="username" required />
            </div>
            <div class="input-container">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="email" required />
            </div>
            <div class="password-container">
              <div class="input-container">
                <label for="password">Mot de passe</label>
                <input type="password" id="password" v-model="password" required />
              </div>
              <div class="input-container">
                <label for="confirmPassword">Confirmer le mot de passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  v-model="confirmPassword"
                  required
                />
              </div>
            </div>
            <button type="submit" class="submit-button">Suivant</button>
          </form>
  
          <form @submit.prevent="updateAndRedirect" v-else>
            <div class="name-container">
              <div class="input-container">
                <label for="prenom">Prénom</label>
                <input type="text" id="prenom" v-model="prenom" required />
              </div>
              <div class="input-container">
                <label for="nom">Nom</label>
                <input type="text" id="nom" v-model="nom" required />
              </div>
            </div>
            <div class="input-container">
              <label for="birth">Date de naissance</label>
              <input type="date" id="birth" v-model="birth" required />
            </div>
            <div class="input-container">
              <label for="biographie">Biographie</label>
              <input type="text" id="biographie" v-model="biographie" required />
            </div>
            <button type="submit" class="submit-button">
              Créer votre compte
            </button>
          </form>
  
          <div v-if="!isRegistered" class="login-link">
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
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        prenom: "",
        nom: "",
        biographie: "",
        birth: "",
        isRegistered: false,
        userId: null,
      };
    },
    methods: {
      async register() {
        if (this.password !== this.confirmPassword) {
          console.error("Les mots de passe ne correspondent pas.");
          return;
        }
        try {
          const response = await fetch(
            "http://localhost:1337/api/auth/local/register",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                username: this.username,
                email: this.email,
                password: this.password,
              }),
            }
          );
          if (response.ok) {
            const data = await response.json();
            this.userId = data.user.id;
            localStorage.setItem("token", data.jwt);
            this.isRegistered = true;
          } else {
            const errorData = await response.json();
            console.error(`Erreur lors de l'inscription: ${errorData.message}`);
          }
        } catch (error) {
          console.error("Erreur:", error);
        }
      },
      async updateAndRedirect() {
        try {
          const response = await fetch(
            `http://localhost:1337/api/users/${this.userId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                Prenom: this.prenom,
                Nom: this.nom,
                Biographie: this.biographie,
                Birth: this.birth,
              }),
            }
          );
          if (response.ok) {
            window.location.href = "/profile";
          } else {
            const errorData = await response.json();
            console.error(
              `Erreur lors de la mise à jour des informations: ${errorData.message}`
            );
          }
        } catch (error) {
          console.error("Erreur:", error);
        }
      },
      redirectToLogin() {
        window.location.href = "/login";
      },
    },
  };
  </script>
  
  <style scoped>
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
    padding: 128px;
  }
  
  .name-container {
    display: flex;
    gap: 10px;
  }
  
  .name-container .input-container {
    flex: 1; 
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
  
  .password-container {
    display: flex;
    gap: 10px;
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
    margin-top: 10px;
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
  .register-container {
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

  .password-container {
    flex-direction: column;
    gap: 0;
  }

  .name-container {
    flex-direction: column;
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
  