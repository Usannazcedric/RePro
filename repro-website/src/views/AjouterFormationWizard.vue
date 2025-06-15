<template>
  <div class="ajouter-formation-wizard">
    <component
      :is="steps[currentStep].component"
      v-bind="steps[currentStep].props()"
      @next="handleNext"
      @back="handleBack"
      @saved="handleSaved"
    />
    <div class="wizard-progress">
      <span v-for="(step, i) in steps" :key="i" :class="{active: i === currentStep}"></span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StepTypeSelect from '../components/wizard/StepTypeSelect.vue'
import StepInfos from '../components/wizard/StepInfos.vue'
import StepUpload from '../components/wizard/StepUpload.vue'
import StepQuizSelect from '../components/wizard/StepQuizSelect.vue'
import StepLoading from '../components/wizard/StepLoading.vue'
import StepResult from '../components/wizard/StepResult.vue'

const currentStep = ref(0)
const type = ref('pdf')
const infos = ref({})
const pdfUrl = ref('')
const file = ref(null)
const quizConfig = ref({ chapters: 1, quizzes: 5 })
const iaResult = ref(null)

const steps = [
  {
    component: StepTypeSelect,
    props: () => ({})
  },
  {
    component: StepInfos,
    props: () => ({ infos: infos.value })
  },
  {
    component: StepUpload,
    props: () => ({})
  },
  {
    component: StepQuizSelect,
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
    component: StepResult,
    props: () => ({
      infos: infos.value,
      pdfUrl: pdfUrl.value,
      result: iaResult.value
    })
  }
]

function handleNext(payload) {
  if (currentStep.value === 0) {
    type.value = payload
    currentStep.value++
  } else if (currentStep.value === 1) {
    infos.value = payload
    currentStep.value++
  } else if (currentStep.value === 2) {
    file.value = payload.file
    pdfUrl.value = payload.pdfUrl
    currentStep.value++
  } else if (currentStep.value === 3) {
    quizConfig.value = payload
    currentStep.value++
  } else if (currentStep.value === 4) {
    // IA loading step, handled by StepLoading
    // next is called with IA result
    iaResult.value = payload
    currentStep.value++
  }
}
function handleBack() {
  if (currentStep.value > 0) currentStep.value--
}
function handleSaved() {
  // Optionnel : reset wizard ou rediriger
  currentStep.value = 0
  type.value = 'pdf'
  infos.value = {}
  pdfUrl.value = ''
  file.value = null
  quizConfig.value = { chapters: 1, quizzes: 5 }
  iaResult.value = null
}

async function generateIAContent() {
  // Appel backend pour générer le contenu IA
  const formData = new FormData()
  formData.append('ebook', file.value)
  // On peut ajouter d'autres infos si besoin
  const response = await fetch('http://localhost:3000/api/analyze-ebook', {
    method: 'POST',
    body: formData
  })
  if (!response.ok) throw new Error('Erreur backend')
  const data = await response.json()
  if (data.error) throw new Error(data.error)
  return data
}
</script>

<style scoped>
.ajouter-formation-wizard {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 0;
}
.wizard-progress {
  display: flex;
  justify-content: center;
  gap: 0.7rem;
  margin-top: 2.5rem;
}
.wizard-progress span {
  display: block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #444;
  transition: background 0.2s;
}
.wizard-progress span.active {
  background: #3b82f6;
}
</style> 