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
            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
              <div v-if="errorMessage.includes('confirmer votre email')" class="resend-confirmation">
                <button type="button" @click="resendConfirmationEmail" class="resend-button">
                  Renvoyer l'email de confirmation
                </button>
              </div>
            </div>
            <div class="input-container">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="email" required />
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
  import { supabase } from '../supabase'
  import { useRouter } from 'vue-router'
  
  export default {
    setup() {
      const router = useRouter()
      return { router }
    },
    data() {
      return {
        email: "",
        password: "",
        errorMessage: "",
      };
    },
    methods: {
      async login() {
        this.errorMessage = "";
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: this.email,
            password: this.password,
          });

          if (error) throw error;

          if (data.user) {
            // Récupérer le profil de l'utilisateur
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (profileError) {
              console.error("Erreur lors de la récupération du profil:", profileError.message);
            } else if (profile) {
              localStorage.setItem('userProfile', JSON.stringify(profile));
            }

            // Utiliser le router pour la redirection
            await this.router.push('/profile')
          }
        } catch (error) {
          console.error("Erreur lors de la connexion:", error.message);
          if (error.message === "Email not confirmed") {
            this.errorMessage = "Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.";
          } else if (error.message.includes("Invalid login credentials")) {
            this.errorMessage = "Email ou mot de passe incorrect";
          } else {
            this.errorMessage = "Une erreur est survenue lors de la connexion";
          }
        }
      },

      async resendConfirmationEmail() {
        try {
          const { error } = await supabase.auth.resend({
            type: 'signup',
            email: this.email
          });

          if (error) throw error;

          this.errorMessage = "Un nouveau mail de confirmation a été envoyé. Veuillez vérifier votre boîte de réception.";
        } catch (error) {
          console.error("Erreur lors de l'envoi du mail de confirmation:", error.message);
          this.errorMessage = "Impossible d'envoyer le mail de confirmation. Veuillez réessayer plus tard.";
        }
      },

      redirectToRegister() {
        window.location.href = "/register";
      },
    },
  };
  </script>
  
  <style scoped>
  .error-message {
    color: #ff4444;
    background-color: rgba(255, 68, 68, 0.1);
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 15px;
    text-align: center;
  }

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
  
    .login-link {
      text-align: center;
      margin-top: 20px;
    }
  }

  .resend-confirmation {
    margin-top: 10px;
  }

  .resend-button {
    background: none;
    border: none;
    color: #0084ff;
    text-decoration: underline;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
  }

  .resend-button:hover {
    color: #007bff;
  }
  </style>
  