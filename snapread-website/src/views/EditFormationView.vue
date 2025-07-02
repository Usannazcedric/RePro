<template>
  <div class="edit-formation page-with-footer">
    <div class="container">
      <div class="header">
        <button @click="goBack" class="back-btn">
          ← Retour aux formations
        </button>
        <h1>Modifier la formation</h1>
      </div>

      <div v-if="loading" class="loading">
        <p>Chargement de la formation...</p>
      </div>

      <div v-else-if="formation" class="edit-form">
        <div class="section">
          <h2>Informations générales</h2>
          <div class="form-group">
            <label>Titre</label>
            <input v-model="formation.title" class="input" />
          </div>
          
          <div class="form-group">
            <label>Thème</label>
            <select v-model="formation.theme" class="input">
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
            <label>Description</label>
            <textarea v-model="formation.description" class="input textarea"></textarea>
          </div>
        </div>

        <div class="section">
          <h2>Photo de couverture</h2>
          <div class="cover-section">
            <div v-if="coverPreview" class="cover-preview">
              <img :src="coverPreview" alt="Couverture" class="cover-img" />
              <button @click="removeCover" class="remove-btn remove-btn-absolute">×</button>
            </div>
            <div v-else class="cover-upload">
              <input type="file" ref="coverInput" @change="handleCoverUpload" accept="image/*" class="file-input" />
              <button @click="$refs.coverInput.click()" class="upload-btn">
                Ajouter une photo
              </button>
            </div>
          </div>
        </div>

        <div v-if="hasChapters" class="section">
          <h2>Chapitres de la formation</h2>
          
          <div v-for="(chapter, chapterIndex) in formation.chapters" :key="chapter.id" class="chapter-item">
            <div class="chapter-header">
              <h3>Chapitre {{ chapter.id }}: {{ chapter.title }}</h3>
              <button @click="removeChapter(chapterIndex)" class="remove-btn" v-if="formation.chapters.length > 1">×</button>
            </div>
            
            <div class="form-group">
              <label>Titre du chapitre</label>
              <input v-model="chapter.title" class="input" />
            </div>
            
            <div class="courses-section">
              <h4>Cours</h4>
              <div v-for="(course, courseIndex) in chapter.courses" :key="course.id" class="course-item">
                <div class="course-header">
                  <span>Cours {{ course.id }}</span>
                  <button @click="removeCourse(chapterIndex, courseIndex)" class="remove-btn" v-if="chapter.courses.length > 1">×</button>
                </div>
                
                <div class="form-group">
                  <label>Titre du cours</label>
                  <input v-model="course.title" class="input" />
                </div>
                
                <div class="form-group">
                  <label>Durée</label>
                  <input v-model="course.duration" class="input" placeholder="ex: 15 minutes" />
                </div>
                
                <div class="form-group">
                  <label>Contenu</label>
                  <textarea v-model="course.content" class="input textarea" rows="3"></textarea>
                </div>
              </div>
              
              <button @click="addCourse(chapterIndex)" class="add-btn">+ Ajouter un cours</button>
            </div>
            
            <div class="quizzes-section">
              <h4>Quiz</h4>
              <div v-for="(quiz, quizIndex) in chapter.quizzes" :key="quiz.id" class="quiz-item">
                <div class="quiz-header">
                  <span>Quiz {{ quiz.id }}</span>
                  <button @click="removeChapterQuiz(chapterIndex, quizIndex)" class="remove-btn" v-if="chapter.quizzes.length > 1">×</button>
                </div>
                
                <div class="form-group">
                  <label>Question</label>
                  <input v-model="quiz.question" class="input" />
                </div>
                
                <div class="options-grid">
                  <div v-for="(option, letter) in quiz.options" :key="letter" class="option-group">
                    <label>Option {{ letter }}</label>
                    <input v-model="quiz.options[letter]" class="input" />
                    <label class="radio-label">
                      <input 
                        type="radio" 
                        :name="`correct-${chapterIndex}-${quizIndex}`" 
                        :value="letter" 
                        v-model="quiz.correctAnswer"
                      />
                      Bonne réponse
                    </label>
                  </div>
                </div>
              </div>
              
              <button @click="addChapterQuiz(chapterIndex)" class="add-btn">+ Ajouter un quiz</button>
            </div>
          </div>
          
          <button @click="addChapter" class="add-chapter-btn">+ Ajouter un chapitre</button>
        </div>
        
        <div v-else>
          <div class="section">
            <h2>Résumé du cours</h2>
            <div class="form-group">
              <textarea v-model="formation.summary" class="input textarea" rows="4"></textarea>
            </div>
          </div>

          <div class="section">
            <h2>Quiz</h2>
            <div v-for="(quiz, index) in formation.quizzes" :key="index" class="quiz-item">
              <div class="quiz-header">
                <h3>Question {{ index + 1 }}</h3>
                <button @click="removeQuiz(index)" class="remove-btn">×</button>
              </div>
              
              <div class="form-group">
                <label>Question</label>
                <input v-model="quiz.question" class="input" />
              </div>
              
              <div class="options-grid">
                <div v-for="(option, letter) in quiz.options" :key="letter" class="option-group">
                  <label>Option {{ letter }}</label>
                  <input v-model="quiz.options[letter]" class="input" />
                  <label class="radio-label">
                    <input 
                      type="radio" 
                      :name="`correct-${index}`" 
                      :value="letter" 
                      v-model="quiz.correctAnswer"
                    />
                    Bonne réponse
                  </label>
                </div>
              </div>
            </div>
            
            <button @click="addQuiz" class="add-quiz-btn">+ Ajouter un quiz</button>
          </div>

          <div class="section">
            <h2>Conseils et astuces</h2>
            <div class="form-group">
              <textarea v-model="formation.tips" class="input textarea" rows="3"></textarea>
            </div>
          </div>
        </div>

        <div class="actions">
          <button @click="saveChanges" :disabled="saving" class="save-btn">
            {{ saving ? 'Sauvegarde...' : 'Sauvegarder les modifications' }}
          </button>
          <button @click="goBack" class="cancel-btn">Annuler</button>
        </div>
      </div>

      <div v-else class="error">
        <p>Formation non trouvée</p>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../supabase'
import Footer from '../components/Footer.vue'

const route = useRoute()
const router = useRouter()

const formation = ref(null)
const loading = ref(true)
const saving = ref(false)
const coverPreview = ref('')
const coverInput = ref(null)
const newCoverFile = ref(null)

// Computed pour détecter le format
const hasChapters = computed(() => {
  return formation.value?.chapters && formation.value.chapters.length > 0
})

onMounted(async () => {
  await loadFormation()
})

async function loadFormation() {
  try {
    const formationId = route.params.id
    
    const { data, error } = await supabase
      .from('formations')
      .select('*')
      .eq('id', formationId)
      .single()

    if (error) throw error

    // Détecter le format de la formation
    const hasChapters = data.formation_data?.chapters && data.formation_data.chapters.length > 0
    
    formation.value = {
      id: data.id,
      title: data.title,
      theme: data.theme,
      description: data.description,
      // Nouveau format avec chapitres
      chapters: hasChapters ? data.formation_data.chapters : [],
      // Ancien format (fallback)
      summary: data.summary,
      quizzes: data.quizzes || [],
      tips: data.tips,
      is_state_recognized: data.is_state_recognized,
      is_creator_certified: data.is_creator_certified,
      formation_data: data.formation_data || {}
    }

    // Charger la photo de couverture si elle existe
    if (data.formation_data?.coverImageUrl) {
      coverPreview.value = data.formation_data.coverImageUrl
    }

  } catch (error) {
    console.error('Erreur lors du chargement:', error)
    alert('Erreur lors du chargement de la formation')
  } finally {
    loading.value = false
  }
}

function handleCoverUpload(event) {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Taille maximale : 5MB')
      return
    }
    
    newCoverFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      coverPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function removeCover() {
  coverPreview.value = ''
  newCoverFile.value = null
  if (coverInput.value) {
    coverInput.value.value = ''
  }
}

function addQuiz() {
  formation.value.quizzes.push({
    question: 'Nouvelle question',
    options: {
      A: 'Option A',
      B: 'Option B',
      C: 'Option C',
      D: 'Option D'
    },
    correctAnswer: 'A'
  })
}

function removeQuiz(index) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) {
    formation.value.quizzes.splice(index, 1)
  }
}

// Fonctions pour gérer les chapitres
function addChapter() {
  const newChapterId = formation.value.chapters.length + 1
  formation.value.chapters.push({
    id: newChapterId,
    title: `Nouveau chapitre ${newChapterId}`,
    courses: [{
      id: 1,
      title: 'Nouveau cours',
      duration: '15 minutes',
      content: 'Contenu du cours...'
    }],
    quizzes: [{
      id: 1,
      question: 'Nouvelle question',
      options: {
        A: 'Option A',
        B: 'Option B',
        C: 'Option C',
        D: 'Option D'
      },
      correctAnswer: 'A'
    }]
  })
}

function removeChapter(chapterIndex) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce chapitre ?')) {
    formation.value.chapters.splice(chapterIndex, 1)
    // Réorganiser les IDs des chapitres
    formation.value.chapters.forEach((chapter, index) => {
      chapter.id = index + 1
    })
  }
}

function addCourse(chapterIndex) {
  const chapter = formation.value.chapters[chapterIndex]
  const newCourseId = chapter.courses.length + 1
  chapter.courses.push({
    id: newCourseId,
    title: `Nouveau cours ${newCourseId}`,
    duration: '15 minutes',
    content: 'Contenu du cours...'
  })
}

function removeCourse(chapterIndex, courseIndex) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
    const chapter = formation.value.chapters[chapterIndex]
    chapter.courses.splice(courseIndex, 1)
    // Réorganiser les IDs des cours
    chapter.courses.forEach((course, index) => {
      course.id = index + 1
    })
  }
}

function addChapterQuiz(chapterIndex) {
  const chapter = formation.value.chapters[chapterIndex]
  const newQuizId = chapter.quizzes.length + 1
  chapter.quizzes.push({
    id: newQuizId,
    question: 'Nouvelle question',
    options: {
      A: 'Option A',
      B: 'Option B',
      C: 'Option C',
      D: 'Option D'
    },
    correctAnswer: 'A'
  })
}

function removeChapterQuiz(chapterIndex, quizIndex) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) {
    const chapter = formation.value.chapters[chapterIndex]
    chapter.quizzes.splice(quizIndex, 1)
    // Réorganiser les IDs des quiz
    chapter.quizzes.forEach((quiz, index) => {
      quiz.id = index + 1
    })
  }
}

async function saveChanges() {
  saving.value = true
  
  try {
    let updateData = {
      title: formation.value.title,
      theme: formation.value.theme,
      description: formation.value.description
    }

    if (hasChapters.value) {
      // Nouveau format avec chapitres
      updateData.formation_data = {
        ...formation.value.formation_data,
        chapters: formation.value.chapters,
        coverImageUrl: coverPreview.value,
        updatedAt: new Date().toISOString()
      }
      // Nettoyer les anciennes colonnes si elles existent
      updateData.summary = null
      updateData.quizzes = null
      updateData.tips = null
    } else {
      // Ancien format
      updateData.summary = formation.value.summary
      updateData.quizzes = formation.value.quizzes
      updateData.tips = formation.value.tips
      updateData.formation_data = {
        ...formation.value.formation_data,
        coverImageUrl: coverPreview.value,
        updatedAt: new Date().toISOString()
      }
    }

    const { error } = await supabase
      .from('formations')
      .update(updateData)
      .eq('id', formation.value.id)

    if (error) throw error

    alert('Modifications sauvegardées avec succès !')
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    alert('Erreur lors de la sauvegarde: ' + error.message)
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.push('/formations')
}
</script>

<style scoped>
.edit-formation {
  min-height: 100vh;
  background: #E9E9EE;
  color: #000;
  padding: 2rem 1rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
}

.back-btn {
  background: none;
  border: none;
  color: #7376FF;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
}

.header h1 {
  font-size: 2rem;
  margin: 0;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}

.section {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section h2 {
  margin-top: 0;
  color: #7376FF;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.input {
  width: 100%;
  max-width: 100%;
  background: #ffffff;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  padding: 0.8rem;
  color: #000;
  font-size: 1rem;
  box-sizing: border-box;
  resize: none;
}

.input:focus {
  outline: none;
  border-color: #7376FF;
  box-shadow: 0 0 0 3px rgba(115, 118, 255, 0.1);
}

.textarea {
  min-height: 80px;
  resize: vertical;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.cover-section {
  margin-top: 1rem;
}

.cover-preview {
  position: relative;
  width: 200px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: relative;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
}

.remove-btn:hover {
  background: rgba(255, 0, 0, 0.9);
}

.remove-btn-absolute {
  position: absolute;
  top: 8px;
  right: 8px;
}

.file-input {
  display: none;
}

.upload-btn {
  background: #7376FF;
  border: 1.5px solid #7376FF;
  color: #fff;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.upload-btn:hover {
  background: #5d60d6;
}

.quiz-item {
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.quiz-header h3 {
  margin: 0;
}

.remove-quiz-btn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 1.2rem;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  width: 100%;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.add-quiz-btn {
  background: #7376FF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  margin-top: 1rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.save-btn {
  background: #7376FF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.save-btn:hover:not(:disabled) {
  background: #5d60d6;
}

.save-btn:disabled {
  background: #444;
  cursor: not-allowed;
}

.cancel-btn {
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  cursor: pointer;
}

/* Styles pour les chapitres */
.chapter-item {
  background: #ffffff;
  border: 2px solid #7376FF;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.chapter-header h3 {
  margin: 0;
  color: #7376FF;
  font-size: 1.25rem;
}

.courses-section, .quizzes-section {
  margin-top: 1.5rem;
}

.courses-section h4, .quizzes-section h4 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.course-item {
  background: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 500;
  color: #4a5568;
}

.add-btn {
  background: #7376FF;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  transition: background 0.2s;
}

.add-btn:hover {
  background: #5d60d6;
}

.add-chapter-btn {
  background: #7376FF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  transition: background 0.2s;
}

.add-chapter-btn:hover {
  background: #5d60d6;
}

.chapter-item .remove-btn {
  position: relative;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
}

.chapter-item .remove-btn:hover {
  background: rgba(255, 0, 0, 0.9);
}

@media (max-width: 768px) {
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .edit-formation {
    padding: 1rem 0.5rem;
  }
  
  .chapter-item {
    padding: 1rem;
  }
  
  .chapter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .course-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style> 