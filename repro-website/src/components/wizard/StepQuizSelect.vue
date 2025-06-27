<template>
  <div class="wizard-wrapper">
    <div class="wizard-step-quiz-select">
      <button class="back-btn" @click="$emit('back')">&larr; Retour</button>
      <h2 class="title">Sélectionnez le nombre de chapitres et quiz de votre formation</h2>
      <div class="selectors">
        <div class="selector">
          <label>Chapitres</label>
          <div class="counter">
            <button @click="change('chapters', -1)" :disabled="chapters <= 1">-</button>
            <span>{{ chapters }}</span>
            <button @click="change('chapters', 1)">+</button>
          </div>
        </div>
        <div class="selector">
          <label>Quiz</label>
          <div class="counter">
            <button @click="change('quizzes', -1)" :disabled="quizzes <= 1">-</button>
            <span>{{ quizzes }}</span>
            <button @click="change('quizzes', 1)">+</button>
          </div>
        </div>
      </div>
      <div class="desc">Faites défiler le nombre afin qu'il corresponde avec vos attentes</div>
      <button class="next-btn" @click="nextStep">Notre IA génère votre formation</button>
      
      <!-- Barre de progression -->
      <div class="progress-bar">
        <span class="step active"></span>
        <span class="step active"></span>
        <span class="step active"></span>
        <span class="step active"></span>
        <span class="step"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    default: () => ({ chapters: 1, quizzes: 5 })
  }
})

const emit = defineEmits(['next', 'back'])

const chapters = ref(props.config?.chapters || 1)
const quizzes = ref(props.config?.quizzes || 5)

function change(type, val) {
  if (type === 'chapters') chapters.value = Math.max(1, chapters.value + val)
  if (type === 'quizzes') quizzes.value = Math.max(1, quizzes.value + val)
}

function nextStep() {
  emit('next', { chapters: chapters.value, quizzes: quizzes.value })
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

.wizard-step-quiz-select {
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
  align-items: center;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2d3748;
  text-align: center;
}

.selectors {
  display: flex;
  gap: 3rem;
  margin-bottom: 1.5rem;
}

.selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.selector label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.counter {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: #f8fafc;
  border-radius: 16px;
  padding: 1rem 1.5rem;
  border: 2px solid #e2e8f0;
}

.counter button {
  background: #6366f1;
  border: none;
  color: #fff;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 40px;
  font-weight: 600;
}

.counter button:hover:not(:disabled) {
  background: #4f46e5;
  transform: scale(1.05);
}

.counter button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.counter span {
  font-size: 1.5rem;
  font-weight: bold;
  color: #6366f1;
  min-width: 30px;
  text-align: center;
}

.desc {
  color: #718096;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 0.95rem;
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
  .wizard-step-quiz-select {
    padding: 2rem;
  }
  .selectors {
    flex-direction: column;
    gap: 2rem;
  }
}
</style> 