<template>
  <div class="wizard-wrapper">
    <div class="wizard-step-type">
      <div class="header">
        <h1 class="main-title">Il est temps de publier votre formation !</h1>
        <p class="subtitle">Choisissez le format qui vous convient le mieux</p>
      </div>

      <div class="type-cards">
        <div class="type-card active">
          <h3>PDF</h3>
          <span class="badge">Recommandé</span>
          <p>Envoyez votre formation directement en format PDF, notre IA se charge du reste !</p>
          <ul>
            <li>Analyse automatique du PDF</li>
            <li>Création de micro-cours</li>
            <li>Quiz interactifs générés</li>
            <li>Résumés intelligents intégrés</li>
          </ul>
          <button class="btn" @click="$emit('next', 'pdf')">Ajouter une formation</button>
        </div>
        <div class="type-card disabled">
          <h3>Vidéo</h3>
          <span class="badge badge-grey">Non recommandé</span>
          <p>Envoyez votre formation directement en format vidéo, notre IA génère vos quiz !</p>
          <ul>
            <li>Analyse intelligente de la vidéo</li>
            <li>Découpage en micro-cours</li>
            <li>Quiz interactifs générés</li>
            <li>Résumés intelligents intégrés</li>
          </ul>
          <button class="btn btn-disabled" disabled>Ajouter une formation</button>
        </div>
      </div>

      <div class="progress-bar">
        <span class="step active"></span>
        <span class="step"></span>
        <span class="step"></span>
        <span class="step"></span>
        <span class="step"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.wizard-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0 1.5rem 1.5rem 1.5rem;
}

.wizard-step-type {
  width: 100%;
  max-width: 1000px;
  min-height: 600px;
  background: #ffffff;
  border-radius: 24px;
  padding: 4rem;
  box-shadow: 0 8px 32px rgba(115, 118, 255, 0.12);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border: none;
  margin-top: -2rem;
}

.header {
  text-align: center;
  margin-bottom: 1rem;
}

.main-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.1rem;
  color: #718096;
  margin: 0;
  font-weight: 400;
}

.type-cards {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.type-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 2rem 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  min-width: 320px;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
}

.type-card.active {
  border-color: #6366f1;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15);
}

.type-card.disabled {
  background: #f8fafc;
  border-color: #e2e8f0;
  opacity: 1;
}

.type-card.disabled h3,
.type-card.disabled p,
.type-card.disabled li {
  color: #94a3b8 !important;
}

.type-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.badge {
  background: #6366f1;
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 12px;
  margin-bottom: 1rem;
  display: inline-block;
}

.badge-grey {
  background: #94a3b8;
}

.type-card p {
  color: #4a5568;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  font-size: 0.95rem;
}

ul {
  margin: 0 0 2rem 0;
  padding-left: 0;
  list-style: none;
}

li {
  margin-bottom: 0.8rem;
  color: #4a5568;
  font-size: 0.9rem;
  position: relative;
  padding-left: 1.5rem;
}

li::before {
  content: "●";
  color: #6366f1;
  position: absolute;
  left: 0;
  top: 0;
}

.type-card.disabled li::before {
  color: #cbd5e0;
}

.btn {
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: auto;
  transition: all 0.2s ease;
  width: 100%;
  text-align: center;
}

.btn:hover {
  background: #4f46e5;
}

.btn-disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  color: #94a3b8;
}

.btn-disabled:hover {
  background: #cbd5e0;
}

.progress-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.step {
  width: 60px;
  height: 8px;
  background: #cbd5e1;
  border-radius: 4px;
}

.step.active {
  background: #6366f1;
}

@media (max-width: 900px) {
  .type-cards {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .wizard-wrapper {
    padding: 1rem;
  }
  .wizard-step-type {
    padding: 2rem;
  }
  .type-card {
    min-width: 280px;
    max-width: 100%;
  }
}
</style> 