<template>
  <div class="register-page">
    <div class="register-wrapper">
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
          cours avec l'IA pour les rendre plus ludiques et interactifs !
        </h2>
        <div class="buttons">
          <button class="outlined" @click="goToFAQ">En savoir plus</button>
          <button class="filled" @click="goToPricing">Nos abonnements</button>
        </div>
      </div>
      <div class="right-section">
        <h1>
          Créez votre compte <br />
          dès maintenant <span class="blue-exclamation">!</span>
        </h1>
        <form @submit.prevent="register" v-if="!isRegistered">
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
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
import { supabase } from '../supabase'

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
      errorMessage: "",
    };
  },
  methods: {
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    async register() {
  this.errorMessage = "";

  if (this.password !== this.confirmPassword) {
    this.errorMessage = "Les mots de passe ne correspondent pas.";
    return;
  }

  if (!this.validateEmail(this.email)) {
    this.errorMessage = "L'adresse email n'est pas valide.";
    return;
  }

  if (this.password.length < 6) {
    this.errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
    return;
  }

  try {
    // 1. Création du compte
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: this.email,
      password: this.password,
      options: {
        data: {
          username: this.username,
        }
      }
    });

    if (signUpError) throw signUpError;

    // 2. Récupère la session (pour être sûr que l'utilisateur est bien authentifié)
    let user = signUpData.user;
    if (!user) {
      // Parfois, user n'est pas dans data, il faut attendre la session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        this.errorMessage = "Veuillez vérifier votre email pour activer votre compte.";
        return;
      }
      user = session.user;
    }

    // 3. Upsert du profil (avec la session active)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username: this.username,
      });

    if (profileError) {
      this.errorMessage = "Erreur lors de la création du profil : " + profileError.message;
      return;
    }

    this.userId = user.id;
    this.isRegistered = true;
    this.errorMessage = "";
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error.message);
    this.errorMessage = error.message;
  }
},
    async updateAndRedirect() {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            prenom: this.prenom,
            nom: this.nom,
            biographie: this.biographie,
            birth: this.birth,
          })
          .eq('id', this.userId)

        if (error) throw error;

        window.location.href = "/profile";
      } catch (error) {
        console.error("Erreur lors de la mise à jour des informations:", error.message);
      }
    },
    redirectToLogin() {
      window.location.href = "/login";
    },
    goToFAQ() {
      this.$router.push('/faq');
    },
    goToPricing() {
      // Naviguer vers la home page puis scroller vers la section pricing
      this.$router.push('/').then(() => {
        this.$nextTick(() => {
          setTimeout(() => {
            const pricingElement = document.getElementById('pricing');
            if (pricingElement) {
              pricingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 200);
        });
      });
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
  height: 100%;
  width: 100%;
}

.register-page {
  width: 100vw;
  min-height: 100vh;
  background: #E9E9EE;
  padding-top: 90px;
}

.register-wrapper {
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

.free-trial {
  font-size: 1.3em;
  margin-bottom: 20px;
  color: #111;
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

.name-container {
  display: flex;
  gap: 10px;
}

.name-container .input-container {
  flex: 1; 
}

.password-container {
  display: flex;
  gap: 10px;
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

.blue-exclamation {
  color: #7376FF;
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

.error-message {
  color: #d32f2f;
  background-color: rgba(211, 47, 47, 0.1);
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 15px;
  text-align: center;
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
  .register-wrapper {
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
  .register-wrapper {
    flex-direction: column;
    padding: 20px;
    height: auto;
    justify-content: flex-start;
    padding-top: 40px;
  }

  .left-section {
    display: none;
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

  .password-container {
    flex-direction: column;
    gap: 0;
  }

  .name-container {
    flex-direction: column;
  }

  .login-link {
    text-align: center; 
    margin-top: 20px;
  }
}

@media (max-width: 480px) {
  .register-wrapper {
    padding: 15px;
    padding-top: 20px;
  }
  
  .left-section {
    display: none;
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
  
  .free-trial {
    font-size: 1.1em;
  }
}
</style>