<script setup lang="ts">
import { ref, computed } from 'vue'
import Footer from '../components/Footer.vue'

const expandedQuestions = ref<Set<number>>(new Set())
const activeCategory = ref(0)

const toggleQuestion = (index: number) => {
  if (expandedQuestions.value.has(index)) {
    expandedQuestions.value.delete(index)
  } else {
    expandedQuestions.value.add(index)
  }
}

const selectCategory = (index: number) => {
  activeCategory.value = index
  expandedQuestions.value.clear()
}

const categories = [
  { name: 'Notre IA' },
  { name: 'Les Formations' },
  { name: 'Pour les Formateurs' },
  { name: 'Pour les Utilisateurs' },
  { name: 'Le Fonctionnement du Site' }
]

const questionsByCategory: Record<number, Array<{question: string, answer: string}>> = {
  0: [ 
    {
      question: 'Que fait l\'IA ?',
      answer: 'Notre IA analyse votre contenu pédagogique et génère automatiquement des quiz, des résumés et des éléments interactifs pour améliorer l\'expérience d\'apprentissage.'
    },
    {
      question: 'Puis-je corriger l\'IA ?',
      answer: 'Oui, vous pouvez modifier et corriger toutes les suggestions de l\'IA. Vous avez un contrôle total sur le contenu généré avant de le publier.'
    },
    {
      question: 'Les quiz sont-ils automatiques ?',
      answer: 'L\'IA génère automatiquement des quiz basés sur votre contenu, mais vous pouvez les personnaliser, ajouter ou supprimer des questions selon vos besoins.'
    },
    {
      question: 'Mon style est-il conservé ?',
      answer: 'L\'IA s\'adapte à votre style d\'écriture et de présentation en analysant vos contenus existants pour maintenir une cohérence.'
    },
    {
      question: 'L\'IA marche sur tous les sujets ?',
      answer: 'Notre IA est entraînée sur une large base de connaissances et peut traiter la plupart des sujets éducatifs, des sciences aux humanités.'
    }
  ],
  1: [
    {
      question: 'Comment créer une nouvelle formation ?',
      answer: 'Cliquez sur "Créer une formation" dans votre tableau de bord, uploadez votre contenu et laissez notre IA vous guider dans la création.'
    },
    {
      question: 'Puis-je modifier une formation existante ?',
      answer: 'Oui, vous pouvez modifier vos formations à tout moment. Accédez à la section "Mes formations" et cliquez sur "Modifier".'
    },
    {
      question: 'Combien de formations puis-je créer ?',
      answer: 'Le nombre de formations dépend de votre plan d\'abonnement. Consultez notre page de tarification pour plus de détails.'
    },
    {
      question: 'Comment organiser mes formations ?',
      answer: 'Utilisez les tags, catégories et dossiers pour organiser vos formations. Vous pouvez également créer des parcours d\'apprentissage.'
    },
    {
      question: 'Puis-je dupliquer une formation ?',
      answer: 'Oui, vous pouvez dupliquer une formation existante pour créer rapidement des variations ou des mises à jour.'
    }
  ],
  2: [
    {
      question: 'Comment devenir formateur sur la plateforme ?',
      answer: 'Inscrivez-vous avec un compte formateur, complétez votre profil et soumettez votre première formation pour validation.'
    },
    {
      question: 'Quels sont les outils disponibles ?',
      answer: 'Vous avez accès à un éditeur de contenu, des outils d\'évaluation, des analytics, et notre IA pour créer du contenu interactif.'
    },
    {
      question: 'Comment suivre les progrès des apprenants ?',
      answer: 'Le tableau de bord formateur vous donne accès aux statistiques détaillées de progression, temps passé et résultats des quiz.'
    },
    {
      question: 'Puis-je personnaliser mes cours ?',
      answer: 'Absolument ! Vous pouvez personnaliser l\'apparence, l\'ordre du contenu, les évaluations et l\'expérience utilisateur.'
    },
    {
      question: 'Comment gérer les évaluations ?',
      answer: 'Créez des quiz, examens et devoirs. L\'IA peut générer des questions automatiquement ou vous pouvez les créer manuellement.'
    }
  ],
  3: [
    {
      question: 'Comment s\'inscrire à une formation ?',
      answer: 'Parcourez le catalogue, cliquez sur la formation qui vous intéresse et suivez le processus d\'inscription.'
    },
    {
      question: 'Puis-je suivre plusieurs formations ?',
      answer: 'Oui, vous pouvez vous inscrire à autant de formations que vous le souhaitez et les suivre à votre rythme.'
    },
    {
      question: 'Comment accéder à mes cours ?',
      answer: 'Connectez-vous à votre compte et accédez à la section "Mes formations" pour voir tous vos cours en cours.'
    },
    {
      question: 'Y a-t-il des prérequis ?',
      answer: 'Les prérequis sont indiqués dans la description de chaque formation. Certaines formations sont ouvertes à tous.'
    },
    {
      question: 'Comment obtenir un certificat ?',
      answer: 'Complétez tous les modules et réussissez les évaluations finales pour recevoir votre certificat de completion.'
    }
  ],
  4: [
    {
      question: 'Comment naviguer sur le site ?',
      answer: 'Utilisez le menu principal pour accéder aux différentes sections. Un tutoriel d\'introduction est disponible pour les nouveaux utilisateurs.'
    },
    {
      question: 'Où trouver mes formations ?',
      answer: 'Vos formations sont accessibles dans la section "Mes formations" de votre profil utilisateur.'
    },
    {
      question: 'Comment contacter le support ?',
      answer: 'Utilisez le chat en direct, envoyez un email à support@drixe.com ou consultez notre centre d\'aide.'
    },
    {
      question: 'Puis-je modifier mon profil ?',
      answer: 'Oui, accédez aux paramètres de votre compte pour modifier vos informations personnelles, mot de passe et préférences.'
    },
    {
      question: 'Comment réinitialiser mon mot de passe ?',
      answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion et suivez les instructions envoyées par email.'
    }
  ]
}

const questions = computed(() => questionsByCategory[activeCategory.value] || [])
</script>

<template>
  <div class="faq-container">
    <div class="faq-content">
      <h1 class="faq-title">Trouvez la réponse à vos questions</h1>
      
      <div class="faq-layout">
        <div class="categories-section">
          <div 
            v-for="(category, index) in categories" 
            :key="index"
            class="category-item"
            :class="{ active: activeCategory === index }"
            @click="selectCategory(index)"
          >
            <span>{{ category.name }}</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6-6 6-1.41-1.41z"/>
            </svg>
          </div>
        </div>

        <div class="questions-section">
          <div 
            v-for="(item, index) in questions" 
            :key="index"
            class="question-item"
            @click="toggleQuestion(index)"
          >
            <div class="question-header">
              <span class="question-text">{{ item.question }}</span>
              <button class="expand-btn" :class="{ expanded: expandedQuestions.has(index) }">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </button>
            </div>
            <div class="question-answer" :class="{ expanded: expandedQuestions.has(index) }">
              <div class="answer-content">
                <p>{{ item.answer }}</p>
              </div>
            </div>
            <div class="question-divider"></div>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<style scoped>
.faq-container {
  min-height: 100vh;
  background: #E9E9EE;
  padding: 2rem 2rem 0 2rem;
  display: flex;
  flex-direction: column;
}

.faq-content {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  flex: 1;
}

.faq-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  text-align: center;
  margin-bottom: 3rem;
}

.faq-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.categories-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  background: #f7fafc;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #4a5568;
}

.category-item:hover {
  background: #edf2f7;
  transform: translateY(-2px);
}

.category-item.active {
  background: #7376FF;
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.arrow-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.category-item.active .arrow-icon {
  color: white;
}

.questions-section {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.question-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.question-item:hover {
  background: #f7fafc;
  border-radius: 8px;
  margin: 0 -1rem;
  padding: 0 1rem;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
}

.question-text {
  font-size: 1.125rem;
  font-weight: 500;
  color: #2d3748;
}

.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: #f7fafc;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4a5568;
}

.expand-btn:hover {
  background: #edf2f7;
  transform: scale(1.1);
}

.expand-btn svg {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.expand-btn.expanded svg {
  transform: rotate(45deg);
}

.question-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out, padding 0.3s ease-out;
  padding: 0;
}

.question-answer.expanded {
  max-height: 200px;
  padding: 0 0 1.5rem 0;
}

.answer-content p {
  color: #718096;
  line-height: 1.6;
  margin: 0;
  font-size: 1rem;
  padding-top: 0.5rem;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    padding: 0;
  }
  to {
    opacity: 1;
    max-height: 200px;
    padding: 0 0 1.5rem 0;
  }
}

.question-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0;
}

.question-item:last-child .question-divider {
  display: none;
}

@media (max-width: 768px) {
  .faq-content {
    padding: 2rem;
  }
  
  .faq-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
  
  .faq-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .category-item {
    padding: 1rem 1.25rem;
  }
  
  .question-header {
    padding: 1.25rem 0;
  }
  
  .question-text {
    font-size: 1rem;
  }
}
</style>