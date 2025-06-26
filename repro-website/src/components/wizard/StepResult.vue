<template>
  <div class="wizard-step-result">
    <button class="back-btn" @click="$emit('back')">&larr; Retour</button>
    <h2 class="title">Votre formation est prête !</h2>
    
    <!-- Aperçu de la formation -->
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
    
    <div class="result-block">
      <h3>📝 Résumé</h3>
      <p>{{ result.summary }}</p>
    </div>
    
    <div class="result-block">
      <h3>🎯 Quiz</h3>
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
    
    <button class="save-btn" :disabled="saving" @click="saveFormation">
      <span v-if="!saving">💾 Sauvegarder dans la base de données</span>
      <span v-else>Sauvegarde en cours...</span>
    </button>
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
  result: Object
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

    // Préparer toutes les données en JSON
    const formationData = {
      user_id: user.id,
      title: props.infos.title,
      theme: props.infos.theme,
      description: props.infos.description,
      is_state_recognized: props.infos.is_state_recognized,
      is_creator_certified: props.infos.is_creator_certified,
      
      // Stocker le résumé, quiz et tips directement
      summary: props.result.summary,
      quizzes: props.result.quizzes,
      tips: props.result.tips,
      
      // Stocker toutes les données du wizard en JSON
      formation_data: {
        coverImageUrl: props.coverImageUrl,
        pdfUrl: props.pdfUrl,
        quizConfig: props.quizConfig,
        infos: props.infos,
        iaResult: props.result,
        createdAt: new Date().toISOString()
      },
      
      created_at: new Date()
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
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: stretch;
}

.title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.formation-preview {
  background: #23232d;
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid #3b82f6;
}

.preview-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.preview-cover {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.preview-info h3 {
  margin: 0 0 0.5rem 0;
  color: #fff;
  font-size: 1.2rem;
}

.theme {
  color: #3b82f6;
  font-weight: 500;
  margin: 0 0 0.25rem 0;
}

.config {
  color: #aaa;
  font-size: 0.9rem;
  margin: 0;
}

.preview-description {
  color: #ccc;
  font-size: 0.95rem;
  line-height: 1.4;
  margin: 0;
}

.result-block {
  background: #23232d;
  border-radius: 12px;
  padding: 1.2rem 1.5rem;
  margin-bottom: 1rem;
}

.result-block h3 {
  margin-bottom: 0.5rem;
  color: #3b82f6;
}

.quiz-block {
  margin-bottom: 1rem;
}

.question {
  font-weight: 500;
  margin-bottom: 0.3rem;
}

ul {
  margin: 0 0 0.3rem 0;
  padding-left: 1.2rem;
}

.answer {
  color: #60a5fa;
  font-size: 0.95em;
}

.save-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1.5rem;
  align-self: flex-end;
  transition: background 0.2s;
}

.save-btn:disabled {
  background: #444;
  cursor: not-allowed;
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