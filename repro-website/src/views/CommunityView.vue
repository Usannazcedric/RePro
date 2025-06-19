<template>
  <div class="community-container">
    <div class="filters">
      <h2>Filtres</h2>
      <div class="filter-group">
        <label>Reconnu par l'État :</label>
        <select v-model="filters.is_state_recognized">
          <option value="">Tous</option>
          <option value="true">Oui</option>
          <option value="false">Non</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Thème :</label>
        <select v-model="filters.theme">
          <option value="">Tous</option>
          <option v-for="theme in themes" :key="theme" :value="theme">{{ theme }}</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Recherche :</label>
        <input v-model="filters.search" type="text" placeholder="Titre ou description..." />
      </div>
      <button class="reset-btn" @click="resetFilters">Réinitialiser</button>
    </div>
    <div class="formations-list">
      <h1 class="title">Toutes les formations</h1>
      <div v-if="loading" class="text-gray-500 mt-8">Chargement...</div>
      <div v-else>
        <div v-if="filteredFormations.length === 0" class="text-center mt-8 text-gray-500">
          Aucune formation ne correspond à vos critères.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div v-for="formation in filteredFormations" :key="formation.id" class="formation-card">
            <h2 class="font-bold text-lg mb-2 text-gray-800">{{ formation.title }}</h2>
            <div class="text-sm text-gray-500 mb-1">Thème : {{ formation.theme }}</div>
            <div class="text-sm text-gray-500 mb-1">Publié le : {{ formatDate(formation.created_at) }}</div>
            <div class="text-gray-600 mb-2">{{ formation.description }}</div>
            <div class="text-xs text-gray-400">Résumé IA : {{ formation.summary }}</div>
            <div class="text-xs text-gray-500 mt-1">Reconnu par l'État : <b>{{ formation.is_state_recognized ? 'Oui' : 'Non' }}</b></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../supabase'

const formations = ref([])
const loading = ref(true)
const filters = ref({
  is_state_recognized: '',
  theme: '',
  search: ''
})
const themes = ref(['Programmation', 'Marketing', 'Design', 'Langues', 'Autre'])

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function resetFilters() {
  filters.value = { is_state_recognized: '', theme: '', search: '' }
}

const filteredFormations = computed(() => {
  return formations.value.filter(f => {
    if (filters.value.is_state_recognized !== '' && String(f.is_state_recognized) !== filters.value.is_state_recognized) return false
    if (filters.value.theme && f.theme !== filters.value.theme) return false
    if (filters.value.search) {
      const s = filters.value.search.toLowerCase()
      if (!f.title?.toLowerCase().includes(s) && !f.description?.toLowerCase().includes(s)) return false
    }
    return true
  })
})

async function fetchFormations() {
  loading.value = true
  const { data, error } = await supabase
    .from('formations')
    .select('*')
    .order('created_at', { ascending: false })
  formations.value = data || []
  loading.value = false
}

onMounted(fetchFormations)
</script>

<style scoped>
.community-container {
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
}
.filters {
  min-width: 260px;
  background: #ffffff;
  border-radius: 14px;
  padding: 2rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border: 1px solid #e5e7eb;
}
.filter-group label {
  font-weight: 500;
  margin-bottom: 0.3rem;
  display: block;
  color: #374151;
}
.filter-group select, .filter-group input {
  width: 100%;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  margin-top: 0.2rem;
  transition: border-color 0.2s;
}
.filter-group select:focus, .filter-group input:focus {
  outline: none;
  border-color: #7376FF;
}
.reset-btn {
  background: #7376FF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;
}
.reset-btn:hover {
  background: #5d60d6;
}
.formations-list {
  flex: 1;
}
.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #111827;
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