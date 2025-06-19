<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { supabase } from './supabase'

const isMenuOpen = ref(false)
const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }
const router = useRouter()

const user = ref<any>(null)
const userProfile = ref({ username: '', avatar_url: '' })

async function fetchUserProfile(sessionUser: any) {
  if (sessionUser) {
    user.value = sessionUser
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', sessionUser.id)
      .single()
    if (data) userProfile.value = data
  } else {
    user.value = null
    userProfile.value = { username: '', avatar_url: '' }
  }
}

let authListener: any = null

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  fetchUserProfile(session?.user)
  authListener = supabase.auth.onAuthStateChange((_event, session) => {
    fetchUserProfile(session?.user)
  })

  // Écouter les mises à jour du profil
  window.addEventListener('profileUpdated', (event: Event) => {
    const customEvent = event as CustomEvent
    if (customEvent.detail?.avatar_url) {
      userProfile.value.avatar_url = customEvent.detail.avatar_url
    }
  })
})

onUnmounted(() => {
  if (authListener && typeof authListener.unsubscribe === 'function') {
    authListener.unsubscribe()
  }
})
</script>

<template>
  <header class="main-navbar">
    <div class="wrapper">
      <div class="logo-text">SnapRead</div>
      <nav :class="{ 'active': isMenuOpen }">
        <RouterLink to="/">Accueil</RouterLink>
        <RouterLink to="/community">Communauté</RouterLink>
        <RouterLink to="/formations">Mes formations</RouterLink>
        <RouterLink to="/faq">FAQ</RouterLink>
      </nav>
      <div class="user-section">
        <RouterLink v-if="!user" to="/login" class="login-btn">Se connecter</RouterLink>
        <div v-else class="profile-btn" @click="router.push('/profile')">
          <img
            v-if="userProfile.avatar_url"
            :src="userProfile.avatar_url"
            alt="avatar"
            class="avatar"
          />
          <div v-else class="avatar avatar-default">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="#7376FF"/><path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" fill="#7376FF"/></svg>
          </div>
          <span class="username">{{ userProfile.username || 'Profil' }}</span>
        </div>
      </div>
      <button class="burger" @click="toggleMenu">
        <span :class="{ 'open': isMenuOpen }"></span>
        <span :class="{ 'open': isMenuOpen }"></span>
        <span :class="{ 'open': isMenuOpen }"></span>
      </button>
    </div>
  </header>
  <main class="main-content">
    <RouterView />
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@900;700;400&display=swap');

.main-navbar {
  background: #fff;
  width: 100vw;
  min-height: 70px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  box-sizing: border-box;
}
.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2.2vh 4vw;
  max-width: 1600px;
  margin: 0 auto;
  box-sizing: border-box;
}
.logo-text {
  font-family: 'Nunito', sans-serif;
  font-weight: 900;
  font-size: 2rem;
  color: #7376FF;
  letter-spacing: -1px;
}
nav {
  display: flex;
  gap: 38px;
  align-items: center;
}
nav a {
  text-decoration: none;
  color: #000;
  font-family: 'Nunito', sans-serif;
  font-weight: 500;
  font-size: 1.1rem;
  position: relative;
  transition: color 0.2s;
  padding: 0.5rem 0;
}
nav a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #7376FF;
  transition: width 0.3s ease;
}
nav a:hover::after {
  width: 100%;
}
nav a.router-link-active {
  color: #7376FF;
}
nav a.router-link-active::after {
  width: 0;
}
nav a:hover {
  color: #7376FF;
}
.user-section {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.login-btn {
  background: #7376FF;
  color: #fff;
  font-weight: 500;
  font-size: 1rem;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1.6rem;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
  display: flex;
  align-items: center;
}
.login-btn:hover {
  background: #5d60d6;
}
.profile-btn {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}
.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  background: #eaeaea;
  border: 2px solid #7376FF;
}
.avatar-default {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eaeaea;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid #7376FF;
}
.username {
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  color: #7376FF;
  font-size: 1.1rem;
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
  background: #7376FF;
  transition: transform 0.3s ease;
}
@media (max-width: 900px) {
  .wrapper {
    padding: 2vh 2vw;
  }
  nav {
    gap: 18px;
  }
  .login-btn {
    margin-left: 1rem;
    padding: 0.5rem 1.1rem;
  }
}
@media (max-width: 768px) {
  .burger {
    display: flex;
  }
  nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #fff;
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
    font-size: 1.3rem;
    color: #000;
  }
  .login-btn {
    position: absolute;
    top: 1.5rem;
    right: 2rem;
    margin: 0;
  }
}
.main-content {
  padding-top: 90px;
  min-height: 100vh;
  box-sizing: border-box;
}
</style>

<style>
body {
  background: #FAFAFA !important;
  color: #222;
  font-family: 'Nunito', Arial, sans-serif;
}
html, body {
  scrollbar-width: none; /* Firefox */
}
html::-webkit-scrollbar, body::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>