<script setup lang="ts">
</script>

<template>
  <div class="home-container">
    <!-- Section principale -->
    <div class="hero">
      <!-- Texte -->
      <div class="hero-text">
        <h1>
          Repro,<br />
          l’IA qui réinvente<br />
          <span class="highlight">la formation</span>
        </h1>
        <p class="subtitle">
          Rejoignez-nous pour partager, améliorer et augmenter<br />
          la visibilité de vos formations
        </p>
        <div class="buttons">
          <button class="btn-outline">See prices</button>
          <button class="btn-filled">Lancez-vous</button>
        </div>
      </div>

      <!-- Image -->
      <div class="hero-image">
        <img src="/Screenshot 2025-05-07 at 04.20.10.png" alt="Illustration" />
      </div>
    </div>

    <!-- Section basique avec icônes -->
    <div class="features">
      <div class="feature-item">Apprentissage ludique</div>
      <div class="feature-item">IA intégrée</div>
      <div class="feature-item">Création simplifiée</div>
    </div>
  </div>
</template>

<style scoped>
.home-container {

  height: 100vh;
  overflow: hidden;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}




.hero {
  display: flex;
  flex-direction: column;
  padding: 2.5rem;
}

@media (min-width: 768px) {
  .hero {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.hero-text {
  width: 100%;
}

@media (min-width: 768px) {
  .hero-text {
    width: 50%;
  }
}

.hero-text h1 {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1.3;
}

@media (min-width: 768px) {
  .hero-text h1 {
    font-size: 3rem;
  }
}

.highlight {
  color: #60a5fa; /* Bleu clair */
  font-style: italic;
}

.subtitle {
  margin-top: 1.5rem;
  color: #d1d5db;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-outline {
  padding: 0.5rem 1.5rem;
  border: 1px solid white;
  background: transparent;
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: white;
  color: black;
}

.btn-filled {
  padding: 0.5rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-filled:hover {
  background: #2563eb;
}

.hero-image {
  width: 100%;
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

@media (min-width: 768px) {
  .hero-image {
    width: 50%;
    margin-top: 0;
  }
}

.hero-image img {
  max-width: 100%;
  max-height: 400px;
}

.features {
  border-top: 1px solid #4b5563;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  text-align: center;
  font-size: 0.9rem;
}

@media (min-width: 768px) {
  .features {
    grid-template-columns: repeat(3, 1fr);
    font-size: 1rem;
  }
}

.feature-item {
  margin-top: 1rem;
}

@media (min-width: 768px) {
  .feature-item {
    margin-top: 0;
  }
}
</style>


<style>
/* 🔧 Global : masque la scrollbar mais garde le scroll */
::-webkit-scrollbar {
  display: none;
}

body {
  -ms-overflow-style: none;  /* IE/Edge */
  scrollbar-width: none;     /* Firefox */
}
</style>
