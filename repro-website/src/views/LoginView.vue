<template>
  <div class="login-page">
    <div class="login-wrapper">
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
          <button class="outlined" @click="goToFAQ">En savoir plus</button>
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

          // Enregistrer la session
          try {
            const ipRes = await fetch('https://ipapi.co/json/');
            const ipData = await ipRes.json();
            const browser = navigator.userAgent;
            await supabase.from('user_sessions').insert([{
              user_id: data.user.id,
              ip_address: ipData.ip,
              browser: browser,
              city: ipData.city,
              country: ipData.country_name,
              login_at: new Date()
            }]);
          } catch (e) {
            console.warn('Impossible d\'enregistrer la session:', e);
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
    goToFAQ() {
      this.$router.push('/faq');
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.login-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #E9E9EE;
}

.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 128px;
}

.left-section {
  width: 50%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.right-section {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
}

.error-message {
  color: #d32f2f;
  background-color: rgba(211, 47, 47, 0.1);
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
  color: #7376FF;
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
  color: #333;
}

.title-left h1 {
  font-size: 35px;
  line-height: 1.3;
  margin-top: 10px;
  color: #111;
}

h1 {
  color: #111;
  font-size: 45px;
  margin-bottom: 30px;
}

.buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.buttons button {
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.buttons .outlined {
  background-color: transparent;
  border: 1px solid #7376FF;
  color: #7376FF;
  font-size: 13px;
}

.buttons .outlined:hover {
  background-color: rgba(115, 118, 255, 0.1);
}

.buttons .filled {
  background-color: #7376FF;
  color: white;
  border: none;
  font-size: 13px;
}

.buttons .filled:hover {
  background-color: #6366e8;
  box-shadow: 0 0 10px #6366e8;
}

.input-container {
  background-color: #ffffff;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  width: 100%;
  color: #444;
  position: relative;
  margin-bottom: 20px;
  border: 2px solid transparent;
  transition: border 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.input-container:focus-within {
  border: 2px solid #7376FF;
  box-shadow: 0 0 8px rgba(115, 118, 255, 0.5);
}

.input-container label {
  font-size: 12px;
  position: absolute;
  top: -10px;
  left: 10px;
  background-color: #ffffff;
  color: #666;
  padding: 2px 5px;
  border-radius: 5px;
}

.input-container input {
  background: transparent;
  border: none;
  color: #111;
  font-size: 16px;
  outline: none;
  flex-grow: 1;
  padding: 8px;
}

button.submit-button {
  width: 100%;
  height: 50px;
  background-color: #7376FF;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

button.submit-button:hover {
  background-color: #6366e8;
  box-shadow: 0 0 10px #6366e8;
}

.login-link {
  text-align: right;
  margin-top: 10px;
}

.login-link a {
  color: #7376FF;
  cursor: pointer;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

@media (max-width: 1024px) {
  .login-wrapper {
    padding: 0 64px;
  }
  
  .title-left h1 {
    font-size: 28px;
  }
  
  h1 {
    font-size: 36px;
  }
  
  .little-text {
    font-size: 0.65em;
  }
}

@media (max-width: 768px) {
  .login-wrapper {
    flex-direction: column;
    padding: 20px;
    height: auto;
    justify-content: flex-start;
    padding-top: 40px;
  }

  .left-section {
    width: 100%;
    padding: 10px;
    margin-bottom: 30px;
  }

  .right-section {
    width: 100%;
    padding: 10px;
  }

  .title-left h1 {
    font-size: 24px;
    text-align: center;
  }

  h1 {
    font-size: 30px;
    text-align: center;
  }

  .little-text {
    font-size: 0.6em;
    text-align: center;
  }

  .buttons {
    justify-content: center;
    flex-direction: column;
    gap: 10px;
  }
  
  .buttons button {
    width: 100%;
    max-width: 200px;
  }

  .login-link {
    text-align: center;
    margin-top: 20px;
  }
  
  .forgot-password {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .login-wrapper {
    padding: 15px;
    padding-top: 20px;
  }
  
  .title-left h1 {
    font-size: 20px;
  }
  
  h1 {
    font-size: 26px;
  }
  
  .little-text {
    font-size: 0.55em;
  }
  
  .input-container {
    margin-bottom: 15px;
  }
  
  button.submit-button {
    height: 45px;
  }
}

.resend-confirmation {
  margin-top: 10px;
}

.resend-button {
  background: none;
  border: none;
  color: #7376FF;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}

.resend-button:hover {
  color: #6366e8;
}

.blue-exclamation {
  color: #7376FF;
}
</style>
