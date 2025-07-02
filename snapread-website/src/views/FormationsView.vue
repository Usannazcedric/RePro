<template>
  <div class="formations-page page-with-footer">
    <div v-if="!showWizard" class="formations-container">
      <div class="page-header-separated">
        <h1 class="page-title-centered">Mes formations</h1>
        
        <div class="controls-line">
          <div class="search-container">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Rechercher la formation"
              class="search-input"
            />
            <button class="search-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>

          <!-- Paire 1: Récent/Ancien -->
          <div class="filter-pair">
            <button
              :class="['filter-btn', { active: activeFilter === 'recent' }]"
              @click="setActiveFilter('recent')"
            >
              Récent
            </button>
            <button
              :class="['filter-btn', { active: activeFilter === 'ancien' }]"
              @click="setActiveFilter('ancien')"
            >
              Ancien
            </button>
          </div>

          <!-- Paire 2: Textuel/Vidéo -->
          <div class="filter-pair">
            <button
              :class="['filter-btn', { active: activeFilter === 'textuel' }]"
              @click="setActiveFilter('textuel')"
            >
              Textuel
            </button>
            <button
              :class="['filter-btn', { active: activeFilter === 'video' }]"
              @click="setActiveFilter('video')"
            >
              Vidéo
            </button>
          </div>

          <!-- Paire 3: Tous/Publié/Inactif -->
          <div class="filter-pair">
            <button
              :class="['filter-btn', { active: activeFormat === 'all' }]"
              @click="setActiveFormat('all')"
            >
              Tous
            </button>
            <button
              :class="['filter-btn', { active: activeFormat === 'published' }]"
              @click="setActiveFormat('published')"
            >
              Publié
            </button>
            <button
              :class="['filter-btn', { active: activeFilter === 'inactive' }]"
              @click="setActiveFilter('inactive')"
            >
              Inactif
            </button>
          </div>
          
          <button class="add-formation-btn" @click="showWizard = true">
            Ajouter une formation
          </button>
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
              <th class="table-header"></th>
              <th class="table-header">Titre & thème</th>
              <th class="table-header">Format</th>
              <th class="table-header">Achats</th>
              <th class="table-header">Prix</th>
              <th class="table-header">Posté</th>
              <th class="table-header">Avis</th>
              <th class="table-header"></th>
              <th class="table-header">Publié</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="formation in filteredFormations" :key="formation.id" class="table-row">
              <!-- Titre & thème avec image -->
              <td>
                <div class="formation-image">
                  <img
                    v-if="formation.formation_data?.coverImageUrl"
                    :src="formation.formation_data.coverImageUrl"
                    :alt="formation.title"
                    class="cover-thumbnail"
                  />
                  <div v-else class="cover-placeholder">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14 2V8H20"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </td>
              <td class="title-cell">
                <div class="formation-info">
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
                {{ formation.purchase_count || 0 }}
              </td>

              <!-- Prix -->
              <td class="prix-cell">{{ formation.price ? `${formation.price.toFixed(2)}€` : '49.99€' }}</td>

              <!-- Posté -->
              <td class="date-cell">
                {{ formatDate(formation.created_at) }}
              </td>

              <!-- Avis -->
              <td class="avis-cell">
                <div class="rating">
                  <span class="rating-number">{{ formation.review_count || 0 }} :</span>
                  <div class="stars">
                    <span 
                      v-for="star in 5" 
                      :key="star"
                      :class="['star', { 
                        'filled': star <= Math.floor(formation.average_rating || 0),
                        'half': star === Math.ceil(formation.average_rating || 0) && (formation.average_rating || 0) % 1 !== 0
                      }]"
                    >★</span>
                  </div>
                  <span class="rating-score">{{ formatRating(formation.average_rating) }}/5.0</span>
                </div>
              </td>

              <!-- Publié (toggle + actions) -->
              <td class="actions-cell">
                <div class="actions-container">
                  <button
                    @click="editFormation(formation.id)"
                    class="action-btn edit-btn"
                    title="Modifier"
                  >
                    <svg
                      width="43"
                      height="42"
                      viewBox="0 0 43 43"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        y="1"
                        width="42"
                        height="41"
                        rx="11.5"
                        fill="white"
                        fill-opacity="0.8"
                      />
                      <rect x="0.5" y="1" width="42" height="41" rx="11.5" stroke="currentColor" />
                      <path
                        d="M24.0757 15.7425L27.2575 18.9243M14 29V25.2879L25.9774 13.3105C26.1763 13.1117 26.446 13 26.7272 13C27.0084 13 27.2782 13.1117 27.4771 13.3105L29.6895 15.5229C29.8883 15.7218 30 15.9916 30 16.2728C30 16.554 29.8883 16.8237 29.6895 17.0226L17.7121 29H14Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>

                  <button
                    @click="deleteFormation(formation.id)"
                    class="action-btn delete-btn"
                    title="Supprimer"
                  >
                    <svg
                      width="43"
                      height="42"
                      viewBox="0 0 43 43"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.5"
                        y="1"
                        width="42"
                        height="41"
                        rx="11.5"
                        fill="white"
                        fill-opacity="0.8"
                      />
                      <rect x="0.5" y="1" width="42" height="41" rx="11.5" stroke="currentColor" />
                      <path
                        d="M27.5 15V29C27.5 29.5 27 30 26.5 30H21.5H16.5C16 30 15.5 29.5 15.5 29V15"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M13.5 15H29.5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M19.5 14H23.5M19.5 19V26M23.5 19V26"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </td>
              <td>
                <label class="toggle-switch">
                  <input
                    type="checkbox"
                    :checked="formation.is_published"
                    @change="togglePublish(formation.id, $event)"
                  />
                  <span class="toggle-slider"></span>
                </label>
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
            <img
              :src="selectedFormation.formation_data.coverImageUrl"
              :alt="selectedFormation.title"
              class="cover-img-preview"
            />
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

            <div
              v-for="chapter in getChapters(selectedFormation)"
              :key="chapter.id"
              class="chapter-section mb-6"
            >
              <h4 class="font-semibold text-lg mb-3 text-purple-600">
                Chapitre {{ chapter.id }}: {{ chapter.title }}
              </h4>

              <!-- Cours du chapitre -->
              <div v-if="chapter.courses?.length" class="courses-section mb-4">
                <h5 class="font-medium mb-2 text-gray-700">
                  📖 Cours ({{ chapter.courses.length }})
                </h5>
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
                <h5 class="font-medium mb-2 text-gray-700">
                  🎯 Quiz ({{ chapter.quizzes.length }})
                </h5>
                <div v-for="quiz in chapter.quizzes" :key="quiz.id" class="quiz-item mb-3">
                  <div class="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <p class="font-medium text-gray-800 mb-2">{{ quiz.question }}</p>
                    <ul class="ml-4 text-sm text-gray-600">
                      <li
                        v-for="(option, letter) in quiz.options"
                        :key="letter"
                        :class="{ 'text-green-600 font-medium': letter === quiz.correctAnswer }"
                      >
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
              <div
                v-for="(quiz, index) in selectedFormation.quizzes"
                :key="index"
                class="quiz-preview mb-3"
              >
                <p class="font-medium">{{ index + 1 }}. {{ quiz.question }}</p>
                <ul class="ml-4 text-sm text-gray-600">
                  <li
                    v-for="(option, letter) in quiz.options"
                    :key="letter"
                    :class="{ 'text-green-600 font-medium': letter === quiz.correctAnswer }"
                  >
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
  { key: 'ancien', label: 'Ancien' },
  { key: 'video', label: 'Vidéo' },
  { key: 'textuel', label: 'Textuel' },
]

const formatFilters = [
  { key: 'all', label: 'Tous' },
  { key: 'published', label: 'Publié' },
  { key: 'inactive', label: 'Inactif' },
]

const steps = [
  'Lecture du fichier',
  'Analyse du contenu',
  'Génération du résumé',
  'Création des quiz',
  'Finalisation',
]

const LOCAL_STORAGE_KEY = 'aiContentFormation'

// Computed property for filtered formations
const filteredFormations = computed(() => {
  let filtered = formations.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (formation) =>
        formation.title.toLowerCase().includes(query) ||
        formation.theme.toLowerCase().includes(query) ||
        formation.description?.toLowerCase().includes(query),
    )
  }

  // Filter by format
  if (activeFormat.value !== 'all') {
    if (activeFormat.value === 'published') {
      filtered = filtered.filter((formation) => formation.is_published)
    } else if (activeFormat.value === 'inactive') {
      filtered = filtered.filter((formation) => !formation.is_published)
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
  const {
    data: { session },
  } = await supabase.auth.getSession()
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
      body: formData,
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
    const { error } = await supabase.from('formations').insert([
      {
        user_id: user.id,
        title: ebooks.value[0]?.name || 'Formation sans titre',
        summary: aiContent.value.summary,
        quizzes: aiContent.value.quizzes,
        tips: aiContent.value.tips,
        created_at: new Date(),
      },
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
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatRating(rating) {
  if (!rating || rating === 0) return '0.0'
  return rating.toFixed(1)
}

async function fetchFormations() {
  loadingFormations.value = true
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.user) {
    formations.value = []
    loadingFormations.value = false
    return
  }
  
  try {
    // Récupérer les formations
    const { data: formationsData, error: formationsError } = await supabase
      .from('formations')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
    
    if (formationsError) throw formationsError
    
    if (!formationsData || formationsData.length === 0) {
      formations.value = []
      loadingFormations.value = false
      return
    }
    
    // Pour chaque formation, compter les achats et récupérer les notes
    const formationsWithData = await Promise.all(
      formationsData.map(async (formation) => {
        // Compter les achats
        const { count: purchaseCount, error: countError } = await supabase
          .from('purchased_formations')
          .select('*', { count: 'exact', head: true })
          .eq('formation_id', formation.id)
          .eq('status', 'active')
        
        // Récupérer les statistiques des avis
        const { data: reviewStats, error: reviewError } = await supabase
          .from('reviews')
          .select('rating')
          .eq('formation_id', formation.id)
        
        let averageRating = 0
        let reviewCount = 0
        
        if (!reviewError && reviewStats && reviewStats.length > 0) {
          reviewCount = reviewStats.length
          const totalRating = reviewStats.reduce((sum, review) => sum + review.rating, 0)
          averageRating = totalRating / reviewCount
        }
        
        return {
          ...formation,
          purchase_count: countError ? 0 : (purchaseCount || 0),
          review_count: reviewCount,
          average_rating: averageRating
        }
      })
    )
    
    formations.value = formationsWithData
    
  } catch (error) {
    console.error('Erreur lors du chargement des formations:', error)
    formations.value = []
  }
  
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
  if (
    !confirm('Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.')
  ) {
    return
  }

  try {
    const { error } = await supabase.from('formations').delete().eq('id', formationId)

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
    const formation = formations.value.find((f) => f.id === formationId)
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
  background: #e9e9ee;
  min-height: 100vh;
  padding: 2rem;
}

.formations-container {
  max-width: 1600px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(115, 118, 255, 0.15);
}

/* Header */
.page-header-separated {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
}

.page-title-centered {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  white-space: nowrap;
  flex-shrink: 0;
}

.controls-line {
  display: flex;
  align-items: center;
  gap: 4.8rem;
  flex-wrap: nowrap;
  flex: 1;
  justify-content: center;
}

.search-container {
  position: relative;
  width: 280px;
  flex-shrink: 0;
}

.add-formation-btn {
  background: #7376ff;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-left: 0;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.add-formation-btn:hover {
  background: #5d60d6;
  transform: translateY(-1px);
}

/* Filters Section */
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
  border-color: #7376ff;
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

.filter-pair {
  display: flex;
  gap: 0; /* remove gap for segmented buttons */
}

.filter-pair .filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0;
  border-radius: 0; /* reset radius */
}

.filter-pair .filter-btn:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.filter-pair .filter-btn:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.filter-pair .filter-btn:not(:last-child) {
  border-right: none; /* collapse adjacent borders */
}

/* Special case for 3-button groups - middle button has no radius */
.filter-pair .filter-btn:not(:first-child):not(:last-child) {
  border-radius: 0;
}

.filter-pair .filter-btn:hover {
  border-color: #7376ff;
  color: #7376ff;
}

.filter-pair .filter-btn.active {
  background: #7376ff;
  color: white;
  border-color: #7376ff;
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
  border-top-color: #7376ff;
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
  border-radius: 0.75rem;
  border: none;
  background: white;
}

.formations-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header {
  background: transparent;
  padding: 0.375rem 0rem;
  text-align: center;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb;
}

.table-header:first-child {
  text-align: center;
  /* padding-left: 1.5rem; */
}

.table-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
}

.table-row:not(:last-child) td {
  padding-bottom: 30px;
}

.table-row:not(:first-child) td {
  padding-top: 30px;
}

.table-row:first-child td:first-child {
  padding-top: 30px;
}

.table-row:hover {
  background: #fafafa;
}

.table-row td {
  padding: 0rem 1.625rem;
  vertical-align: middle;
  text-align: center;
  border: none;
}

.table-row td:first-child {
  text-align: center;
  padding-left: 1.5rem;
  padding-right: 10px;
  vertical-align: top;
}

.table-row td:nth-child(2) {
  padding-left: 0px;
}

.title-cell {
  width: 150px;
}

.formation-info {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 0;
  padding: 0;
}

.formation-image {
  width: 133px;
  height: 77px;
}

.cover-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 8px;
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
  /* background: #f3f4f6; */
  color: #374151;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Other Cells */
.achats-cell,
.prix-cell,
.date-cell {
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
}

.avis-cell {
  min-width: 200px;
}

.rating {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
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
  font-size: 0.875rem;
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
  font-weight: 500;
}

/* Actions Cell */
.actions-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
}

.action-btn {
  background: none;
  border: none;
  padding: 0;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
}

.edit-btn {
  color: #7376ff;
  width: 33px;
  height: 32px;
  /* margin-right: 0.625rem; */
}

.edit-btn:hover {
  background: rgba(115, 118, 255, 0.1);
}

.delete-btn {
  color: #7376ff;
  width: 33px;
  height: 32px;
  /* margin-right: 0.625rem; */
}

.delete-btn:hover {
  background: rgba(115, 118, 255, 0.1);
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 3rem;
  height: 1.5rem;
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
  border-radius: 1.5rem;
}

.toggle-slider:before {
  position: absolute;
  content: '';
  height: 1.125rem;
  width: 1.125rem;
  left: 0.1875rem;
  bottom: 0.1875rem;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

input:checked + .toggle-slider {
  background-color: #7376ff;
}

input:checked + .toggle-slider:before {
  transform: translateX(1.5rem);
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
  background: #7376ff;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quiz-item .bg-yellow-50:hover {
  background: #fef3c7;
}

/* Responsive */
@media (max-width: 1400px) {
  .formations-container {
    max-width: 100%;
  }
  
  .search-container {
    width: 240px;
  }
  
  .controls-line {
    gap: 0.75rem;
  }
  
  .filter-pair .filter-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .add-formation-btn {
    padding: 0.75rem 1.25rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 1200px) {
  .page-header-separated {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }
  
  .controls-line {
    justify-content: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .search-container {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 768px) {
  .formations-page {
    padding: 1rem;
  }

  .formations-container {
    padding: 1rem;
  }

  .page-header-separated {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .controls-line {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .filter-pair {
    justify-content: center;
  }

  .search-container {
    width: 100%;
    max-width: none;
  }

  .formations-table-container {
    overflow-x: scroll;
  }

  .formations-table {
    min-width: 800px;
  }
}

@media (max-width: 480px) {
  .filter-pair {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .filter-pair .filter-btn {
    flex: 1;
    min-width: 70px;
    text-align: center;
  }
}
</style>
