<template>
  <div class="wizard-step-infos">
    <button class="back-btn" @click="$emit('back')">&larr; Retour</button>
    
    <h2 class="title">Titre de la formation</h2>
    <input v-model="localInfos.title" placeholder="La base de python..." class="input" />
    
    <h2 class="title">Thème de la formation</h2>
    <select v-model="localInfos.theme" class="input">
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
          📷 Ajouter une photo
        </button>
      </div>
    </div>
    
    <h2 class="title">Description de la formation</h2>
    <textarea v-model="localInfos.description" class="input textarea" placeholder="Décrivez votre formation..." />
    
    <div class="row">
      <span>La formation est-elle reconnue par l'État ?</span>
      <button :class="{active: localInfos.is_state_recognized === true}" @click="localInfos.is_state_recognized = true">Oui</button>
      <button :class="{active: localInfos.is_state_recognized === false}" @click="localInfos.is_state_recognized = false">Non</button>
    </div>
    
    <div class="row">
      <input type="checkbox" v-model="localInfos.is_creator_certified" id="certif" />
      <label for="certif">Je certifie être le créateur de cette formation.</label>
    </div>
    
    <button class="next-btn" @click="nextStep">Passer à l'étape suivante</button>
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

const localInfos = reactive({
  title: props.infos?.title || '',
  theme: props.infos?.theme || '',
  description: props.infos?.description || '',
  is_state_recognized: props.infos?.is_state_recognized ?? null,
  is_creator_certified: props.infos?.is_creator_certified ?? false
})

function handleCoverUpload(event) {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Taille maximale : 5MB')
      return
    }
    
    coverFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      coverPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function removeCoverImage() {
  coverFile.value = null
  coverPreview.value = ''
  if (coverInput.value) {
    coverInput.value.value = ''
  }
}

function nextStep() {
  emit('next', {
    infos: { ...localInfos },
    coverImage: coverFile.value,
    coverImageUrl: coverPreview.value
  })
}
</script>

<style scoped>
.wizard-step-infos {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: stretch;
}

.title {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.2rem;
}

.input {
  background: #23232d;
  border: 1.5px solid #3b3b4d;
  border-radius: 12px;
  padding: 0.8rem 1rem;
  color: #fff;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.textarea {
  min-height: 80px;
  resize: vertical;
}

.cover-section {
  margin-bottom: 0.5rem;
}

.cover-preview {
  position: relative;
  width: 100%;
  max-width: 300px;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  margin: 0 auto;
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
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-upload {
  text-align: center;
}

.file-input {
  display: none;
}

.upload-btn {
  background: #3b3b4d;
  border: 1.5px solid #5a5a6d;
  color: #fff;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.upload-btn:hover {
  background: #4a4a5d;
}

.row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.row button {
  background: #23232d;
  border: 1.5px solid #3b3b4d;
  color: #fff;
  border-radius: 8px;
  padding: 0.3rem 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
}

.row button.active {
  background: #3b82f6;
  border-color: #3b82f6;
}

.next-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1.5rem;
  align-self: flex-end;
}

.back-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  align-self: flex-start;
}
</style> 