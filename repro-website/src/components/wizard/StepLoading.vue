<template>
  <div class="wizard-wrapper">
    <div class="wizard-step-loading">
      <button class="back-btn" @click="$emit('back')">&larr; Retour</button>
      <h2 class="title">La formation est en cours de création...</h2>
      
      <!-- Icône PDF -->
      <div class="pdf-icon">
        <img src="/pdfff.svg" alt="PDF" />
      </div>
      
      <div class="progress-bar-container">
        <div class="progress-bar-inner">
          <div class="progress" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
      <div class="desc">Merci de patienter pendant que notre IA analyse votre document.</div>
      
      <!-- Barre de progression du wizard -->
      <div class="progress-bar">
        <span class="step active"></span>
        <span class="step active"></span>
        <span class="step active"></span>
        <span class="step active"></span>
        <span class="step active"></span>
      </div>
    </div>
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
  // Progression visuelle beaucoup plus lente
  let interval = setInterval(() => {
    if (progress.value < 85) {
      progress.value += Math.random() * 2 + 0.5 // Progression très lente et aléatoire
    }
  }, 800) // Intervalle plus long (800ms au lieu de 300ms)
  
  // Appel backend pour générer le contenu IA
  try {
    const result = await props.onGenerate()
    progress.value = 100
    clearInterval(interval)
    setTimeout(() => emit('next', result), 1500) // Attendre plus longtemps avant de passer à l'étape suivante
  } catch (e) {
    clearInterval(interval)
    alert('Erreur lors de la génération IA')
    emit('back')
  }
})
</script>

<style scoped>
.wizard-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0 1.5rem 1.5rem 1.5rem;
}

.wizard-step-loading {
  width: 100%;
  max-width: 1000px;
  min-height: 600px;
  background: #ffffff;
  border-radius: 24px;
  padding: 4rem;
  box-shadow: 0 8px 32px rgba(115, 118, 255, 0.12);
  display: flex;
  flex-direction: column;
  gap: 2rem;
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

.progress-bar-container {
  width: 100%;
  max-width: 500px;
  margin: 2rem 0 1rem 0;
}

.progress-bar-inner {
  width: 100%;
  height: 12px;
  background: #f1f5f9;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transition: width 0.3s ease;
  border-radius: 8px;
}

.desc {
  color: #718096;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 0.95rem;
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
  .wizard-step-loading {
    padding: 2rem;
  }
}
</style> 