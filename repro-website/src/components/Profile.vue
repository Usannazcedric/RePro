<template>
  <div class="profile-main-grid">
    <div class="profile-edit-section">
      <h2 class="section-title">Informations d'utilisateur</h2>
      <form @submit.prevent="saveProfile" class="edit-form">
        <div class="edit-row-vertical">
          <label>Nom d'utilisateur</label>
          <div class="edit-input-container">
            <input v-model="editProfile.username" class="edit-input" type="text" />
            <button type="button" class="edit-btn" @click="updateField('username')">Changer</button>
          </div>
        </div>
        <div class="edit-row-vertical">
          <label>E-mail</label>
          <div class="edit-input-container">
            <input v-model="editProfile.email" class="edit-input" type="email" />
            <button type="button" class="edit-btn" @click="updateField('email')">Changer</button>
          </div>
        </div>
        <div class="edit-row-vertical">
          <label>Numéro de téléphone</label>
          <div class="edit-input-container">
            <input v-model="editProfile.phone" class="edit-input" type="text" placeholder="Saisir un numéro de téléphone" />
            <button type="button" class="edit-btn" @click="updateField('phone')">Changer</button>
        </div>
        </div>
        <button type="submit" class="main-save-btn">Valider mes informations</button>
      </form>
    </div>
    <div class="profile-verification-section">
      <h2 class="section-title">Vérifications en cours</h2>
      <div class="verif-block">
        <div class="verif-level verif-complete">
          <div class="verif-label">Niveau 1</div>
          <div class="verif-status">Complet</div>
          <div class="verif-bar verif-bar-complete"></div>
        </div>
        <div class="verif-level" :class="{ 'verif-complete': isVerificationComplete() }">
          <div class="verif-label">Niveau 2</div>
          <div class="verif-status">
            <template v-if="isVerificationComplete()">Complet</template>
            <template v-else>Veuillez remplir</template>
          </div>
          <div class="verif-bar" :class="{ 'verif-bar-complete': isVerificationComplete() }"></div>
          <div class="verif-desc" v-if="!isVerificationComplete()">
            <b>Vérifiez pour compléter le niveau 2</b>
            <p>Avant de pouvoir augmenter votre nombre de dépôt de formation, nous devons en savoir davantage sur votre identité, en vertu des lois contre la falsification d'identité.</p>
            <button class="verif-btn" @click="goToVerification">Compléter le niveau</button>
          </div>
        </div>
        <div v-if="isVerificationComplete()" class="verif-level">
          <div class="verif-label">Niveau 3</div>
          <div class="verif-status">Non vérifié</div>
          <div class="verif-bar"></div>
          <div class="verif-desc">
            <b>Vérification avancée (KYC)</b>
            <p>Pour accéder à toutes les fonctionnalités, veuillez compléter la vérification d'identité avancée.</p>
            <button class="verif-btn" @click="goToKYC">Démarrer la vérification KYC</button>
          </div>
        </div>
        <div v-else class="verif-level verif-locked">
          <div class="verif-label">Niveau 3</div>
          <div class="verif-status">Verrouillé</div>
          <div class="verif-bar verif-bar-locked"></div>
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
      user: null,
      userProfile: null,
      editProfile: {
        username: '',
        email: '',
        phone: ''
      },
      verification: null
    };
  },
  async created() {
    await this.checkAuthentication();
    await this.fetchVerification();
  },
  methods: {
    async checkAuthentication() {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        window.location.href = '/login';
        return;
      }
      this.user = session.user;
      await this.fetchUserProfile();
    },
    async fetchUserProfile() {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', this.user.id)
          .single();
        if (error) throw error;
        this.userProfile = profile;
        this.editProfile.username = profile.username || '';
        this.editProfile.email = this.user.email || '';
        this.editProfile.phone = profile.phone || '';
      } catch (error) {
        alert('Erreur lors de la récupération du profil.');
      }
    },
    async fetchVerification() {
      if (!this.user) return;
      const { data, error } = await supabase
        .from('verifications')
        .select('*')
        .eq('user_id', this.user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      if (!error && data && data.length > 0) {
        this.verification = data[0];
      } else {
        this.verification = null;
      }
    },
    isVerificationComplete() {
      const v = this.verification;
      if (!v) return false;
      return (
        v.civility && v.firstname && v.lastname && v.birthdate &&
        v.address && v.zip && v.city && v.country && v.certified
      );
    },
    async updateField(field) {
      let value = this.editProfile[field];
      if (field === 'email') {
        const { error } = await supabase.auth.updateUser({ email: value });
        if (error) {
          alert("Erreur lors de la mise à jour de l'email : " + error.message);
          return;
        }
        this.user.email = value;
      } else {
        const { error } = await supabase
          .from('profiles')
          .update({ [field]: value })
          .eq('id', this.user.id);
        if (error) {
          alert("Erreur lors de la mise à jour : " + error.message);
          return;
        }
        this.userProfile[field] = value;
      }
      alert('Champ mis à jour !');
    },
    async saveProfile() {
      const { error: error1 } = await supabase.auth.updateUser({ email: this.editProfile.email });
      const { error: error2 } = await supabase
        .from('profiles')
        .update({ username: this.editProfile.username, phone: this.editProfile.phone })
        .eq('id', this.user.id);
      if (error1 || error2) {
        alert('Erreur lors de la mise à jour du profil.');
        return;
      }
      this.userProfile.username = this.editProfile.username;
      this.userProfile.phone = this.editProfile.phone;
      this.user.email = this.editProfile.email;
      alert('Profil mis à jour !');
    },
    goToVerification() {
      this.$router.push('/profile/verification');
    },
    goToKYC() {
      alert('KYC à venir !');
    }
  }
}
</script>

<style scoped>

.edit-input-container {
  display: flex;
  gap: 10px;

  justify-content: space-between;
  width: 100%;


}
.profile-main-grid {
  display: flex;
  gap: 32px;
}

.profile-edit-section, .profile-verification-section {
  padding: 32px 28px;
  flex: 1;
  min-width: 340px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #7376FF;
  margin-bottom: 24px;
  font-family: 'Nunito', sans-serif;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.edit-row-vertical {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 8px;
}

.edit-row-vertical label {
  color: #444;
  font-weight: 600;
  margin-bottom: 2px;
}

.edit-input {
  width: 100%;
  padding: 10px 16px;
  border-radius: 10px;
  border: 1.5px solid #ececec;
  background: #ffffff;
  font-size: 1rem;
  font-family: 'Nunito', sans-serif;
  color: #222;
  transition: border 0.2s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.edit-input:focus {
  outline: none;
  border-color: #7376FF;
}

.edit-btn {
  background: #ffffff;
  color: #7376FF;
  border: none;
  border-radius: 8px;
  padding: 7px 18px;
  font-weight: 700;
  font-family: 'Nunito', sans-serif;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  border: 1.5px solid #ececec;
}

.edit-btn:hover {
  background: #7376FF;
  color: #fff;
}

.main-save-btn {
  margin-top: 18px;
  background: #7376FF;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 14px 0;
  font-size: 1.1rem;
  font-weight: 800;
  font-family: 'Nunito', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
}

.main-save-btn:hover {
  background: #5d60d6;
}

.profile-verification-section {
  max-width: 420px;
}

.verif-block {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.verif-level {
  background: #f8f8fa;
  border-radius: 14px;
  padding: 18px 20px 12px 20px;
  margin-bottom: 8px;
  position: relative;
}

.verif-label {
  font-weight: 700;
  color: #7376FF;
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.verif-status {
  position: absolute;
  right: 20px;
  top: 18px;
  color: #7376FF;
  font-weight: 700;
  font-size: 1rem;
}

.verif-bar {
  width: 100%;
  height: 5px;
  background: #ececec;
  border-radius: 4px;
  margin: 12px 0 0 0;
}

.verif-bar-complete {
  background: linear-gradient(90deg, #7376FF 80%, #ececec 100%);
}

.verif-bar-locked {
  background: repeating-linear-gradient(90deg, #ececec 0 80%, #d1d5db 100%);
}

.verif-complete .verif-status {
  color: #22c55e;
}

.verif-complete .verif-bar {
  background: linear-gradient(90deg, #22c55e 100%, #ececec 100%);
}

.verif-locked .verif-status {
  color: #bbb;
}

.verif-locked .verif-bar {
  background: #ececec;
}

.verif-desc {
  margin-top: 10px;
  color: #444;
  font-size: 0.98rem;
}

.verif-btn {
  margin-top: 14px;
  background: #7376FF;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 24px;
  font-size: 1rem;
  font-weight: 700;
  font-family: 'Nunito', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
}

.verif-btn:hover {
  background: #5d60d6;
}
</style>