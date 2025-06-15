<template>
  <div class="wizard-type-select">
    <h2 class="title">Vous n'avez aucune formation pour le moment.</h2>
    <div class="type-cards">
      <div class="type-card active">
        <h3>PDF <span class="badge">Recommandé</span></h3>
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
        <h3>Vidéo <span class="badge badge-grey">Non recommandé</span></h3>
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
  </div>
</template>

<script setup>
// Pas de logique, tout est géré par le parent via l'event 'next'
</script>

<style scoped>
.wizard-type-select {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
}
.type-cards {
  display: flex;
  gap: 2rem;
}
.type-card {
  background: #23232d;
  border-radius: 18px;
  padding: 2rem 2.5rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  min-width: 320px;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 2px solid #3b3b4d;
}
.type-card.active {
  border-color: #3b82f6;
}
.type-card.disabled {
  opacity: 0.5;
}
.type-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
.badge {
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  font-size: 0.8em;
  padding: 2px 8px;
  margin-left: 8px;
}
.badge-grey {
  background: #444;
}
ul {
  margin: 1rem 0;
  padding-left: 1.2rem;
}
li {
  margin-bottom: 0.3rem;
  color: #60a5fa;
  font-size: 1em;
}
.btn {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;
}
.btn:hover {
  background: #2563eb;
}
.btn-disabled {
  background: #444;
  cursor: not-allowed;
}
</style> 