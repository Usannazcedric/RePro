<template>
  <div class="wizard-step-loading">
    <button class="back-btn" @click="$emit('back')">&larr; Retour</button>
    <h2 class="title">La formation est en cours de création...</h2>
    <div class="progress-bar-container">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
    <div class="desc">Merci de patienter pendant que notre IA analyse votre document.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps({
  pdfUrl: String,
  onGenerate: Function // callback pour lancer l'appel IA
})
const emit = defineEmits(['next', 'back'])
const progress = ref(0)

onMounted(async () => {
  // Progression visuelle
  let interval = setInterval(() => {
    if (progress.value < 90) progress.value += Math.random() * 7 + 2
  }, 300)
  // Appel backend pour générer le contenu IA
  try {
    const result = await props.onGenerate()
    progress.value = 100
    clearInterval(interval)
    setTimeout(() => emit('next', result), 600)
  } catch (e) {
    clearInterval(interval)
    alert('Erreur lors de la génération IA')
    emit('back')
  }
})
</script>

<style scoped>
.wizard-step-loading {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}
.title {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
}
.progress-bar-container {
  width: 100%;
  margin: 2rem 0 1rem 0;
}
.progress-bar {
  width: 100%;
  height: 18px;
  background: #23232d;
  border-radius: 10px;
  overflow: hidden;
  border: 1.5px solid #3b3b4d;
}
.progress {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s;
}
.desc {
  color: #aaa;
  margin-bottom: 1.5rem;
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