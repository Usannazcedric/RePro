<template>
  <div class="wizard-wrapper">
    <div class="wizard-step-result">
    <button class="back-btn" @click="$emit('back')">&larr; Retour</button>
    <h2 class="title">Votre formation est prête !</h2>
    
    <div class="formation-preview">
      <div class="preview-header">
        <img v-if="coverImageUrl" :src="coverImageUrl" alt="Couverture" class="preview-cover" />
        <div class="preview-info">
          <h3>{{ infos.title }}</h3>
          <p class="theme">{{ infos.theme }}</p>
          <p class="config">{{ quizConfig.chapters }} chapitre{{ quizConfig.chapters > 1 ? 's' : '' }} • {{ quizConfig.quizzes }} quiz</p>
        </div>
      </div>
      <p class="preview-description">{{ infos.description }}</p>
    </div>
    

    <div v-if="chapters && chapters.length" class="chapters-preview">
      <h3>Aperçu des chapitres</h3>
      <div v-for="chapter in chapters" :key="chapter.id" class="chapter-preview">
        <h4>Chapitre {{ chapter.id }}: {{ chapter.title }}</h4>
        
        <div class="chapter-content">
          <div class="courses-list">
            <h5>Cours ({{ chapter.courses.length }})</h5>
            <div v-for="course in chapter.courses" :key="course.id" class="course-item">
              <span class="course-number">{{ course.id }}</span>
              <div class="course-info">
                <p class="course-title">{{ course.title }}</p>
                <p class="course-duration">{{ course.duration }}</p>
              </div>
            </div>
          </div>
          
          <div class="quizzes-list">
            <h5>Quiz ({{ chapter.quizzes.length }})</h5>
            <div v-for="quiz in chapter.quizzes" :key="quiz.id" class="quiz-item">
              <span class="quiz-number">{{ quiz.id }}</span>
              <div class="quiz-info">
                <p class="quiz-title">{{ quiz.title }}</p>
                <p class="quiz-question">{{ quiz.question }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="result">
      <div class="result-block">
        <h3>Résumé</h3>
        <p>{{ result.summary }}</p>
      </div>
      
      <div class="result-block">
        <h3>Quiz</h3>
        <div v-for="(quiz, index) in result.quizzes" :key="index" class="quiz-block">
          <p class="question">{{ quiz.question }}</p>
          <ul>
            <li v-for="(option, letter) in quiz.options" :key="letter">
              {{ letter }}) {{ option }}
            </li>
          </ul>
          <div class="answer">Réponse correcte : <b>{{ quiz.correctAnswer }}</b></div>
        </div>
      </div>
      
      <div class="result-block">
        <h3>💡 Astuce clé</h3>
        <p>{{ result.tips }}</p>
      </div>
    </div>
    
    <button class="save-btn" :disabled="saving" @click="saveFormation">
      <span v-if="!saving">Sauvegarder dans la base de données</span>
      <span v-else>Sauvegarde en cours...</span>
    </button>
    
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
import { ref } from 'vue'
import { supabase } from '../../supabase'

const props = defineProps({
  infos: Object,
  pdfUrl: String,
  coverImageUrl: String,
  quizConfig: Object,
  result: Object,
  chapters: Array
})

const emit = defineEmits(['saved', 'back'])
const saving = ref(false)

async function saveFormation() {
  saving.value = true
  
  try {
    const user = (await supabase.auth.getSession()).data.session?.user
    if (!user) {
      alert('Vous devez être connecté')
      return
    }

    const formationData = {
      user_id: user.id,
      title: props.infos.title,
      theme: props.infos.theme,
      description: props.infos.description,
      
      formation_data: {
        infos: props.infos,
        
        coverImageUrl: props.coverImageUrl,
        pdfUrl: props.pdfUrl,
        
        quizConfig: props.quizConfig,
        
        chapters: props.chapters,
        iaResult: props.result,
        
        quizCount: props.chapters?.reduce((total, chapter) => total + (chapter.quizzes?.length || 0), 0) || 0,
        chapterCount: props.chapters?.length || 1,
        
        createdAt: new Date().toISOString(),
        version: "2.0"
      }
    }

    console.log('💾 Sauvegarde des données:', formationData)

    const { error } = await supabase
      .from('formations')
      .insert([formationData])

    if (error) {
      console.error('Erreur Supabase:', error)
      alert('Erreur lors de la sauvegarde: ' + error.message)
      return
    }

    alert('Formation sauvegardée avec succès !')
    emit('saved')
    
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de la sauvegarde')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.wizard-step-result {
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
  align-items: stretch;
}

.wizard-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0 1.5rem 1.5rem 1.5rem;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #2d3748;
}

.formation-preview {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(115, 118, 255, 0.08);
}

.preview-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.preview-cover {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid #f1f1f1;
}

.preview-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: bold;
}

.theme {
  color: #7376FF;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.config {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
}

.preview-description {
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
}

.result-block {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(115, 118, 255, 0.06);
}

.result-block h3 {
  margin-bottom: 1rem;
  color: #7376FF;
  font-size: 1.2rem;
  font-weight: bold;
}

.quiz-block {
  margin-bottom: 1rem;
}

.question {
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: #2d3748;
  font-size: 1rem;
}

ul {
  margin: 0 0 0.8rem 0;
  padding-left: 1.5rem;
  color: #4a5568;
}

.answer {
  color: #7376FF;
  font-size: 1rem;
  font-weight: 500;
}

.save-btn {
  background: #7376FF;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  align-self: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(115, 118, 255, 0.3);
}

.save-btn:hover:not(:disabled) {
  background: #5d60d6;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(115, 118, 255, 0.4);
}

.save-btn:disabled {
  background: #cbd5e0;
  color: #718096;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.back-btn {
  background: none;
  border: none;
  color: #7376FF;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  align-self: flex-start;
  font-weight: 500;
  transition: color 0.2s ease;
}

.back-btn:hover {
  color: #5d60d6;
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

/* Styles pour l'aperçu des chapitres */
.chapters-preview {
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(115, 118, 255, 0.08);
}

.chapters-preview h3 {
  margin-bottom: 2rem;
  color: #7376FF;
  font-size: 1.3rem;
  font-weight: bold;
}

.chapter-preview {
  background: #fafafa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid #f1f1f1;
}

.chapter-preview h4 {
  color: #2d3748;
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  font-weight: bold;
}

.chapter-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.courses-list h5, .quizzes-list h5 {
  color: #7376FF;
  font-size: 1rem;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.course-item, .quiz-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
  padding: 1rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(115, 118, 255, 0.04);
}

.course-number, .quiz-number {
  background: #7376FF;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: bold;
  flex-shrink: 0;
}

.course-info, .quiz-info {
  flex: 1;
}

.course-title, .quiz-title {
  margin: 0;
  color: #2d3748;
  font-size: 0.95rem;
  font-weight: 600;
}

.course-duration {
  margin: 0;
  color: #718096;
  font-size: 0.85rem;
}

.quiz-question {
  margin: 0;
  color: #4a5568;
  font-size: 0.85rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .chapter-content {
    grid-template-columns: 1fr;
  }
}
</style> 