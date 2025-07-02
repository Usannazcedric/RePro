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
      <RouterLink to="/" class="logo-text">SnapRead</RouterLink>
      <nav :class="{ 'active': isMenuOpen }">
        <RouterLink to="/" @click="isMenuOpen = false">Accueil</RouterLink>
        <RouterLink to="/community" @click="isMenuOpen = false">Communauté</RouterLink>
        <RouterLink to="/formations" @click="isMenuOpen = false">Mes formations</RouterLink>
        <RouterLink to="/faq" @click="isMenuOpen = false">FAQ</RouterLink>
        <RouterLink v-if="!user" to="/login" class="mobile-login-btn" @click="isMenuOpen = false">Se connecter</RouterLink>
        <!-- <RouterLink v-else to="/profile" class="mobile-profile-btn" @click="isMenuOpen = false">Profil</RouterLink> -->
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
@import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap');
*{
  font-family: Nunito, sans-serif;
}

.main-navbar {
  background: transparent;
  width: 100vw;
  min-height: 70px;
  box-sizing: border-box;
}
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2.2vh 4vw;
  max-width: 1600px;
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
}
.logo-text {
  font-family: 'Nunito', sans-serif;
  font-weight: 900;
  font-size: 2rem;
  color: #7376FF;
  letter-spacing: -1px;
  position: absolute;
  left: 4vw;
  text-decoration: none;
}
nav {
  display: flex;
  gap: 38px;
  align-items: center;
  background: #fff;
  padding: 12px 32px;
  border-radius: 50px;
  box-shadow: 0 4px 18px rgba(115, 118, 255, 0.15);
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
  position: absolute;
  right: 4vw;
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

.mobile-login-btn {
  display: none;
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

.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 1001;
  position: relative;
}
.burger span {
  display: block;
  width: 25px;
  height: 3px;
  background: #7376FF;
  transition: transform 0.3s ease;
}
.burger span.open:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}
.burger span.open:nth-child(2) {
  opacity: 0;
}
.burger span.open:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
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
  .wrapper {
    justify-content: space-between;
  }
  
  .logo-text {
    position: static;
    order: 1;
  }
  
  .burger {
    display: flex;
    order: 3;
  }
  
  .user-section {
    position: static;
    order: 2;
  }
  
  .user-section .login-btn {
    display: none;
  }
  
  .user-section .profile-btn {
    display: none;
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
    z-index: 1000;
    gap: 40px;
    padding: 40px 20px;
    box-shadow: none;
    border-radius: 0;
  }
  
  nav.active {
    display: flex;
  }
  
  nav a {
    padding: 20px;
    font-size: 1.4rem;
    color: #000;
    width: 280px;
    text-align: center;
    font-weight: 600;
    border-radius: 15px;
    transition: color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 35px;
  }
  
  nav a::after {
    display: none;
  }
  
  nav a:hover {
    color: #7376FF;
  }
  
  .mobile-login-btn {
    background: #7376FF !important;
    color: #fff !important;
    font-weight: 600;
    border-radius: 25px;
    padding: 16px 32px !important;
    text-decoration: none;
    margin-top: 30px;
    font-size: 1.2rem !important;
    width: 280px;
    display: flex !important;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
    margin-right: 35px;
  }
  
  .mobile-login-btn:hover {
    background: #5d60d6 !important;
  }
  
  .mobile-profile-btn {
    background: #7376FF !important;
    color: #fff !important;
    font-weight: 600;
    border-radius: 25px;
    padding: 16px 32px !important;
    text-decoration: none;
    margin-top: 30px;
    font-size: 1.2rem !important;
    width: 280px;
    display: flex !important;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
    margin-right: 35px;
  }
  
  .mobile-profile-btn:hover {
    background: #5d60d6 !important;
  }
}
.main-content {
  min-height: 100vh;
  box-sizing: border-box;
}
</style>

<style>
body {
  background: #E9E9EE !important;
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