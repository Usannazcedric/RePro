<template>
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Téléversez votre formation (ebook)</h1>
  
      <!-- Zone de drop -->
      <div
        class="border-2 border-dashed border-gray-400 p-8 text-center rounded-lg"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <p class="text-gray-600">Glissez-déposez votre ebook ici</p>
        <input type="file" @change="handleFileChange" class="mt-4" accept=".pdf" />
      </div>
  
      <!-- Liste des fichiers -->
      <div v-if="ebooks.length" class="mt-6">
        <h2 class="text-xl font-semibold mb-2">Ebooks téléversés</h2>
        <ul>
          <li v-for="(ebook, index) in ebooks" :key="index" class="mb-2">
            {{ ebook.name }}
            <button
              @click="generateContent(ebook)"
              class="ml-4 bg-blue-500 text-white px-2 py-1 rounded"
            >
              Générer contenu IA
            </button>
          </li>
        </ul>
      </div>
  
      <!-- Loader étapes -->
      <div v-if="loading" class="mt-6 bg-white border rounded-lg p-4 shadow">
        <h2 class="text-xl font-semibold mb-4">📚 Génération en cours...</h2>
        <ul class="space-y-2">
          <li v-for="(step, index) in steps" :key="index" class="flex items-center mb-2">
            <span v-if="index < currentStep - 1">✅</span>
            <span v-else-if="index === currentStep - 1" class="loader"></span>
            <span v-else>⬜</span>
            <span class="ml-2">{{ step }}</span>
          </li>
        </ul>
      </div>
  
      <!-- Résultat -->
      <div v-if="aiContent && !loading" class="mt-6 space-y-6">
        <!-- Bouton de sauvegarde -->
        <div class="flex justify-end mb-4">
          <button
            @click="saveContent"
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
            :disabled="saving"
          >
            <span v-if="!saving">💾 Sauvegarder cette formation</span>
            <span v-else class="flex items-center">
              <span class="loader mr-2"></span>
              Sauvegarde en cours...
            </span>
          </button>
        </div>
  
        <!-- Résumé -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">📝 Résumé</h2>
          <p class="text-gray-700">{{ aiContent.summary }}</p>
        </div>
  
        <!-- Quiz -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">🎯 Quiz</h2>
          <div v-for="(quiz, index) in aiContent.quizzes" :key="index" class="mb-6">
            <p class="font-medium mb-3">{{ quiz.question }}</p>
            <div class="space-y-2">
              <div v-for="(option, letter) in quiz.options" :key="letter" 
                   class="p-2 rounded cursor-pointer"
                   :class="{'bg-green-100': showAnswers && letter === quiz.correctAnswer,
                           'hover:bg-gray-100': !showAnswers}"
                   @click="selectAnswer(index, letter)">
                {{ letter }}) {{ option }}
              </div>
            </div>
          </div>
          <button @click="showAnswers = !showAnswers" 
                  class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            {{ showAnswers ? 'Masquer les réponses' : 'Voir les réponses' }}
          </button>
        </div>
  
        <!-- Astuces -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4">💡 Astuce clé</h2>
          <p class="text-gray-700">{{ aiContent.tips }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { supabase } from '../supabase'
  
  const ebooks = ref([])
  const aiContent = ref(null)
  const loading = ref(false)
  const saving = ref(false)
  const currentStep = ref(0)
  const showAnswers = ref(false)
  
  const steps = [
    'Lecture du fichier',
    'Analyse du contenu',
    'Génération du résumé',
    'Création des quiz',
    'Finalisation'
  ]
  
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
  </script>
  
  <style scoped>
  .loader {
    border: 2px solid #ccc;
    border-top-color: #3498db;
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
  </style>
  