<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <div class="logo">
        <img src="/Logo.svg" alt="Logo" />
      </div>
      <nav>
        <RouterLink to="/">Accueil</RouterLink>
        <RouterLink to="/community">Communauté</RouterLink>
        <RouterLink to="/courses">Mes formations</RouterLink>
        <RouterLink to="/faq">FAQ</RouterLink>
        <RouterLink to="/profile">Mon compte</RouterLink>
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
}

.logo img {
  height: 40px;
}

nav {
  display: flex;
  gap: 20px;
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
  -webkit-transition: width 0.3s ease;
}

nav a:hover::after {
  width: 100%;
  left: 0;
  background: #007BFF;
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