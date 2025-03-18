<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

const isMenuOpen = ref(false);
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <header>
    <div class="wrapper">
      <div class="logo">
        <img src="/Logo.svg" alt="Logo" />
      </div>
      <button class="burger" @click="toggleMenu">
        <span :class="{ 'open': isMenuOpen }"></span>
        <span :class="{ 'open': isMenuOpen }"></span>
        <span :class="{ 'open': isMenuOpen }"></span>
      </button>
      <nav :class="{ 'active': isMenuOpen }">
        <RouterLink to="/" @click="toggleMenu">Accueil</RouterLink>
        <RouterLink to="/community" @click="toggleMenu">Communauté</RouterLink>
        <RouterLink to="/formations" @click="toggleMenu">Mes formations</RouterLink>
        <RouterLink to="/faq" @click="toggleMenu">FAQ</RouterLink>
        <RouterLink to="/profile" @click="toggleMenu">Mon compte</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5.8vh 8.92vw;
  background-color: #262734;
  position: relative;
  z-index: 10;
}

.logo img {
  height: 40px;
}

nav {
  display: flex;
  gap: 30px;
}

nav a {
  text-decoration: none;
  color: #fff;
  position: relative;
}

nav a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  display: block;
  margin-top: 5px;
  right: 0;
  background: #007BFF;
  transition: width 0.3s ease;
}

nav a:hover::after {
  width: 100%;
  left: 0;
  background: #007BFF;
}

.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 20;
}

.burger span {
  display: block;
  width: 25px;
  height: 3px;
  background: white;
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .burger {
    display: flex;
  }

  nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(38, 39, 52, 0.95);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    display: none;
    text-align: center;
    z-index: 15;
  }

  nav.active {
    display: flex;
  }

  nav a {
    padding: 15px;
    font-size: 20px;
    color: white;
  }
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #262734;
  color: #fff;
  font-family: 'SF Pro', Arial, sans-serif;
}

@font-face {
  font-family: 'SF Pro';
  src: url('/fonts/SF-Pro-Display-Regular.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'SF Pro';
  src: url('/fonts/SF-Pro-Display-Bold.otf') format('opentype');
  font-weight: bold;
  font-style: normal;
}
</style>