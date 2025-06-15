<template>
  <div class="wizard-step-upload">
    <button class="back-btn" @click="$emit('back')">&larr; Retour</button>
    <h2 class="title">Notre IA va tout analyser</h2>
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
.wizard-step-upload {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: center;
}
.title {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}
.upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}
.choose-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
}
.or {
  color: #aaa;
  margin: 0.5rem 0;
}
.drop-zone {
  border: 2px dashed #3b82f6;
  border-radius: 10px;
  padding: 2rem 2.5rem;
  min-width: 250px;
  text-align: center;
  color: #60a5fa;
  background: #23232d;
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