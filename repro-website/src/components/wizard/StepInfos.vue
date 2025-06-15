<template>
  <div class="wizard-step-infos">
    <button class="back-btn" @click="$emit('back')">&larr; Retour</button>
    <h2 class="title">Titre de la formation</h2>
    <input v-model="localInfos.title" placeholder="La base de python..." class="input" />
    <h2 class="title">Thème de la formation</h2>
    <select v-model="localInfos.theme" class="input">
      <option value="">Choisir un thème</option>
      <option value="Programmation">Programmation</option>
      <option value="Marketing">Marketing</option>
      <option value="Design">Design</option>
      <option value="Langues">Langues</option>
      <option value="Autre">Autre</option>
    </select>
    <h2 class="title">Description de la formation</h2>
    <textarea v-model="localInfos.description" class="input textarea" placeholder="Décrivez votre formation..." />
    <div class="row">
      <span>La formation est-elle reconnue par l'État ?</span>
      <button :class="{active: localInfos.is_state_recognized === true}" @click="localInfos.is_state_recognized = true">Oui</button>
      <button :class="{active: localInfos.is_state_recognized === false}" @click="localInfos.is_state_recognized = false">Non</button>
    </div>
    <div class="row">
      <input type="checkbox" v-model="localInfos.is_creator_certified" id="certif" />
      <label for="certif">Je certifie être le créateur de cette formation.</label>
    </div>
    <button class="next-btn" @click="nextStep">Passer à l'étape suivante</button>
  </div>
</template>

<script setup>
import { reactive, watch, toRefs } from 'vue'
const props = defineProps({
  infos: Object
})
const emit = defineEmits(['next', 'back'])

const localInfos = reactive({
  title: props.infos?.title || '',
  theme: props.infos?.theme || '',
  description: props.infos?.description || '',
  is_state_recognized: props.infos?.is_state_recognized ?? null,
  is_creator_certified: props.infos?.is_creator_certified ?? false
})

function nextStep() {
  emit('next', { ...localInfos })
}
</script>

<style scoped>
.wizard-step-infos {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: stretch;
}
.title {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.2rem;
}
.input {
  background: #23232d;
  border: 1.5px solid #3b3b4d;
  border-radius: 12px;
  padding: 0.8rem 1rem;
  color: #fff;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
.textarea {
  min-height: 80px;
  resize: vertical;
}
.row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}
.row button {
  background: #23232d;
  border: 1.5px solid #3b3b4d;
  color: #fff;
  border-radius: 8px;
  padding: 0.3rem 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
}
.row button.active {
  background: #3b82f6;
  border-color: #3b82f6;
}
.next-btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1.5rem;
  align-self: flex-end;
}
.back-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  align-self: flex-start;
}
</style> 