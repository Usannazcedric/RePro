<template>
  <div class="formations-page page-with-footer">
    <div v-if="!showWizard" class="formations-container">

      <div class="page-header">
        <h1 class="page-title">Mes formations</h1>
        <button class="add-formation-btn" @click="showWizard = true">
          Ajouter une formation
        </button>
      </div>


      <div class="filters-section">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Rechercher la formation"
            class="search-input"
          />
          <button class="search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="filters-right">
          <div class="filter-buttons">
            <button 
              v-for="filter in filters" 
              :key="filter.key"
              :class="['filter-btn', { active: activeFilter === filter.key }]"
              @click="setActiveFilter(filter.key)"
            >
              {{ filter.label }}
            </button>
          </div>

          <div class="format-filters">
            <button 
              v-for="format in formatFilters" 
              :key="format.key"
              :class="['format-btn', { active: activeFormat === format.key }]"
              @click="setActiveFormat(format.key)"
            >
              {{ format.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingFormations" class="loading-state">
        <div class="loader"></div>
        Chargement...
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredFormations.length === 0 && !searchQuery" class="empty-state">
        <p class="empty-message">Vous n'avez pas de formations.</p>
        <button class="add-formation-btn" @click="showWizard = true">
          Publier votre première formation
        </button>
      </div>

      <!-- No Results State -->
      <div v-else-if="filteredFormations.length === 0 && searchQuery" class="empty-state">
        <p class="empty-message">Aucune formation trouvée pour "{{ searchQuery }}"</p>
      </div>

      <!-- Formations Table -->
      <div v-else class="formations-table-container">
        <table class="formations-table">
          <thead>
            <tr>
              <th class="table-header">Titre & thème</th>
              <th class="table-header">Format</th>
              <th class="table-header">Achats</th>
              <th class="table-header">Prix</th>
              <th class="table-header">Posté</th>
              <th class="table-header">Avis</th>
              <th class="table-header">Publié</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="formation in filteredFormations" :key="formation.id" class="table-row">
              <!-- Titre & thème avec image -->
              <td class="title-cell">
                <div class="formation-info">
                  <div class="formation-image">
                    <img 
                      v-if="formation.formation_data?.coverImageUrl" 
                      :src="formation.formation_data.coverImageUrl" 
                      :alt="formation.title"
                      class="cover-thumbnail"
                    />
                    <div v-else class="cover-placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <div class="formation-details">
                    <h3 class="formation-title">{{ formation.title }}</h3>
                    <p class="formation-theme">{{ formation.theme }}</p>
                  </div>
                </div>
              </td>

              <!-- Format -->
              <td class="format-cell">
                <span class="format-badge">Textuel</span>
              </td>

              <!-- Achats -->
              <td class="achats-cell">
                {{ getChapterCount(formation) }}
              </td>

              <!-- Prix -->
              <td class="prix-cell">
                49.99€
              </td>

              <!-- Posté -->
              <td class="date-cell">
                {{ formatDate(formation.created_at) }}
              </td>

              <!-- Avis -->
              <td class="avis-cell">
                <div class="rating">
                  <span class="rating-number">8 :</span>
                  <div class="stars">
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                    <span class="star filled">★</span>
                    <span class="star half">★</span>
                  </div>
                  <span class="rating-score">4.5/5.0</span>
                </div>
              </td>

              <!-- Publié (toggle + actions) -->
              <td class="actions-cell">
                <div class="actions-container">
                  <button @click="editFormation(formation.id)" class="action-btn edit-btn" title="Modifier">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18.5 2.49998C18.8978 2.10216 19.4374 1.87866 20 1.87866C20.5626 1.87866 21.1022 2.10216 21.5 2.49998C21.8978 2.89781 22.1213 3.43737 22.1213 3.99998C22.1213 4.56259 21.8978 5.10216 21.5 5.49998L12 15L8 16L9 12L18.5 2.49998Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                  
                  <button @click="deleteFormation(formation.id)" class="action-btn delete-btn" title="Supprimer">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>

                  <label class="toggle-switch">
                    <input type="checkbox" :checked="formation.is_published" @change="togglePublish(formation.id, $event)">
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Wizard -->
    <div v-else>
      <AjouterFormationWizard @close="showWizard = false" />
    </div>
    
    <!-- Footer seulement quand le wizard n'est pas affiché -->
    <Footer v-if="!showWizard" />
    
    <!-- Modal d'aperçu (conservé pour compatibilité) -->
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
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase'
import AjouterFormationWizard from './AjouterFormationWizard.vue'
import Footer from '../components/Footer.vue'

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
const searchQuery = ref('')
const activeFilter = ref('recent')
const activeFormat = ref('all')

const filters = [
  { key: 'recent', label: 'Récent' },
  { key: 'video', label: 'Vidéo' },
  { key: 'textuel', label: 'Textuel' }
]

const formatFilters = [
  { key: 'all', label: 'Tous' },
  { key: 'published', label: 'Publiée' },
  { key: 'inactive', label: 'Inactive' }
]

const steps = [
  'Lecture du fichier',
  'Analyse du contenu',
  'Génération du résumé',
  'Création des quiz',
  'Finalisation'
]

const LOCAL_STORAGE_KEY = 'aiContentFormation';

// Computed property for filtered formations
const filteredFormations = computed(() => {
  let filtered = formations.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(formation => 
      formation.title.toLowerCase().includes(query) ||
      formation.theme.toLowerCase().includes(query) ||
      formation.description?.toLowerCase().includes(query)
    )
  }

  // Filter by format
  if (activeFormat.value !== 'all') {
    if (activeFormat.value === 'published') {
      filtered = filtered.filter(formation => formation.is_published)
    } else if (activeFormat.value === 'inactive') {
      filtered = filtered.filter(formation => !formation.is_published)
    }
  }

  return filtered
})

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

function setActiveFilter(filter) {
  activeFilter.value = filter
}

function setActiveFormat(format) {
  activeFormat.value = format
}

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
  return new Date(dateStr).toLocaleDateString('fr-FR', { 
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric' 
  })
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

async function togglePublish(formationId, event) {
  const isPublished = event.target.checked
  
  try {
    const { error } = await supabase
      .from('formations')
      .update({ is_published: isPublished })
      .eq('id', formationId)
    
    if (error) throw error
    
    // Update local state
    const formation = formations.value.find(f => f.id === formationId)
    if (formation) {
      formation.is_published = isPublished
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    // Revert the toggle
    event.target.checked = !isPublished
    alert('Erreur lors de la mise à jour: ' + error.message)
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
.formations-page {
  background: #E9E9EE;
  min-height: 100vh;
  padding: 2rem;
}

.formations-container {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(115, 118, 255, 0.15);
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.add-formation-btn {
  background: #7376FF;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-formation-btn:hover {
  background: #5d60d6;
  transform: translateY(-1px);
}

/* Filters Section */
.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-container {
  position: relative;
  width: 350px;
  min-width: 300px;
  flex-shrink: 0;
}

.filters-right {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  padding: 12px 48px 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #7376FF;
  box-shadow: 0 0 0 3px rgba(115, 118, 255, 0.1);
}

.search-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: #7376FF;
  color: #7376FF;
}

.filter-btn.active {
  background: #7376FF;
  color: white;
  border-color: #7376FF;
}

.format-filters {
  display: flex;
  gap: 0.5rem;
}

.format-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.format-btn:hover {
  border-color: #7376FF;
  color: #7376FF;
}

.format-btn.active {
  background: #7376FF;
  color: white;
  border-color: #7376FF;
}

/* Loading and Empty States */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #6b7280;
  font-size: 1rem;
}

.loader {
  border: 2px solid #e5e7eb;
  border-top-color: #7376FF;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 0.8s linear infinite;
  margin-right: 0.75rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 3rem;
}

.empty-message {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

/* Table Styles */
.formations-table-container {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.formations-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.table-header {
  background: #f9fafb;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb;
}

.table-row {
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background: #f9fafb;
}

.table-row td {
  padding: 1rem;
  vertical-align: middle;
}

/* Title Cell */
.title-cell {
  min-width: 300px;
}

.formation-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.formation-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  color: #9ca3af;
}

.formation-details {
  flex: 1;
}

.formation-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.formation-theme {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Format Cell */
.format-badge {
  background: #f3f4f6;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Other Cells */
.achats-cell, .prix-cell, .date-cell {
  font-size: 0.875rem;
  color: #374151;
}

.avis-cell {
  min-width: 200px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.rating-number {
  color: #374151;
  font-weight: 600;
}

.stars {
  display: flex;
  gap: 0.125rem;
}

.star {
  color: #d1d5db;
  font-size: 1rem;
}

.star.filled {
  color: #f59e0b;
}

.star.half {
  color: #f59e0b;
}

.rating-score {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Actions Cell */
.actions-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn {
  color: #7376FF;
}

.edit-btn:hover {
  background: #f0f0ff;
}

.delete-btn {
  color: #ef4444;
}

.delete-btn:hover {
  background: #fef2f2;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #7376FF;
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

/* Modal styles (conservés) */
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

/* Responsive */
@media (max-width: 768px) {
  .formations-page {
    padding: 1rem;
  }
  
  .formations-container {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .filters-right {
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-container {
    min-width: auto;
  }
  
  .formations-table-container {
    overflow-x: scroll;
  }
  
  .formations-table {
    min-width: 800px;
  }
}
</style>
  