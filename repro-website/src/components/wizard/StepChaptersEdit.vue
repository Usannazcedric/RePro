<template>
  <div class="wizard-wrapper">
    <div class="chapters-edit">
      <!-- Bouton retour -->
      <button class="back-btn" @click="$emit('back')">&larr; Retour</button>
      
      <div class="header">
        <h2>Notre IA a fini d'optimiser votre formation</h2>
        <p>vous pouvez modifier et ajuster la formation à votre goût</p>
      </div>

    <div v-if="!chapters || chapters.length === 0" class="no-chapters">
      <p>Aucun chapitre trouvé. Vérifiez que l'IA a bien généré des chapitres.</p>
      <button @click="createDefaultChapters" class="create-default-btn">Créer 3 chapitres par défaut</button>
    </div>

    <div v-else class="chapters-container">
      <div v-for="(chapter, chapterIndex) in chapters" :key="chapter.id" class="chapter-column">
        <div class="chapter-header">
          <h3>Chapitre {{ chapter.id }}</h3>
          <div class="chapter-title-edit">
            <input 
              v-model="chapter.title" 
              class="chapter-title-input"
              placeholder="Titre du chapitre"
            />
            <button @click="editChapter(chapterIndex)" class="edit-btn-small">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="chapter-content">
          <!-- Cours du chapitre -->
          <div v-for="(course, courseIndex) in chapter.courses" :key="course.id" class="content-item">
            <div class="item-header">
              <div class="item-number">{{ courseIndex + 1 }}</div>
              <div class="item-info">
                <input 
                  v-model="course.title" 
                  class="item-title"
                  placeholder="Titre du cours"
                />
                <div class="item-meta">
                  Cours • <input v-model="course.duration" class="duration-input" placeholder="0:00" />
                </div>
              </div>
              <div class="item-actions">
                <button @click="editCourse(chapterIndex, courseIndex)" class="action-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>
                <button @click="removeCourse(chapterIndex, courseIndex)" class="action-btn delete">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </div>
            <textarea 
              v-model="course.content" 
              class="item-description"
              placeholder="Description du cours"
            ></textarea>
          </div>

          <!-- Bouton ajouter cours -->
          <div class="add-item-btn" @click="addCourse(chapterIndex)">
            + Ajouter un cours
          </div>

          <!-- Quiz du chapitre -->
          <div v-for="(quiz, quizIndex) in chapter.quizzes" :key="quiz.id" class="content-item quiz-item">
            <div class="item-header">
              <div class="item-number quiz-number">{{ (chapterIndex * 10) + quizIndex + 51 }}</div>
              <div class="item-info">
                <input 
                  v-model="quiz.title" 
                  class="item-title"
                  placeholder="Titre du quiz"
                />
                <div class="item-meta">Quiz •</div>
              </div>
              <div class="item-actions">
                <button @click="editQuiz(chapterIndex, quizIndex)" class="action-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>
                <button @click="removeQuiz(chapterIndex, quizIndex)" class="action-btn delete">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <input 
              v-model="quiz.question" 
              class="quiz-question"
              placeholder="Question du quiz"
            />
            
            <!-- Options du quiz -->
            <div class="quiz-options">
              <div v-for="(option, letter) in quiz.options" :key="letter" class="quiz-option">
                <input 
                  v-model="quiz.options[letter]" 
                  class="option-input"
                  :placeholder="`Option ${letter}`"
                />
                <label class="correct-answer">
                  <input 
                    type="radio" 
                    :name="`correct-${chapterIndex}-${quizIndex}`" 
                    :value="letter" 
                    v-model="quiz.correctAnswer"
                  />
                  Correcte
                </label>
              </div>
            </div>
          </div>

          <!-- Bouton ajouter quiz -->
          <div class="add-item-btn" @click="addQuiz(chapterIndex)">
            + Ajouter un quiz
          </div>
        </div>
      </div>
    </div>


    <div class="actions">
      <button @click="nextStep" class="next-btn">
        Passer à l'étape suivante
      </button>
    </div>

    <!-- Barre de progression -->
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
import { ref, defineProps, defineEmits, onMounted } from 'vue'

const props = defineProps({
  chapters: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['next', 'update-chapters', 'back'])

onMounted(() => {
  console.log('🔍 StepChaptersEdit - Chapitres reçus:', props.chapters)
  console.log('🔍 Nombre de chapitres:', props.chapters?.length)
  if (props.chapters?.length > 0) {
    console.log('🔍 Premier chapitre:', props.chapters[0])
  }
})

let nextCourseId = ref(10)
let nextQuizId = ref(10)

function editChapter(chapterIndex) {
  console.log('Édition du chapitre:', chapterIndex)
}

function editCourse(chapterIndex, courseIndex) {
  console.log('Édition du cours:', chapterIndex, courseIndex)
}

function editQuiz(chapterIndex, quizIndex) {
  console.log('Édition du quiz:', chapterIndex, quizIndex)
}

function addCourse(chapterIndex) {
  const newCourse = {
    id: nextCourseId.value++,
    title: "Nouveau cours",
    duration: "3:00",
    content: "Description du nouveau cours"
  }
  props.chapters[chapterIndex].courses.push(newCourse)
  emit('update-chapters', props.chapters)
}

function addQuiz(chapterIndex) {
  const newQuiz = {
    id: nextQuizId.value++,
    title: "Nouveau quiz",
    question: "Nouvelle question ?",
    options: {
      A: "Option A",
      B: "Option B", 
      C: "Option C",
      D: "Option D"
    },
    correctAnswer: "A"
  }
  props.chapters[chapterIndex].quizzes.push(newQuiz)
  emit('update-chapters', props.chapters)
}

function removeCourse(chapterIndex, courseIndex) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
    props.chapters[chapterIndex].courses.splice(courseIndex, 1)
    emit('update-chapters', props.chapters)
  }
}

function removeQuiz(chapterIndex, quizIndex) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) {
    props.chapters[chapterIndex].quizzes.splice(quizIndex, 1)
    emit('update-chapters', props.chapters)
  }
}

function createDefaultChapters() {
  const defaultChapters = [
    {
      id: 1,
      title: "Introduction au sujet",
      courses: [
        {
          id: 1,
          title: "Cours d'introduction",
          duration: "4:30",
          content: "Description du cours d'introduction"
        }
      ],
      quizzes: [
        {
          id: 1,
          title: "Test - Chapitre 1",
          question: "Question d'introduction",
          options: {
            A: "Option A",
            B: "Option B",
            C: "Option C",
            D: "Option D"
          },
          correctAnswer: "A"
        }
      ]
    },
    {
      id: 2,
      title: "Développement",
      courses: [
        {
          id: 2,
          title: "Cours de développement",
          duration: "5:15",
          content: "Description du cours de développement"
        }
      ],
      quizzes: [
        {
          id: 2,
          title: "Test - Chapitre 2",
          question: "Question sur le développement",
          options: {
            A: "Option A",
            B: "Option B",
            C: "Option C",
            D: "Option D"
          },
          correctAnswer: "B"
        }
      ]
    },
    {
      id: 3,
      title: "Conclusion",
      courses: [
        {
          id: 3,
          title: "Cours de conclusion",
          duration: "6:00",
          content: "Description du cours de conclusion"
        }
      ],
      quizzes: [
        {
          id: 3,
          title: "Test - Chapitre 3",
          question: "Question de conclusion",
          options: {
            A: "Option A",
            B: "Option B",
            C: "Option C",
            D: "Option D"
          },
          correctAnswer: "C"
        }
      ]
    }
  ]
  
  emit('update-chapters', defaultChapters)
}

function nextStep() {
  console.log('🚀 Envoi des chapitres:', props.chapters)
  emit('next', props.chapters)
}
</script>

<style scoped>
.wizard-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0 1.5rem 1.5rem 1.5rem;
}

.chapters-edit {
  width: 100%;
  max-width: 1600px;
  min-height: 900px;
  background: #ffffff;
  border-radius: 24px;
  padding: 4rem;
  box-shadow: 0 8px 32px rgba(115, 118, 255, 0.12);
  border: none;
  margin-top: -2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h2 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.header p {
  color: #718096;
  font-size: 1.1rem;
}

.chapters-container {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 3rem;
  align-items: flex-start;
}

.chapter-column {
  width: 400px;
  min-width: 400px;
  max-width: 400px;
  flex-shrink: 0;
}

.chapter-header h3 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #2d3748;
  text-align: center;
}

.chapter-title-edit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: #ffffff;
  border-radius: 12px;
  padding: 0.8rem;
  box-shadow: 0 4px 12px rgba(115, 118, 255, 0.1);
  border: 1px solid #f1f1f1;
}

.chapter-title-input {
  flex: 1;
  background: none;
  border: none;
  padding: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  color: #2d3748;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chapter-title-input:focus {
  outline: none;
}

.edit-btn-small {
  background: #7376FF;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 0.8rem;
  min-width: 32px;
}

.chapter-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content-item {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.2rem;
  box-shadow: 0 4px 16px rgba(115, 118, 255, 0.08);
  border-left: 4px solid #7376FF;
  overflow: hidden;
  word-wrap: break-word;
  border: 1px solid #f7f7f7;
}

.quiz-item {
  border-left: 4px solid #9f7aea;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.8rem;
}

.item-number {
  background: #7376FF;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.quiz-number {
  background: #f59e0b;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 200px;
}

.item-title {
  background: none;
  border: none;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.3rem 0;
  color: #2d3748;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-title:focus {
  outline: none;
  border-bottom: 2px solid #7376FF;
}

.item-meta {
  color: #718096;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.duration-input {
  background: none;
  border: none;
  color: #718096;
  font-size: 0.85rem;
  width: 50px;
}

.duration-input:focus {
  outline: none;
  border-bottom: 1px solid #7376FF;
}

.item-description {
  background: #fafafa;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
  font-size: 0.85rem;
  color: #2d3748;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  margin-bottom: 0.5rem;
}

.item-description:focus {
  outline: none;
  border-color: #7376FF;
}

.quiz-question {
  background: #fafafa;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  font-size: 0.9rem;
  color: #2d3748;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  margin-bottom: 0.8rem;
  resize: none;
}

.quiz-question:focus {
  outline: none;
  border-color: #7376FF;
}

.quiz-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.quiz-option {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.option-input {
  background: #fafafa;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.85rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  color: #2d3748;
}

.option-input:focus {
  outline: none;
  border-color: #7376FF;
}

.correct-answer {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #718096;
}

.item-actions {
  display: flex;
  gap: 0.3rem;
  flex-shrink: 0;
}

.action-btn {
  background: #fafafa;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 8px;
  font-size: 0.8rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #7376FF;
  border-color: #7376FF;
  color: white;
}

.action-btn.delete:hover {
  background: #e53e3e;
  border-color: #e53e3e;
  color: white;
}

.add-item-btn {
  background: #fafafa;
  border: 2px dashed #cbd5e0;
  border-radius: 16px;
  padding: 1rem;
  text-align: center;
  color: #718096;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  margin: 0.5rem 0;
}

.add-item-btn:hover {
  background: #f7fafc;
  border-color: #7376FF;
  color: #7376FF;
  transform: translateY(-1px);
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

.actions {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.next-btn {
  background: #7376FF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.next-btn:hover {
  background: #5d60d6;
}

.no-chapters {
  text-align: center;
  padding: 3rem;
  background: #ffffff;
  border-radius: 16px;
  margin-bottom: 2rem;
  border: 1px solid #f1f1f1;
  box-shadow: 0 4px 12px rgba(115, 118, 255, 0.08);
}

.create-default-btn {
  background: #7376FF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  cursor: pointer;
  margin-top: 1rem;
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
  margin-bottom: 1rem;
}

.back-btn:hover {
  color: #4f46e5;
}

@media (max-width: 1200px) {
  .chapters-container {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
  
  .chapter-column {
    width: 500px;
    min-width: 500px;
    max-width: 500px;
  }
}

@media (max-width: 768px) {
  .chapters-edit {
    padding: 1rem;
  }
  
  .header h2 {
    font-size: 1.5rem;
  }
  
  .chapter-column {
    width: 100%;
    min-width: 320px;
    max-width: 100%;
  }
  
  .quiz-options {
    grid-template-columns: 1fr;
  }
  
  .progress-step {
    width: 32px;
    height: 8px;
  }
}
</style> 