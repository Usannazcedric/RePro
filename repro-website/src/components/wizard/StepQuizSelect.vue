<template>
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
.wizard-step-quiz-select {
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
.selectors {
  display: flex;
  gap: 2.5rem;
  margin-bottom: 1.5rem;
}
.selector {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.counter {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}
.counter button {
  background: #23232d;
  border: 1.5px solid #3b3b4d;
  color: #fff;
  border-radius: 8px;
  padding: 0.3rem 1.2rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
}
.counter button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.counter span {
  font-size: 1.2rem;
  font-weight: bold;
  color: #3b82f6;
}
.desc {
  color: #aaa;
  margin-bottom: 1.5rem;
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