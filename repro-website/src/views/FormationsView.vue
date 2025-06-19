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
              <h2 class="font-bold text-lg mb-2 text-gray-800">{{ formation.title }}</h2>
              <div class="text-sm text-gray-500 mb-1">Thème : {{ formation.theme }}</div>
              <div class="text-sm text-gray-500 mb-1">Publié le : {{ formatDate(formation.created_at) }}</div>
              <div class="text-gray-600 mb-2">{{ formation.description }}</div>
              <div class="text-xs text-gray-400">Résumé IA : {{ formation.summary }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <AjouterFormationWizard @close="showWizard = false" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { supabase } from '../supabase'
  import AjouterFormationWizard from './AjouterFormationWizard.vue'
  
  const ebooks = ref([])
  const aiContent = ref(null)
  const loading = ref(false)
  const saving = ref(false)
  const currentStep = ref(0)
  const showAnswers = ref(false)
  const showWizard = ref(false)
  const formations = ref([])
  const loadingFormations = ref(true)
  
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
  </style>
  