<template>
  <div class="wizard-wrapper">
    <div class="wizard-step-infos">
      <!-- Bouton retour -->
      <button class="back-btn" @click="$emit('back')">&larr; Retour</button>

      <!-- Contenu principal en colonnes -->
      <div class="main-content">
        <!-- Colonne gauche -->
        <div class="left-column">
          <!-- Titre et champs -->
          <div class="form-group">
            <h2 class="title">Titre de la formation <span class="required">*</span></h2>
            <input
              v-model="localInfos.title"
              placeholder="La base de python..."
              class="input"
              :class="{ 'error': !localInfos.title.trim() && showErrors }"
            />
          </div>

          <div class="form-group">
            <h2 class="title">Thème de la formation <span class="required">*</span></h2>
            <select v-model="localInfos.theme" class="input" :class="{ 'error': !localInfos.theme.trim() && showErrors }">
              <option value="">Choisir un thème</option>
              <option value="Code">Code</option>
              <option value="Design">Design</option>
              <option value="Science">Science</option>
              <option value="Biologie">Biologie</option>
              <option value="Chimie">Chimie</option>
              <option value="Physique">Physique</option>
              <option value="Mathématiques">Mathématiques</option>
              <option value="Informatique">Informatique</option>
              <option value="Marketing">Marketing</option>
              <option value="Langues">Langues</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div class="form-group">
            <h2 class="title">Description de la formation <span class="required">*</span></h2>
            <textarea
              v-model="localInfos.description"
              class="input textarea"
              placeholder="Décrivez votre formation..."
              :class="{ 'error': !localInfos.description.trim() && showErrors }"
            />
          </div>
        </div>

        <!-- Colonne droite -->
        <div class="right-column">
          <!-- Section photo (optionnelle) -->
          <div class="form-group">
            <h2 class="title">Photo de couverture (optionnel)</h2>
            <div class="cover-section">
              <div v-if="coverPreview" class="cover-preview">
                <img :src="coverPreview" alt="Aperçu couverture" class="cover-img" />
                <button @click="removeCoverImage" class="remove-btn">×</button>
              </div>
              <div v-else class="cover-upload">
                <input
                  type="file"
                  ref="coverInput"
                  @change="handleCoverUpload"
                  accept="image/*"
                  class="file-input"
                />
                <button @click="$refs.coverInput.click()" class="upload-btn">
                  Ajouter une photo
                </button>
              </div>
            </div>
          </div>

          <!-- Options État reconnu et certification -->
          <div class="form-group">
            <h2 class="title">Options <span class="required">*</span></h2>
            <div class="row" :class="{ 'error': localInfos.is_state_recognized === null && showErrors }">
              <span>La formation est-elle reconnue par l'État ?</span>
              <div class="button-group">
                <button
                  :class="{ active: localInfos.is_state_recognized === true }"
                  @click="localInfos.is_state_recognized = true"
                >Oui</button>
                <button
                  :class="{ active: localInfos.is_state_recognized === false }"
                  @click="localInfos.is_state_recognized = false"
                >Non</button>
              </div>
            </div>

            <div class="row checkbox-row" :class="{ 'error': !localInfos.is_creator_certified && showErrors }">
              <input
                type="checkbox"
                v-model="localInfos.is_creator_certified"
                id="certif"
              />
              <label for="certif">
                Je certifie être le créateur de cette formation. <span class="required">*</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Bouton suivant et barre de progression -->
      <div class="bottom-section">
        <button class="next-btn" @click="nextStep">
          Passer à l'étape suivante
        </button>

        <!-- Barre de progression -->
        <div class="progress-bar">
          <span class="step active"></span>
          <span class="step active"></span>
          <span class="step"></span>
          <span class="step"></span>
          <span class="step"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({
  infos: Object,
  coverImage: File,
  coverImageUrl: String
})
const emit = defineEmits(['next', 'back'])

const coverInput = ref(null)
const coverPreview = ref(props.coverImageUrl || '')
const coverFile = ref(props.coverImage || null)
const showErrors = ref(false)

const localInfos = reactive({
  title: props.infos?.title || '',
  theme: props.infos?.theme || '',
  description: props.infos?.description || '',
  is_state_recognized: props.infos?.is_state_recognized ?? null,
  is_creator_certified: props.infos?.is_creator_certified ?? false
})

function handleCoverUpload(event) {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    alert('Le fichier est trop volumineux. Taille maximale : 5MB')
    return
  }
  coverFile.value = file
  const reader = new FileReader()
  reader.onload = e => (coverPreview.value = e.target.result)
  reader.readAsDataURL(file)
}

function removeCoverImage() {
  coverFile.value = null
  coverPreview.value = ''
  if (coverInput.value) coverInput.value.value = ''
}

function nextStep() {
  showErrors.value = true
  
  // Validation des champs obligatoires
  if (!localInfos.title.trim()) {
    alert('Veuillez saisir un titre pour la formation')
    return
  }
  
  if (!localInfos.theme.trim()) {
    alert('Veuillez sélectionner un thème pour la formation')
    return
  }
  
  if (!localInfos.description.trim()) {
    alert('Veuillez saisir une description pour la formation')
    return
  }
  
  if (localInfos.is_state_recognized === null) {
    alert('Veuillez indiquer si la formation est reconnue par l\'État')
    return
  }
  
  if (!localInfos.is_creator_certified) {
    alert('Veuillez certifier être le créateur de cette formation')
    return
  }
  
  // Si tout est valide, réinitialiser les erreurs et continuer
  showErrors.value = false
  emit('next', {
    infos: { ...localInfos },
    coverImage: coverFile.value,
    coverImageUrl: coverPreview.value
  })
}
</script>

<style scoped>
.wizard-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0 1.5rem 1.5rem 1.5rem;
}

.wizard-step-infos {
  width: 100%;
  max-width: 1000px;
  min-height: 600px;
  background: #ffffff;
  border-radius: 24px;
  padding: 4rem;
  box-shadow: 0 8px 32px rgba(115, 118, 255, 0.12);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border: none;
  margin-top: -2rem;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin: 1rem 0;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0;
}

.input {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.8rem;
  color: #2d3748;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input::placeholder {
  color: #9ca3af;
}

.textarea {
  min-height: 80px;
  resize: vertical;
  line-height: 1.5;
}

.cover-section {
  margin-bottom: 0;
}

.cover-preview {
  position: relative;
  width: 100%;
  max-width: 250px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  margin-bottom: 0;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  font-size: 0.8rem;
}

.remove-btn:hover {
  background: rgba(220, 38, 38, 0.9);
}

.cover-upload {
  text-align: center;
  padding: 1.5rem;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  margin-bottom: 0;
}

.file-input {
  display: none;
}

.upload-btn {
  background: #6366f1;
  border: none;
  color: #ffffff;
  border-radius: 12px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.2s ease;
}

.upload-btn:hover {
  background: #4f46e5;
}

.row {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.row span {
  color: #2d3748;
  font-weight: 500;
  font-size: 0.95rem;
}

.button-group {
  display: flex;
  gap: 0.8rem;
}

.row button {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  color: #4a5568;
  border-radius: 12px;
  padding: 0.5rem 1.2rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.row button:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.row button.active {
  background: #6366f1;
  border-color: #6366f1;
  color: #ffffff;
}

.checkbox-row {
  flex-direction: row;
  align-items: center;
  gap: 0.8rem;
}

.checkbox-row input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #6366f1;
}

.checkbox-row label {
  color: #2d3748;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.95rem;
}

.bottom-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.next-btn {
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.next-btn:hover {
  background: #4f46e5;
  transform: translateY(-1px);
}

.back-btn {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  align-self: flex-start;
  transition: color 0.2s ease;
  margin-bottom: 0.5rem;
}

.back-btn:hover {
  color: #4f46e5;
}

.progress-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.step {
  width: 60px;
  height: 8px;
  background: #cbd5e1;
  border-radius: 4px;
}

.step.active {
  background: #6366f1;
}

.required {
  color: #ef4444;
  margin-left: 0.25rem;
}

.input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.row.error {
  border: 1px solid #ef4444;
  border-radius: 8px;
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.05);
}

@media (max-width: 900px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .wizard-wrapper {
    padding: 1rem;
  }
  .wizard-step-infos {
    padding: 2rem;
  }
  .button-group {
    flex-direction: column;
  }
}
</style>