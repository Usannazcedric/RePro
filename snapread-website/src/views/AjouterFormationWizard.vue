<template>
  <div class="ajouter-formation-wizard page-with-footer">
    <component
      :is="steps[currentStep].component"
      v-bind="steps[currentStep].props()"
      @next="handleNext"
      @back="handleBack"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StepTypeSelect from '../components/wizard/StepTypeSelect.vue'
import StepInfos from '../components/wizard/StepInfos.vue'
import StepUpload from '../components/wizard/StepUpload.vue'
import StepLoading from '../components/wizard/StepLoading.vue'
import StepChaptersEdit from '../components/wizard/StepChaptersEdit.vue'

const currentStep = ref(0)
const type = ref('pdf')
const infos = ref({})
const pdfUrl = ref('')
const file = ref(null)
const coverImage = ref(null)
const coverImageUrl = ref('')
const quizConfig = ref({ chapters: 3, quizzes: 5 })
const iaResult = ref(null)
const chapters = ref([])

const steps = [
  {
    component: StepTypeSelect,
    props: () => ({})
  },
  {
    component: StepInfos,
    props: () => ({ 
      infos: infos.value,
      coverImage: coverImage.value,
      coverImageUrl: coverImageUrl.value
    })
  },
  {
    component: StepUpload,
    props: () => ({})
  },
  {
    component: StepLoading,
    props: () => ({
      pdfUrl: pdfUrl.value,
      onGenerate: generateIAContent
    })
  },
  {
    component: StepChaptersEdit,
    props: () => ({
      chapters: chapters.value,
      infos: infos.value,
      pdfUrl: pdfUrl.value,
      coverImageUrl: coverImageUrl.value,
      quizConfig: quizConfig.value,
      result: iaResult.value
    })
  }
]

function handleNext(payload) {
  if (currentStep.value === 0) {
    type.value = payload
    currentStep.value++
  } else if (currentStep.value === 1) {
    infos.value = payload.infos
    if (payload.coverImage) {
      coverImage.value = payload.coverImage
      coverImageUrl.value = payload.coverImageUrl
    }
    currentStep.value++
  } else if (currentStep.value === 2) {
    file.value = payload.file
    pdfUrl.value = payload.pdfUrl
    currentStep.value++
  } else if (currentStep.value === 3) {
    // IA loading step, handled by StepLoading
    // next is called with IA result
    console.log('🤖 Résultat IA reçu:', payload)
    iaResult.value = payload
    
    // Vérifier si l'IA a renvoyé le nouveau format (chapters) ou l'ancien (summary/quizzes)
    if (payload.chapters && Array.isArray(payload.chapters)) {
      chapters.value = payload.chapters
      console.log('✅ Nouveau format détecté - Chapitres extraits:', chapters.value)
    } else if (payload.summary || payload.quizzes) {
      console.log('⚠️ Ancien format détecté, conversion en chapitres...')
      // Convertir l'ancien format en nouveau format
      chapters.value = convertOldFormatToChapters(payload)
      console.log('🔄 Chapitres convertis:', chapters.value)
    } else {
      console.log('❌ Format non reconnu, utilisation de chapitres par défaut')
      chapters.value = []
    }
    currentStep.value++
  } else if (currentStep.value === 4) {
    // StepChaptersEdit - final step, triggers wizard completion
    console.log('✏️ Formation sauvegardée, fin du wizard')
    handleSaved()
  }
}

function handleBack() {
  if (currentStep.value > 0) currentStep.value--
}

function handleSaved() {
  // Reset wizard
  currentStep.value = 0
  type.value = 'pdf'
  infos.value = {}
  pdfUrl.value = ''
  file.value = null
  coverImage.value = null
  coverImageUrl.value = ''
  quizConfig.value = { chapters: 3, quizzes: 5 }
  iaResult.value = null
  chapters.value = []
}

async function generateIAContent() {
  // Appel backend pour générer le contenu IA
  const formData = new FormData()
  formData.append('ebook', file.value)
  formData.append('quizConfig', JSON.stringify(quizConfig.value))
  formData.append('infos', JSON.stringify(infos.value))
  
  if (coverImage.value) {
    formData.append('coverImage', coverImage.value)
  }
  
  const response = await fetch('http://localhost:3000/api/analyze-ebook', {
    method: 'POST',
    body: formData
  })
  
  if (!response.ok) throw new Error('Erreur backend')
  const data = await response.json()
  if (data.error) throw new Error(data.error)
  return data
}

function convertOldFormatToChapters(oldData) {
  console.log('🔄 Conversion de l\'ancien format:', oldData)
  
  // Diviser les quiz en 3 chapitres
  const quizzes = oldData.quizzes || []
  const quizzesPerChapter = Math.ceil(quizzes.length / 3)
  
  const chapterTitles = [
    "Introduction au sujet",
    "Développement des concepts", 
    "Application pratique"
  ]
  
  const courseTitles = [
    ["Bases fondamentales", "Concepts essentiels"],
    ["Méthodes avancées", "Techniques pratiques"],
    ["Mise en application", "Synthèse finale"]
  ]
  
  const chapters = []
  
  for (let i = 0; i < 3; i++) {
    const startQuiz = i * quizzesPerChapter
    const endQuiz = Math.min(startQuiz + quizzesPerChapter, quizzes.length)
    const chapterQuizzes = quizzes.slice(startQuiz, endQuiz)
    
    // Si pas de quiz pour ce chapitre, en créer un par défaut
    if (chapterQuizzes.length === 0) {
      chapterQuizzes.push({
        id: i + 1,
        title: `Test - Chapitre ${i + 1}`,
        question: "Question par défaut",
        options: {
          A: "Option A",
          B: "Option B", 
          C: "Option C",
          D: "Option D"
        },
        correctAnswer: "A"
      })
    }
    
    // Créer plusieurs cours différents par chapitre
    const courses = courseTitles[i].map((title, courseIndex) => ({
      id: i * 10 + courseIndex + 1,
      title: title,
      duration: ["3:25", "4:25", "5:00"][courseIndex] || "4:00",
      content: `Contenu du cours "${title}" - ${oldData.summary?.substring(0, 100) || "Description du cours"}`
    }))
    
    chapters.push({
      id: i + 1,
      title: chapterTitles[i],
      courses: courses,
      quizzes: chapterQuizzes.map((quiz, index) => ({
        ...quiz,
        id: i + 1,
        title: `Test - Chapitre ${i + 1}`
      }))
    })
  }
  
  console.log('✅ Conversion terminée:', chapters)
  return chapters
}
</script>

<style scoped>
.ajouter-formation-wizard {
  max-width: 1700px;
  margin: 0 auto;
  padding: 2rem 0;
}
</style> 