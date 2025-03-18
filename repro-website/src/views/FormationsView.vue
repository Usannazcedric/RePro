<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Téléversez votre formation (ebook)</h1>
    
    <div 
      class="border-2 border-dashed border-gray-400 p-8 text-center rounded-lg"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <p class="text-gray-600">Glissez-déposez votre ebook ici</p>
      <input type="file" @change="handleFileChange" class="mt-4" />
    </div>

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

    <div v-if="aiContent" class="mt-6">
      <h2 class="text-xl font-semibold mb-2">Contenu généré par l'IA</h2>
      <div v-html="aiContent" class="bg-gray-100 p-4 rounded"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const ebooks = ref([])
const aiContent = ref(null)

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

// Simule l'appel à une IA (à remplacer par un vrai backend plus tard)
async function sendToAI(file) {
  const formData = new FormData()
  formData.append('ebook', file)

  // Appel API vers backend qui utilise une IA genre GPT pour créer du contenu
  const response = await fetch('/api/analyze-ebook', {
    method: 'POST',
    body: formData
  })

  const data = await response.json()
  aiContent.value = data.generatedContent // HTML ou markdown rendu
}
</script>

<style scoped>
/* Un peu de style pour rendre tout ça clean */
</style>
