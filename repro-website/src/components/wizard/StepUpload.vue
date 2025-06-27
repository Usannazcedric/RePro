<template>
  <div class="wizard-wrapper">
    <div class="wizard-step-upload">
      <button class="back-btn" @click="$emit('back')">&larr; Retour</button>
      <h2 class="title">Notre IA va analyser votre formation et créer un contenu d'apprentissage adapté</h2>
      
      <!-- Icône PDF -->
      <div class="pdf-icon">
        <img src="/pdfff.svg" alt="PDF" />
      </div>
      
      <div class="upload-box">
        <input type="file" ref="fileInput" accept=".pdf" @change="onFileChange" style="display:none" />
        <button class="choose-btn" @click="fileInput.click()">Choisir un fichier</button>
        <div class="or">Ou déposer votre fichier ici</div>
        <div class="drop-zone" @dragover.prevent @drop.prevent="onDrop">
          <span v-if="!fileName">Déposez votre PDF ici</span>
          <span v-else>Fichier sélectionné : {{ fileName }}</span>
        </div>
      </div>
      <button class="next-btn" :disabled="!file" @click="uploadAndNext">Passer à l'étape suivante</button>
      
      <!-- Barre de progression -->
      <div class="progress-bar">
        <span class="step active"></span>
        <span class="step active"></span>
        <span class="step active"></span>
        <span class="step"></span>
        <span class="step"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['next', 'back'])
const file = ref(null)
const fileName = ref('')
const fileInput = ref(null)

function onFileChange(e) {
  const f = e.target.files[0]
  if (f && f.type === 'application/pdf') {
    file.value = f
    fileName.value = f.name
  }
}
function onDrop(e) {
  const f = e.dataTransfer.files[0]
  if (f && f.type === 'application/pdf') {
    file.value = f
    fileName.value = f.name
  }
}

async function uploadAndNext() {
  if (!file.value) return
  // Ne plus faire d'upload Supabase Storage
  emit('next', { file: file.value })
}
</script>

<style scoped>
.wizard-wrapper {
  min-height: 100vh;
  background: #fafafa;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0 1.5rem 1.5rem 1.5rem;
}

.wizard-step-upload {
  width: 100%;
  max-width: 1000px;
  min-height: 600px;
  background: #ffffff;
  border-radius: 24px;
  padding: 4rem;
  box-shadow: 0 8px 32px rgba(115, 118, 255, 0.12);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: none;
  margin-top: -2rem;
  align-items: center;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2d3748;
  text-align: center;
  max-width: 600px;
  line-height: 1.4;
}

.pdf-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
}

.pdf-icon img {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 500px;
}

.choose-btn {
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.choose-btn:hover {
  background: #4f46e5;
}

.or {
  color: #718096;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.drop-zone {
  border: 2px dashed #6366f1;
  border-radius: 12px;
  padding: 2rem 2.5rem;
  min-width: 250px;
  text-align: center;
  color: #6366f1;
  background: #f8fafc;
  transition: all 0.2s ease;
  width: 100%;
}

.drop-zone:hover {
  background: #f1f5f9;
  border-color: #4f46e5;
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
  margin-top: 1rem;
  transition: all 0.2s ease;
}

.next-btn:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
}

.next-btn:disabled {
  background: #cbd5e0;
  color: #94a3b8;
  cursor: not-allowed;
  transform: none;
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
  margin-top: 2rem;
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

@media (max-width: 768px) {
  .wizard-wrapper {
    padding: 1rem;
  }
  .wizard-step-upload {
    padding: 2rem;
  }
  .upload-box {
    max-width: 100%;
  }
}
</style> 