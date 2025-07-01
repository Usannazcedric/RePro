<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-top">
        <h2 class="footer-title">SnapRead</h2>
        <p class="footer-description">
          SnapRead,
          l'IA qui réinvente
          la formation
        </p>
      </div>
      
      <div class="footer-links">
        <div class="footer-column">
          <h3>Campagne</h3>
        </div>
        <div class="footer-column">
          <h3>Mail marketing</h3>
        </div>
        <div class="footer-column">
          <h3>Marque</h3>
        </div>
        <div class="footer-column">
          <h3>Hors ligne</h3>
        </div>
        <div class="footer-column">
          <h3>Nous contacter</h3>
        </div>
        <div class="footer-column">
          <h3 @click="goToFAQ">FAQ</h3>
        </div>
      </div>
      
      <div class="footer-social">
        <div class="social-icons">
          <div class="social-icon">
            <i class="fab fa-facebook-f"></i>
          </div>
          <div class="social-icon">
            <i class="fab fa-twitter"></i>
          </div>
          <div class="social-icon">
            <i class="fab fa-instagram"></i>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  methods: {
    goToFAQ() {
      this.$router.push('/faq');
    }
  }
}
</script>

<style scoped>
.footer {
  background: #7376FF;
  color: white;
  padding: 4rem 0 2rem 0;
  margin-top: 2rem;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  position: relative;
  margin-bottom: 0;
  padding-bottom: 2rem;
}

.footer::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 10px;
  background: #7376FF;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.footer-top {
  margin-bottom: 2.5rem;
}

.footer-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
  font-family: 'Nunito', sans-serif;
}

.footer-description {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Nunito', sans-serif;
  font-weight: 300;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.footer-column h3 {
  font-size: 1.1rem;
  font-weight: 400;
  color: white;
  margin: 0;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Nunito', sans-serif;
}

.footer-column h3:hover {
  color: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
}

.footer-social {
  display: flex;
  justify-content: center;
}

.social-icons {
  display: flex;
  gap: 1.5rem;
}

.social-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.social-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.social-icon i {
  font-size: 1.2rem;
  color: white;
}

@media (max-width: 768px) {
  .footer {
    padding: 3rem 0 2rem 0;
  }
  
  .footer-content {
    padding: 0 1rem;
  }
  
  .footer-title {
    font-size: 1.6rem;
  }
  
  .footer-description {
    font-size: 0.9rem;
  }
  
  .footer-links {
    gap: 2rem;
    flex-direction: column;
    align-items: center;
  }
  
  .footer-column h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .social-icons {
    gap: 1rem;
  }
  
  .social-icon {
    width: 35px;
    height: 35px;
  }
}

@media (max-width: 480px) {
  .footer-links {
    gap: 1.5rem;
  }
  
  .footer-title {
    font-size: 1.8rem;
  }
  
  .footer-description {
    font-size: 0.85rem;
  }
}
</style> 