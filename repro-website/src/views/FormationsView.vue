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
        <input type="file" @change="handleFileChange" class="mt-4" />
      </div>
  
      <!-- Liste des fichiers -->
      <div v-if="ebooks.length" class="mt-6">
        <h2 class="text-xl font-semibold mb-2">Ebooks téléversés</h2>
        <ul>
          <li v-for="(ebook, index) in ebooks" :key="index" class="mb-2">
            {{ ebook.name }}
            <button
              @click="sendToAI(ebook)"
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
<div v-if="aiContent && !loading" class="mt-6">
  <h2 class="text-xl font-semibold mb-2">Contenu généré par l'IA</h2>
  <div class="bg-gray-100 p-4 rounded whitespace-pre-line">
    {{ aiContent }}
  </div>
</div>

    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const ebooks = ref([])
  const aiContent = ref(null)
  const loading = ref(false)
  const currentStep = ref(0)
  
  const steps = [
    'Lecture du fichier',
    'Génération du résumé',
  ]
  
  function handleDrop(event) {
    const files = event.dataTransfer.files
    if (files.length > 0) {
      ebooks.value.push(files[0])
    }
  }
  
  function handleFileChange(event) {
    const file = event.target.files[0]
    if (file) {
      ebooks.value.push(file)
    }
  }
  
  async function sendToAI(file) {
    const formData = new FormData()
    formData.append('ebook', file)
  
    try {
      aiContent.value = null
      loading.value = true
      currentStep.value = 1
  
      // Étape 1
      await wait(500)
      currentStep.value = 2
  
      // Appel API
      const response = await fetch('http://localhost:3000/api/analyze-ebook', {
        method: 'POST',
        body: formData
      })
  
      await wait(500)
      currentStep.value = 3
  
      const data = await response.json()
  
      await wait(500)
      currentStep.value = 4
  
      await wait(500)
      loading.value = false
      aiContent.value = data.generatedContent
  
    } catch (error) {
      console.error('Erreur front:', error)
      loading.value = false
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
  