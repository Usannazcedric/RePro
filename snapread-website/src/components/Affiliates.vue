<template>
  <div class="affiliates-page">
    <div class="affiliates-container">
      <div class="page-header">
        <h1 class="page-title">Affiliés</h1>
        <p class="page-description">
          Créer un code d'affiliation pour commencer à recevoir des récompenses gratuite
        </p>
      </div>

      <div class="action-buttons">
        <button class="btn-primary" @click="generateCode">
          Générer votre code d'affiliation
        </button>
        <button class="btn-secondary" @click="viewCode">
          Votre code d'affiliation
        </button>
      </div>

      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Affiliés</div>
            <div class="stat-value">0</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Gain totaux</div>
            <div class="stat-value">0,00€</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Formations partagées</div>
            <div class="stat-value">0</div>
          </div>
        </div>
      </div>

      <div class="empty-state">
        <div class="empty-icon">
          <img src="../assets/affilate.svg" alt="Aucun affilié" width="60" height="60" />
        </div>
        <p class="empty-message">Aucuns affiliés pour le moment</p>
      </div>
    </div>

    <!-- Modal pour le lien d'affiliation -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Votre lien d'affiliation</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <p class="modal-description">Voici votre lien d'affiliation personnalisé :</p>
          <div class="link-container">
            <input 
              ref="linkInput"
              type="text" 
              :value="affiliateLink" 
              readonly 
              class="link-input"
            />
            <button @click="copyToClipboard" class="copy-btn" title="Copier le lien">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase'

export default {
  name: 'Affiliates',
  data() {
    return {
      showModal: false,
      affiliateLink: '',
      username: ''
    }
  },
  async mounted() {
    await this.fetchUserData()
  },
  methods: {
    async fetchUserData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          // Essayer de récupérer l'email ou un username depuis les métadonnées
          this.username = session.user.email?.split('@')[0] || 'user'
          
          // Si vous avez une table profiles avec un champ username, utilisez ceci :
          // const { data: profile } = await supabase
          //   .from('profiles')
          //   .select('username')
          //   .eq('id', session.user.id)
          //   .single()
          // 
          // if (profile?.username) {
          //   this.username = profile.username
          // }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error)
        this.username = 'user'
      }
    },
    generateCode() {
      // Générer un code de 6 caractères aléatoires
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      
      // Créer le lien d'affiliation
      this.affiliateLink = `snapread.com/${this.username}-${code}/affiliated`;
      
      // Afficher la modal
      this.showModal = true;
      
      console.log('Lien d\'affiliation généré:', this.affiliateLink);
    },
    viewCode() {
      // Logique pour voir le code d'affiliation existant
      console.log('Voir code d\'affiliation');
    },
    closeModal() {
      this.showModal = false;
    },
    async copyToClipboard() {
      try {
        // Copier dans le presse-papiers
        await navigator.clipboard.writeText(this.affiliateLink);
        
        // Afficher l'alerte de confirmation
        alert('Lien d\'affiliation copié dans le presse-papiers !');
      } catch (err) {
        // Fallback pour les navigateurs plus anciens
        this.$refs.linkInput.select();
        document.execCommand('copy');
        alert('Lien d\'affiliation copié dans le presse-papiers !');
      }
    }
  }
}
</script>

<style scoped>
.affiliates-page {
  padding: 1.5rem;
}

.affiliates-container {
  max-width: 1000px;
  margin: 0 auto;
}

/* Header */
.page-header {
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.page-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: #7376FF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #5d60d6;
  transform: translateY(-1px);
}

.btn-secondary {
  background: white;
  color: #7376FF;
  border: 2px solid #7376FF;
  border-radius: 8px;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #f0f0ff;
  transform: translateY(-1px);
}

/* Stats Section */
.stats-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 2rem 1rem;
}

.empty-icon {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.empty-icon img {
  width: 60px;
  height: 60px;
}

.empty-icon svg {
  opacity: 0.8;
}

.empty-message {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .affiliates-page {
    padding: 1rem;
  }
  
  .affiliates-container {
    padding: 0.75rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 450px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
}

.modal-body {
  padding: 1.25rem;
}

.modal-description {
  color: #6b7280;
  margin-bottom: 0.875rem;
  font-size: 0.8125rem;
}

.link-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.link-input {
  flex: 1;
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.8125rem;
  background: #f9fafb;
  color: #374151;
  font-family: monospace;
}

.link-input:focus {
  outline: none;
  border-color: #7376FF;
  box-shadow: 0 0 0 3px rgba(115, 118, 255, 0.1);
}

.copy-btn {
  background: #7376FF;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.625rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 38px;
  height: 38px;
}

.copy-btn:hover {
  background: #5d60d6;
  transform: translateY(-1px);
}

.copy-btn svg {
  stroke-width: 2;
}
</style>