<template>
    <div class="p-4">
      <div v-if="!showWizard">
        <h1 class="text-2xl font-bold mb-4">Mes formations</h1>
        <button class="add-btn" @click="showWizard = true">Ajouter une formation</button>
        <div v-if="loadingFormations" class="mt-8 text-gray-500">Chargement...</div>
        <div v-else>
          <div v-if="formations.length === 0" class="mt-8 text-center">
            <p class="text-lg mb-4 text-gray-600">Vous n'avez pas de formations.</p>
            <button class="add-btn" @click="showWizard = true">Publier votre première formation</button>
          </div>
          <div v-else class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="formation in formations" :key="formation.id" class="formation-card">
              <!-- Image de couverture -->
              <div v-if="formation.formation_data?.coverImageUrl" class="cover-image mb-3">
                <img :src="formation.formation_data.coverImageUrl" :alt="formation.title" class="cover-img-small" />
              </div>
              
              <h2 class="font-bold text-lg mb-2 text-gray-800">{{ formation.title }}</h2>
              <div class="text-sm text-gray-500 mb-1">Thème : {{ formation.theme }}</div>
              <div class="text-sm text-gray-500 mb-1">Publié le : {{ formatDate(formation.created_at) }}</div>
              <div class="text-gray-600 mb-2">{{ formation.description }}</div>
              <div class="text-xs text-gray-400 mb-3">{{ getFormationPreview(formation) }}</div>
              
              <!-- Statistiques -->
              <div class="stats mb-3 flex gap-4 text-sm text-gray-500">
                <span>📚 {{ getChapterCount(formation) }} chapitre{{ getChapterCount(formation) > 1 ? 's' : '' }}</span>
                <span>📝 {{ getQuizCount(formation) }} quiz</span>
                <span v-if="formation.formation_data?.infos?.is_state_recognized" class="text-green-600">✅ Certifié</span>
              </div>
              
              <!-- Actions -->
              <div class="actions flex gap-2">
                <button @click="editFormation(formation.id)" class="edit-btn">
                  ✏️ Modifier
                </button>
                <button @click="deleteFormation(formation.id)" class="delete-btn">
                  🗑️ Supprimer
                </button>
                <button @click="viewFormation(formation)" class="view-btn">
                  👁️ Aperçu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <AjouterFormationWizard @close="showWizard = false" />
      </div>
      
      <!-- Modal d'aperçu -->
      <div v-if="showPreview" class="modal-overlay" @click="closePreview">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>{{ selectedFormation?.title }}</h2>
            <button @click="closePreview" class="close-btn">×</button>
          </div>
          
          <div class="modal-body">
            <div v-if="selectedFormation?.formation_data?.coverImageUrl" class="cover-preview mb-4">
              <img :src="selectedFormation.formation_data.coverImageUrl" :alt="selectedFormation.title" class="cover-img-preview" />
            </div>
            
            <div class="formation-info mb-4">
              <p><strong>Thème:</strong> {{ selectedFormation?.theme }}</p>
              <p><strong>Description:</strong> {{ selectedFormation?.description }}</p>
              <p><strong>Chapitres:</strong> {{ getChapterCount(selectedFormation) }}</p>
              <p><strong>Quiz total:</strong> {{ getQuizCount(selectedFormation) }}</p>
            </div>
            
            <!-- Nouveau format avec chapitres -->
            <div v-if="hasChapters(selectedFormation)" class="chapters-content">
              <h3 class="font-bold mb-4 text-lg">📚 Contenu de la formation</h3>
              
              <div v-for="chapter in getChapters(selectedFormation)" :key="chapter.id" class="chapter-section mb-6">
                <h4 class="font-semibold text-lg mb-3 text-purple-600">
                  Chapitre {{ chapter.id }}: {{ chapter.title }}
                </h4>
                
                <!-- Cours du chapitre -->
                <div v-if="chapter.courses?.length" class="courses-section mb-4">
                  <h5 class="font-medium mb-2 text-gray-700">📖 Cours ({{ chapter.courses.length }})</h5>
                  <div v-for="course in chapter.courses" :key="course.id" class="course-item mb-2">
                    <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <span class="course-number">{{ course.id }}</span>
                      <div class="flex-1">
                        <p class="font-medium text-gray-800">{{ course.title }}</p>
                        <p class="text-sm text-gray-500 mb-1">Durée: {{ course.duration }}</p>
                        <p class="text-sm text-gray-600">{{ course.content }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Quiz du chapitre -->
                <div v-if="chapter.quizzes?.length" class="quizzes-section mb-4">
                  <h5 class="font-medium mb-2 text-gray-700">🎯 Quiz ({{ chapter.quizzes.length }})</h5>
                  <div v-for="quiz in chapter.quizzes" :key="quiz.id" class="quiz-item mb-3">
                    <div class="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <p class="font-medium text-gray-800 mb-2">{{ quiz.question }}</p>
                      <ul class="ml-4 text-sm text-gray-600">
                        <li v-for="(option, letter) in quiz.options" :key="letter" 
                            :class="{ 'text-green-600 font-medium': letter === quiz.correctAnswer }">
                          {{ letter }}. {{ option }}
                          <span v-if="letter === quiz.correctAnswer"> ✅</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Ancien format de fallback -->
            <div v-else>
              <div v-if="selectedFormation?.summary" class="summary mb-4">
                <h3 class="font-bold mb-2">📄 Résumé</h3>
                <p class="text-gray-700">{{ selectedFormation.summary }}</p>
              </div>
              
              <div v-if="selectedFormation?.quizzes?.length" class="quizzes mb-4">
                <h3 class="font-bold mb-2">🎯 Quiz ({{ selectedFormation.quizzes.length }})</h3>
                <div v-for="(quiz, index) in selectedFormation.quizzes" :key="index" class="quiz-preview mb-3">
                  <p class="font-medium">{{ index + 1 }}. {{ quiz.question }}</p>
                  <ul class="ml-4 text-sm text-gray-600">
                    <li v-for="(option, letter) in quiz.options" :key="letter" 
                        :class="{ 'text-green-600 font-medium': letter === quiz.correctAnswer }">
                      {{ letter }}. {{ option }}
                      <span v-if="letter === quiz.correctAnswer"> ✅</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div v-if="selectedFormation?.tips" class="tips">
                <h3 class="font-bold mb-2">💡 Conseils</h3>
                <p class="text-gray-700">{{ selectedFormation.tips }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { supabase } from '../supabase'
  import AjouterFormationWizard from './AjouterFormationWizard.vue'
  
  const router = useRouter()
  
  const ebooks = ref([])
  const aiContent = ref(null)
  const loading = ref(false)
  const saving = ref(false)
  const currentStep = ref(0)
  const showAnswers = ref(false)
  const showWizard = ref(false)
  const formations = ref([])
  const loadingFormations = ref(true)
  const selectedFormation = ref(null)
  const showPreview = ref(false)
  
  const steps = [
    'Lecture du fichier',
    'Analyse du contenu',
    'Génération du résumé',
    'Création des quiz',
    'Finalisation'
  ]
  
  const LOCAL_STORAGE_KEY = 'aiContentFormation';
  
  onMounted(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      try {
        aiContent.value = JSON.parse(saved)
      } catch (e) {
        aiContent.value = null
      }
    }
  })
  
  function handleDrop(event) {
    const files = event.dataTransfer.files
    if (files.length > 0 && files[0].type === 'application/pdf') {
      ebooks.value.push(files[0])
    }
  }
  
  function handleFileChange(event) {
    const file = event.target.files[0]
    if (file && file.type === 'application/pdf') {
      ebooks.value.push(file)
    }
  }
  
  async function getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user
  }
  
  async function generateContent(file) {
    const user = await getCurrentUser()
    if (!user) {
      alert('Veuillez vous connecter pour téléverser une formation')
      return
    }
  
    const formData = new FormData()
    formData.append('ebook', file)
    formData.append('userId', user.id)
  
    try {
      aiContent.value = null
      loading.value = true
      currentStep.value = 1
  
      for (let i = 1; i <= steps.length; i++) {
        await wait(500)
        currentStep.value = i
      }
  
      console.log('📤 Envoi du fichier au serveur...')
  
      const response = await fetch('http://localhost:3000/api/analyze-ebook', {
        method: 'POST',
        body: formData
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Erreur serveur')
      }
  
      const data = await response.json()
      console.log('📥 Données reçues du backend:', data)
  
      loading.value = false
      if (data.error) {
        throw new Error(data.error)
      }
  
      if (data.summary && data.quizzes && data.tips) {
        console.log('✅ Données valides reçues')
        aiContent.value = data
        showAnswers.value = false
        // Sauvegarde dans le localStorage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
      } else {
        console.error('❌ Format de données incorrect:', data)
        throw new Error('Les données reçues ne sont pas dans le format attendu')
      }
  
    } catch (error) {
      console.error('❌ Erreur:', error)
      loading.value = false
      alert(`Erreur lors de la génération du contenu: ${error.message}`)
    }
  }
  
  async function saveContent() {
    const user = await getCurrentUser()
    if (!user || !aiContent.value) return
  
    try {
      saving.value = true
      const { error } = await supabase
        .from('formations')
        .insert([
          {
            user_id: user.id,
            title: ebooks.value[0]?.name || 'Formation sans titre',
            summary: aiContent.value.summary,
            quizzes: aiContent.value.quizzes,
            tips: aiContent.value.tips,
            created_at: new Date()
          }
        ])
  
      if (error) throw error
  
      alert('Formation sauvegardée avec succès !')

      localStorage.removeItem(LOCAL_STORAGE_KEY)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.')
    } finally {
      saving.value = false
    }
  }
  
  function selectAnswer(quizIndex, letter) {
    if (!showAnswers.value) {
      const isCorrect = aiContent.value.quizzes[quizIndex].correctAnswer === letter
      alert(isCorrect ? 'Bonne réponse ! 🎉' : 'Essayez encore !')
    }
  }
  
  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  function formatDate(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  
  async function fetchFormations() {
    loadingFormations.value = true
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      formations.value = []
      loadingFormations.value = false
      return
    }
    const { data, error } = await supabase
      .from('formations')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
    formations.value = data || []
    loadingFormations.value = false
  }
  
  onMounted(fetchFormations)
  
  // Refresh la liste après ajout
  watch(showWizard, (val) => {
    if (!val) fetchFormations()
  })
  
  function editFormation(formationId) {
    router.push(`/formations/edit/${formationId}`)
  }
  
  async function deleteFormation(formationId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.')) {
      return
    }
    
    try {
      const { error } = await supabase
        .from('formations')
        .delete()
        .eq('id', formationId)
      
      if (error) throw error
      
      alert('Formation supprimée avec succès !')
      fetchFormations()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression: ' + error.message)
    }
  }
  
  function viewFormation(formation) {
    selectedFormation.value = formation
    showPreview.value = true
  }
  
  function closePreview() {
    showPreview.value = false
    selectedFormation.value = null
  }
  
  // Fonctions pour gérer le nouveau format avec chapitres
  function hasChapters(formation) {
    const chapters = getChapters(formation)
    return chapters && chapters.length > 0
  }
  
  function getChapters(formation) {
    // Nouveau format: chapitres dans formation_data
    if (formation?.formation_data?.chapters && formation.formation_data.chapters.length > 0) {
      return formation.formation_data.chapters
    }
    
    // Fallback: colonnes directes (si elles existent)
    if (formation?.chapters && formation.chapters.length > 0) {
      return formation.chapters
    }
    
    return []
  }
  
  function getChapterCount(formation) {
    const chapters = getChapters(formation)
    return chapters.length || 1
  }
  
  function getQuizCount(formation) {
    const chapters = getChapters(formation)
    if (chapters.length > 0) {
      // Compter tous les quiz dans tous les chapitres
      return chapters.reduce((total, chapter) => {
        return total + (chapter.quizzes?.length || 0)
      }, 0)
    }
    
    // Fallback ancien format
    return formation?.quizzes?.length || 0
  }
  
  function getFormationPreview(formation) {
    const chapters = getChapters(formation)
    if (chapters.length > 0 && chapters[0].courses?.length > 0) {
      // Utiliser le premier cours du premier chapitre
      return `${chapters[0].courses[0].content?.substring(0, 100) || 'Contenu non disponible'}...`
    }
    
    // Fallback ancien format
    if (formation?.summary) {
      return `${formation.summary.substring(0, 100)}...`
    }
    
    return 'Aperçu non disponible'
  }
  </script>
  
  <style scoped>
  .loader {
    border: 2px solid #ccc;
    border-top-color: #7376FF;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    display: inline-block;
    animation: spin 0.8s linear infinite;
    margin-right: 5px;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  .add-btn {
    background: #7376FF;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    cursor: pointer;
    margin-bottom: 2rem;
    transition: background 0.2s;
  }
  
  .add-btn:hover {
    background: #5d60d6;
  }
  
  .formation-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    margin-bottom: 1rem;
    border: 1px solid #e5e7eb;
    transition: box-shadow 0.2s;
  }
  
  .formation-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  }
  
  .actions {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .edit-btn, .delete-btn, .view-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;
  }
  
  .edit-btn {
    background: #7376FF;
    color: white;
  }
  
  .edit-btn:hover {
    background: #5d60d6;
  }
  
  .delete-btn {
    background: #ef4444;
    color: white;
  }
  
  .delete-btn:hover {
    background: #dc2626;
  }
  
  .view-btn {
    background: #6b7280;
    color: white;
  }
  
  .view-btn:hover {
    background: #4b5563;
  }
  
  /* Modal styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    border-radius: 12px;
    max-width: 800px;
    max-height: 90vh;
    width: 90%;
    overflow: hidden;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
  }
  
  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #6b7280;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .close-btn:hover {
    background: #e5e7eb;
  }
  
  .modal-body {
    padding: 1.5rem;
    max-height: 70vh;
    overflow-y: auto;
  }
  
  .quiz-preview {
    background: #f9fafb;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #3b82f6;
  }
  
  /* Styles pour les images de couverture */
  .cover-img-small {
    max-width: 120px;
    max-height: 80px;
    width: auto;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  
  .cover-img-preview {
    max-width: 200px;
    max-height: 120px;
    width: auto;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  
  /* Styles pour le nouveau format avec chapitres */
  .chapter-section {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1.5rem;
    background: #fafafa;
  }
  
  .course-number {
    background: #7376FF;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  .course-item .flex {
    transition: all 0.2s ease;
  }
  
  .course-item .flex:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  
  .quiz-item .bg-yellow-50:hover {
    background: #fef3c7;
  }
  </style>
  