<template>
  <div class="home-container">
    <!-- Section Hero -->
    <div class="hero">
      <div class="hero-bg">
        <img src="/Rectangle 96.svg" alt="Background" class="hero-image-bg" />

        <!-- Contenu par-dessus l'image -->
        <div class="hero-overlay">
          <div class="hero-content">
            <h1 class="main-title">
              #1 E-learning site dans le monde<br />
              <strong>L'apprentissage<br />Pour Le Futur</strong>
            </h1>
            <div class="hero-buttons">
              <button class="btn-outline">Nous contacter</button>
              <button class="btn-outline">Notre service ↗</button>
            </div>
          </div>

          <!-- Carte application en bas à droite -->
          <div class="app-card">
            <div class="app-thumbnail"></div>
            <p class="app-text">Découvrez Notre<br />Application</p>
            <div class="app-cta">
              →
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="hero-stats">
        <div>
          <h2>200+</h2>
          <p>Formations postées<br />sur notre application</p>
        </div>
        <div>
          <h2>15 min</h2>
          <p>D'apprentissage<br />par jours</p>
        </div>
        <div>
          <h2>Gratuit</h2>
          <p>Essayez avant d'acheter<br />une formation</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 0 2rem;
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero-bg {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
}

.hero-image-bg {
  width: 100%;
  height: auto;
  display: block;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hero-content {
  color: white;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
}

.main-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 1.5rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.btn-outline {
  padding: 0.5rem 1rem;
  border: 1px solid white;
  color: white;
  background: transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}

.btn-outline:hover {
  background: white;
  color: black;
}

.app-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1rem;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: white;
  font-weight: 600;
  align-self: flex-end;
}

.app-thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 0.5rem;
  background: #ccc;
  margin-bottom: 0.75rem;
}

.app-text {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.app-cta {
  background: white;
  color: black;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.hero-stats {
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  text-align: center;
  color: black;
}

.hero-stats h2 {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>