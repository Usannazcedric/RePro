<template>
  <div class="verification-container">
    <h2 class="section-title">Vérifications</h2>
    <p class="verif-desc">
      Conformément à la législation sur la vente de contenus numériques, nous devons recueillir certaines informations vous concernant, telles que votre identité et la nature des formations proposées. Cela permet d'assurer la transparence de votre offre et la sécurité des utilisateurs. Ces données restent strictement confidentielles et sont protégées sur notre plateforme SnapRead. Elles sont utilisées uniquement pour garantir une expérience fiable et conforme aux exigences légales.
    </p>
    <form class="verif-form" @submit.prevent="submitVerification">
      <div class="verif-grid">
        <div class="verif-col">
          <div class="verif-field">
            <label for="civility">Civilité</label>
            <select id="civility" v-model="form.civility" class="verif-input">
              <option value="">Sélectionnez votre civilité</option>
              <option value="M.">Monsieur</option>
              <option value="Mme">Madame</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div class="verif-field">
            <label for="firstname">Prénom</label>
            <input id="firstname" v-model="form.firstname" class="verif-input" type="text" placeholder="Prénom" />
          </div>
          <div class="verif-field">
            <label for="lastname">Nom de famille</label>
            <input id="lastname" v-model="form.lastname" class="verif-input" type="text" placeholder="Nom de famille" />
          </div>
          <div class="verif-field">
            <label for="birthdate">Date de naissance</label>
            <input id="birthdate" v-model="form.birthdate" class="verif-input" type="date" placeholder="jj/mm/aaaa" />
          </div>
        </div>
        <div class="verif-col">
          <div class="verif-field">
            <label for="address">Adresse</label>
            <input id="address" v-model="form.address" class="verif-input" type="text" placeholder="Adresse" />
          </div>
          <div class="verif-field">
            <label for="address2">Adresse (Informations supplémentaires)</label>
            <input id="address2" v-model="form.address2" class="verif-input" type="text" placeholder="Adresse (Informations supplémentaires)" />
          </div>
          <div class="verif-row">
            <div class="verif-field small">
              <label for="zip">Code postal / code ZIP</label>
              <input id="zip" v-model="form.zip" class="verif-input" type="text" placeholder="Code postal / code ZIP" />
            </div>
            <div class="verif-field small">
              <label for="city">Ville</label>
              <input id="city" v-model="form.city" class="verif-input" type="text" placeholder="Ville" />
            </div>
          </div>
          <div class="verif-row">
            <div class="verif-field small">
              <label for="state">État / Province</label>
              <input id="state" v-model="form.state" class="verif-input" type="text" placeholder="État / Province" />
            </div>
            <div class="verif-field small">
              <label for="country">Pays</label>
              <select id="country" v-model="form.country" class="verif-input">
                <option value="">Sélectionnez votre pays</option>
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Canada">Canada</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="verif-checkbox-row">
        <input type="checkbox" id="certify" v-model="form.certify" />
        <label for="certify" class="certify-label">Je certifie que les informations soumises sont exactes et conformes à la réalité.</label>
      </div>
      <button type="submit" class="verif-submit-btn">Envoyer mes informations</button>
    </form>
  </div>
</template>

<script>
import { supabase } from '../supabase'

export default {
  data() {
    return {
      form: {
        civility: '',
        firstname: '',
        lastname: '',
        birthdate: '',
        address: '',
        address2: '',
        zip: '',
        city: '',
        state: '',
        country: '',
        certify: false
      }
    }
  },
  methods: {
    async submitVerification() {
      if (!this.form.certify) {
        alert('Vous devez certifier que les informations sont exactes.');
        return;
      }
      try {
        // Récupère l'utilisateur connecté
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          alert('Vous devez être connecté.');
          return;
        }
        const user_id = session.user.id;
        // Envoie les infos à Supabase
        const { error } = await supabase.from('verifications').insert([{
          user_id,
          civility: this.form.civility,
          firstname: this.form.firstname,
          lastname: this.form.lastname,
          birthdate: this.form.birthdate,
          address: this.form.address,
          address2: this.form.address2,
          zip: this.form.zip,
          city: this.form.city,
          state: this.form.state,
          country: this.form.country,
          certified: this.form.certify
        }]);
        if (error) throw error;
        alert('Informations envoyées avec succès !');
        // Optionnel : reset le formulaire
        this.form = {
          civility: '',
          firstname: '',
          lastname: '',
          birthdate: '',
          address: '',
          address2: '',
          zip: '',
          city: '',
          state: '',
          country: '',
          certify: false
        };
      } catch (e) {
        alert('Erreur lors de l\'envoi : ' + (e.message || e));
      }
    }
  }
}
</script>

<style scoped>
.verification-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #7376FF;
  margin-bottom: 12px;
  font-family: 'Nunito', sans-serif;
}

.verif-desc {
  color: #444;
  font-size: 0.95rem;
  margin-bottom: 24px;
  font-family: 'Nunito', sans-serif;
}

.verif-form {
  display: flex;
  flex-direction: column;
  gap: 5px; /* ✅ Plus d'espace entre blocs */
}

.verif-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px 40px; /* ✅ plus de séparation entre les 2 colonnes */
}

.verif-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.verif-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

select.verif-input {
  padding-right: 40px;
  appearance: none;
  -webkit-appearance: none; /* pour Safari */
  -moz-appearance: none;    /* pour Firefox */

  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg width='14' height='14' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10L12 15L17 10' stroke='%23222' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px;
}


.verif-row {
  display: flex;
  gap: 16px;
}

.verif-field.small {
  flex: 1;
}

/* ✅ Nouveau style input plus moderne */
.verif-input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #D2D6E8;
  background: #ffff;
  font-size: 0.95rem;
  font-family: 'Nunito', sans-serif;
  color: #222;
  transition: all 0.2s ease-in-out;
  box-sizing: border-box;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

}

.verif-input:focus {
  outline: none;
  box-shadow: inset 0 0 0 2px #7376FF;
}

/* ✅ Checkbox */
input[type="checkbox"] {
  accent-color: #7376FF;
}

.verif-checkbox-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.certify-label {
  color: #444;
  font-size: 0.9rem;
  font-family: 'Nunito', sans-serif;
}

.verif-submit-btn {
  margin-top: 12px;
  background: #7376FF;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: 'Nunito', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  width: fit-content;
  align-self: flex-start;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.verif-submit-btn:hover {
  background: #6568e6;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* ✅ Responsive */
@media (max-width: 900px) {
  .verif-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .verif-row {
    flex-direction: column;
  }

  .verif-submit-btn {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
}
</style>
