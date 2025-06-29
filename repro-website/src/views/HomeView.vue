<template>
  <div class="home-container">
    <div class="hero-section">
      <div class="hero-left">
        <h1 class="hero-title">
          SnapRead,<br />
          l'IA qui réinvente<br />
          <span class="hero-subtitle">la formation</span>
        </h1>
        <p class="hero-description">
          Rejoignez nous pour partager, améliorer et augmenter<br />
          la visibilité de vos formations
        </p>
        <div class="hero-buttons">
          <button class="btn-secondary">Abonnement</button>
          <router-link to="/register" class="btn-primary">Lancez-vous</router-link>
        </div>
      </div>
      
      <div class="hero-right">
        <img src="/homepage1.svg" alt="Illustration SnapRead" class="hero-illustration" />
      </div>
    </div>
    
    </div>
    
    <div class="features-section">
      <div class="feature">
        <img src="/apprentissage.svg" alt="Apprentissage ludique" class="feature-icon" />
        <h3 class="feature-title">Apprentissage ludique</h3>
      </div>
      <div class="feature">
        <img src="/ia.svg" alt="IA intégrée" class="feature-icon" />
        <h3 class="feature-title">IA intégrée</h3>
      </div>
      <div class="feature">
        <img src="/apprentissage.svg" alt="Création simplifiée" class="feature-icon" />
        <h3 class="feature-title">Création simplifiée</h3>
      </div>
    </div>
    
    <div class="enhanced-section">
      <div class="enhanced-content">
        <h2 class="enhanced-title">
          SnapRead, l'e-learning<br />
          <span class="enhanced-subtitle">réinventé</span>
        </h2>
        
        <div class="enhanced-features">
          <div class="enhanced-feature">
            <img src="/la1.svg" alt="Formation simplifiée" class="enhanced-icon" />
            <p class="enhanced-text">
              SnapRead simplifie la formation avec<br />
              une approche ludique et interactive.
            </p>
          </div>
          <div class="enhanced-feature">
            <img src="/la2.svg" alt="IA intégrée" class="enhanced-icon" />
            <p class="enhanced-text">
              Grâce à l'IA, l'apprentissage devient<br />
              plus intuitif et accessible.
            </p>
          </div>
          <div class="enhanced-feature">
            <img src="/la3.svg" alt="Partage de savoir" class="enhanced-icon" />
            <p class="enhanced-text">
              Que ce soit pour se former ou partager<br />
              son savoir, SnapRead est la solution idéale.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="ai-section">
      <div class="ai-content">
        <h2 class="ai-title">
          Une IA à la pointe<br />
          de la technologie
        </h2>
        
        <div class="ai-cards">
          <div class="ai-card">
            <h3 class="card-title">
              l'IA (nom de l'ia),<br />
              <span class="card-subtitle">l'avenir du e-learning</span>
            </h3>
            <p class="card-text">
              Lorem ipsum dolor sit amet consectetur.<br />
              Cursus odio magna turpis et diam elit.<br />
              Pellentesque morbi vitae commodo dis.
            </p>
            <img src="/computer.svg" alt="Computer" class="card-icon" />
            <div class="card-bottom">
              <button class="card-btn">En savoir plus</button>
            </div>
          </div>
          
          <div class="ai-card">
            <h3 class="card-title">
              SnapRead, c'est<br />
              <span class="card-subtitle">simple et intuitif</span>
            </h3>
            <p class="card-text">
              Lorem ipsum dolor sit amet consectetur.<br />
              Cursus odio magna turpis et diam elit.<br />
              Pellentesque morbi vitae commodo dis.
            </p>
            <img src="/petit bonhome.svg" alt="Personnage" class="card-icon" />
            <div class="card-bottom">
              <button class="card-btn">En savoir plus</button>
            </div>
          </div>
          
          <div class="ai-card ai-card-large">
            <h3 class="card-title">
              Nos <span class="card-subtitle">petits plus</span><br />
              par rapport aux concurrents
            </h3>
            <p class="card-text">
              Lorem ipsum dolor sit amet consectetur.
              Cursus odio magna turpis et diam elit.
              Pellentesque morbi vitae commodo dis.
            </p>
            <img src="/main.svg" alt="Main" class="card-icon" />
            <div class="card-bottom">
              <button class="card-btn">En savoir plus</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Section des abonnements -->
    <div class="pricing-section">
      <div class="pricing-content">
        <h2 class="pricing-title">Nos abonnements</h2>
        
        <div class="pricing-cards">
          <div class="pricing-card">
            <h3 class="plan-name">Gratuit</h3>
            <div class="plan-price">
              <span class="price">0.00</span>
              <span class="currency">€/mois</span>
            </div>
            <p class="plan-description">
              Pour essayer sans engagement :<br />
              Postez 1 formation et découvrez la<br />
              plateforme pendant 1 mois.
            </p>
                         <div class="plan-features">
               <div class="feature-item feature-included">
                 <span class="feature-icon check-icon">✓</span>
                 <span class="feature-text">1 Formation</span>
               </div>
               <div class="feature-item feature-excluded">
                 <span class="feature-icon cross-icon">✗</span>
                 <span class="feature-text">Communauté</span>
               </div>
               <div class="feature-item feature-excluded">
                 <span class="feature-icon cross-icon">✗</span>
                 <span class="feature-text">Visibilité</span>
               </div>
             </div>
            <button class="plan-btn">Lancez-vous</button>
          </div>
          
          <div class="pricing-card">
            <h3 class="plan-name">Basic</h3>
            <div class="plan-price">
              <span class="price">15.99</span>
              <span class="currency">€/mois</span>
            </div>
            <p class="plan-description">
              Formule idéale pour débuter : Accédez
              à l'essentiel avec 2 formations pour
              vous lancer, à votre rythme.
            </p>
                         <div class="plan-features">
               <div class="feature-item feature-included">
                 <span class="feature-icon check-icon">✓</span>
                 <span class="feature-text">2 Formations</span>
               </div>
               <div class="feature-item feature-excluded">
                 <span class="feature-icon cross-icon">✗</span>
                 <span class="feature-text">Communauté</span>
               </div>
               <div class="feature-item feature-excluded">
                 <span class="feature-icon cross-icon">✗</span>
                 <span class="feature-text">Visibilité</span>
               </div>
             </div>
            <button class="plan-btn">Lancez-vous</button>
          </div>
          
          <div class="pricing-card">
            <h3 class="plan-name">Gold</h3>
            <div class="plan-price">
              <span class="price">29.99</span>
              <span class="currency">€/mois</span>
            </div>
            <p class="plan-description">
              Parfait pour monter en compétence :<br />
              Profitez de 5 formations enrichies et<br />
              créez une communauté d'entraide.
            </p>
                         <div class="plan-features">
               <div class="feature-item feature-included">
                 <span class="feature-icon check-icon">✓</span>
                 <span class="feature-text">5 Formations</span>
               </div>
               <div class="feature-item feature-included">
                 <span class="feature-icon check-icon">✓</span>
                 <span class="feature-text">Communauté</span>
               </div>
               <div class="feature-item feature-excluded">
                 <span class="feature-icon cross-icon">✗</span>
                 <span class="feature-text">Visibilité</span>
               </div>
             </div>
            <button class="plan-btn">Lancez-vous</button>
          </div>
          
          <div class="pricing-card">
            <h3 class="plan-name">Platinum</h3>
            <div class="plan-price">
              <span class="price">49.99</span>
              <span class="currency">€/mois</span>
            </div>
            <p class="plan-description">
              L'offre complète pour les ambitieux :<br />
              10 formations, accès à votre<br />
              communauté et plus de visibilité.
            </p>
            <div class="plan-features">
              <div class="feature-item feature-included">
                <span class="feature-icon check-icon">✓</span>
                <span class="feature-text">10 Formations</span>
              </div>
              <div class="feature-item feature-included">
                <span class="feature-icon check-icon">✓</span>
                <span class="feature-text">Communauté</span>
              </div>
              <div class="feature-item feature-included">
                <span class="feature-icon check-icon">✓</span>
                <span class="feature-text">Visibilité</span>
              </div>
            </div>
            <button class="plan-btn">Lancez-vous</button>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
}

.hero-section {
  display: flex;
  align-items: center;
  gap: 4rem;
  min-height: 60vh;
  margin-top: -1rem;
}

.hero-left {
  flex: 1;
  max-width: 600px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 300;
  line-height: 1.1;
  margin-bottom: 2rem;
  color: #222;
  font-family: 'Nunito', sans-serif;
}

.hero-subtitle {
  color: #7376FF;
  font-style: italic;
  font-weight: 300;
}

.hero-description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  font-family: 'Nunito', sans-serif;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.btn-secondary {
  padding: 0.8rem 2rem;
  border: 2px solid #222;
  background: transparent;
  color: #222;
  border-radius: 17px;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Nunito', sans-serif;
}

.btn-secondary:hover {
  background: #222;
  color: white;
}

.btn-primary {
  padding: 0.8rem 2rem;
  border: none;
  background: #7376FF;
  color: white;
  border-radius: 17px;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Nunito', sans-serif;
  text-decoration: none;
  display: inline-block;
}

.btn-primary:hover {
  background: #5d60d6;
  transform: translateY(-1px);
}

.hero-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-illustration {
  max-width: 100%;
  height: auto;
  max-height: 500px;
}

.features-section {
  background: #7376FF;
  width: 96.83vw;
  margin-left: calc(-50vw + 50%);
  margin-top: 8rem;
  padding: 1.5rem;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  max-width: 96.83vw;
}

.feature {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  max-width: 300px;
}

.feature-icon {
  width: 28px;
  height: 28px;
  filter: brightness(0) invert(1);
}

.feature-title {
  font-size: 1.1rem;
  font-weight: 400;
  margin: 0;
  font-family: 'Nunito', sans-serif;
}

.enhanced-section {
  background: #E9E9EE;
  background-image: url('/homepage2 good.png');
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-top: 0;
  padding: 4rem 0;
  position: relative;
  min-height: 600px;
  overflow: hidden;
}

.enhanced-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: left;
  color: white;
  padding: 0 2rem;
}

.enhanced-title {
  font-size: 2.5rem;
  font-weight: 400;
  margin-bottom: 3rem;
  margin-top: 4rem;
  margin-left: 7rem;
  color: #222;
  font-family: 'Nunito', sans-serif;
}

.enhanced-subtitle {
  font-style: italic;
  color: white;
}

.enhanced-features {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.enhanced-feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex: 1;
  max-width: 280px;
}

.enhanced-icon {
  width: 210px;
  height: 210px;
  margin-bottom: 1.5rem;
  filter: brightness(0) invert(1);
}

.enhanced-text {
  font-size: 0.95rem;
  line-height: 1.5;
  color: white;
  margin: 0;
  font-family: 'Nunito', sans-serif;
  font-weight: 300;
}

.ai-section {
  background: #E9E9EE;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding: 6rem 0;
}

.ai-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.ai-title {
  font-size: 2.5rem;
  font-weight: 400;
  text-align: left;
  margin-bottom: 4rem;
  margin-left: 6rem;
  color: #222;
  font-family: 'Nunito', sans-serif;
  line-height: 1.2;
}

.ai-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.ai-card {
  background: linear-gradient(135deg, #7376FF 0%, #9B9EFF 100%);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 300px;
}

.ai-card-large {
  grid-column: 1 / -1;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  min-height: 350px;
  padding-right: 200px;
}

.ai-card-large .card-title,
.ai-card-large .card-text {
  max-width: 60%;
}

.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.3;
  font-family: 'Nunito', sans-serif;
  color: white;
}

.card-subtitle {
  font-style: italic;
  font-weight: 400;
  color: white;
}

.card-text {
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1.5rem;
  font-family: 'Nunito', sans-serif;
  font-weight: 300;
  color: white;
}

.card-icon {
  width: 200px;
  height: 200px;
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  filter: brightness(0) invert(1);
  opacity: 0.8;
}

.ai-card-large .card-icon {
  position: absolute;
  width: 400px;
  height: 400px;
  bottom: 0.5rem;
  right: 0.5rem;
}

.card-bottom {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: auto;
  position: relative;
  z-index: 2;
}

.card-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.6rem 1.5rem;
  border-radius: 25px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Nunito', sans-serif;
  font-weight: 400;
}

.card-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.pricing-section {
  background: #E9E9EE;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-top: 2rem;
  padding: 4rem 0;
  overflow-x: hidden;
}

.pricing-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
}

.pricing-title {
  font-size: 2.5rem;
  font-weight: 400;
  text-align: center;
  margin-bottom: 3rem;
  color: #222;
  font-family: 'Nunito', sans-serif;
}

.pricing-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2.5rem;
  max-width: 100%;
}

.pricing-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(115, 118, 255, 0.15);
  display: flex;
  flex-direction: column;
  min-height: 480px;
}

.plan-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #222;
  font-family: 'Nunito', sans-serif;
}

.plan-price {
  margin-bottom: 1.5rem;
}

.price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #7376FF;
  font-family: 'Nunito', sans-serif;
}

.currency {
  font-size: 1rem;
  color: #7376FF;
  font-weight: 400;
  font-family: 'Nunito', sans-serif;
}

.plan-description {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #666;
  margin-bottom: 2rem;
  font-family: 'Nunito', sans-serif;
  flex-grow: 1;
}

.plan-features {
  margin-bottom: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
  font-family: 'Nunito', sans-serif;
}

.pricing-card .feature-icon {
  width: 18px;
  height: 18px;
  margin-right: 0.8rem;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  border-radius: 50%;
  text-align: center;
  line-height: 1;
}

.check-icon {
  background-color: #7376FF;
  color: white;
}

.cross-icon {
  background-color: #ff4757;
  color: white;
}

.feature-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.feature-included .feature-text {
  color: #222;
}

.feature-excluded .feature-text {
  color: #999;
}

.plan-btn {
  background: #7376FF;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Nunito', sans-serif;
  margin-top: auto;
}

.plan-btn:hover {
  background: #5d60d6;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .features-section {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .enhanced-features {
    flex-direction: column;
    gap: 2rem;
  }
  
  .enhanced-title {
    font-size: 2rem;
  }
  
  .ai-cards {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    gap: 1.5rem;
  }
  
  .ai-card-large {
    grid-column: 1;
    grid-row: auto;
    display: flex;
    flex-direction: column;
    text-align: center;
    padding-right: 2rem;
  }
  
  .ai-card-large .card-title,
  .ai-card-large .card-text {
    max-width: 100%;
  }
  
  .ai-card-large .card-icon {
    position: static;
    align-self: center;
    margin: 1rem 0;
  }
  
  .card-icon {
    width: 140px;
    height: 140px;
  }
  
  .ai-card-large .card-icon {
    width: 200px;
    height: 200px;
  }
  
  .ai-title {
    font-size: 2rem;
    text-align: center;
  }
  
  .pricing-content {
    padding: 0 1rem;
  }
  
  .pricing-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .pricing-title {
    font-size: 2rem;
  }
  
  .pricing-card {
    min-height: auto;
  }
}
</style>