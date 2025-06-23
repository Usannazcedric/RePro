<template>
  <div class="community-wrapper">
    <div class="community-top-grid">
      <!-- Create Post -->
      <div class="create-post">
        <!-- <div class="create-title">Créer un poste</div> -->
        <div class="input-with-icon">
          <img src="/tag.svg" class="input-icon" alt="tag" />
          <input type="text" v-model="postContent" placeholder="Partagez avec votre communauté" />
        </div>
        <div v-if="selectedFormation" class="formation-tag">{{ selectedFormation.title }}</div>
        <div v-if="postImagePreview" class="image-preview">
          <img :src="postImagePreview" alt="Aperçu" />
        </div>
        <div class="create-actions-row">
          <div class="left-btns">
            <button class="gallery" @click="openFileDialog">
              <img src="/img.svg" class="btn-icon" alt="Galerie" />
              Galerie
              <input ref="fileInput" type="file" accept="image/png,image/jpeg,image/jpg" style="display:none" @change="handleFileChange" />
            </button>
            <div class="dropdown-wrapper">
              <button class="formation" @click="toggleDropdown">
                <img src="/tag.svg" class="btn-icon" alt="Formation" />
                Formation
              </button>
              <div v-if="showDropdown" class="dropdown-menu">
                <div v-for="formation in formations" :key="formation.id" class="dropdown-item" @click="selectFormation(formation)">
                  {{ formation.title }}
                </div>
              </div>
            </div>
          </div>
          <button class="publish" @click="publishPost">
            <img src="/send.svg" class="btn-icon" alt="Publier" />
            Publier
          </button>
        </div>
      </div>
      <!-- Nouveaux apprenants -->
      <div class="sidebar-block sidebar-learners">
        <div class="sidebar-header">
          <span>Nouveaux apprenants</span>
          <a href="#">Voir tout</a>
        </div>
        <ul>
          <li v-for="user in learners.slice(0,2)" :key="user.name">
            <div class="avatar"></div>
            <div>
              <div class="name">{{ user.name }}</div>
              <div class="info">A acheté votre formation - {{ user.course }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- Feed and Sidebars -->
    <div class="main-content">
      <!-- Feed -->
      <div class="feed">
        <div v-for="post in feed" :key="post.id" class="post">
          <div class="post-header">
            <div class="avatar">
              <img v-if="post.profile && post.profile.avatar_url" :src="post.profile.avatar_url" class="profile-image" alt="avatar" />
            </div>
            <div class="header-main">
              <div class="header-row">
                <div>
                  <div class="username">{{ post.profile?.username || 'Utilisateur' }}</div>
                  <div class="time">{{ timeAgo(post.created_at) }}</div>
                </div>
                <div v-if="post.formation_title" class="formation-tag">{{ post.formation_title }}</div>
              </div>
            </div>
          </div>
          <div class="post-title">{{ post.content }}</div>
          <div v-if="post.image_base64" class="image-preview">
            <img :src="post.image_base64" alt="Aperçu" />
          </div>
          <div class="post-footer">
            <div class="reactions">
              <span class="icon like"></span>
              <span class="icon haha"></span>
              <span class="icon heart"></span>
              <span>0 Reaction</span>
            </div>
            <button class="share">Partager</button>
          </div>
        </div>
      </div>
      <!-- Sidebars -->
      <div class="sidebars">
        <!-- Last Comments -->
        <div class="sidebar-block">
          <div class="sidebar-header">
            <span>Derniers commentaires</span>
            <a href="#">Voir tout</a>
          </div>
          <ul>
            <li v-for="user in commenters" :key="user.name">
              <div class="avatar"></div>
              <div>
                <div class="name">{{ user.name }}</div>
                <div class="info">A commenté votre dernier poste</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const learners = [
  { name: 'John Doe', course: 'UX/UI débutant' },
  { name: 'Jules Bounes', course: 'Data débutant' },
  { name: 'Arthur Salami', course: 'Python débutant' },
  { name: 'Louna Martino', course: 'UX/UI débutant' },
  { name: 'Selena Patozeg', course: 'Data débutant' }
]

const commenters = [
  { name: 'John Doe' },
  { name: 'Jules Bounes' },
  { name: 'Arthur Salami' },
  { name: 'Louna Martino' },
  { name: 'Selena Patozeg' },
  { name: 'Patrick Manchesso' }
]

const postContent = ref('')
const postImage = ref(null)
const postImagePreview = ref(null)
const showDropdown = ref(false)
const formations = ref([])
const selectedFormation = ref(null)
const feed = ref([])
const user = ref(null)

const fileInput = ref(null)

function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return `il y a ${diff} secondes`
  if (diff < 3600) return `il y a ${Math.floor(diff/60)} minutes`
  if (diff < 86400) return `il y a ${Math.floor(diff/3600)} heures`
  return `il y a ${Math.floor(diff/86400)} jours`
}

async function fetchProfilesForPosts(posts) {
  const userIds = [...new Set(posts.map(p => p.user_id))]
  if (userIds.length === 0) return {}
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .in('id', userIds)
  const map = {}
  if (profiles) {
    for (const p of profiles) map[p.id] = p
  }
  return map
}

onMounted(async () => {
  // Récupère l'utilisateur connecté
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return
  user.value = session.user
  // Charge les formations du user
  const { data } = await supabase
    .from('formations')
    .select('*')
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false })
  formations.value = data || []
  // Charge les posts existants
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
  // Récupère les profils des auteurs
  const profilesMap = await fetchProfilesForPosts(posts || [])
  feed.value = (posts || []).map(post => ({
    ...post,
    profile: profilesMap[post.user_id] || null
  }))
})

function openFileDialog() {
  fileInput.value.click()
}

function handleFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    postImage.value = ev.target.result
    postImagePreview.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function selectFormation(formation) {
  selectedFormation.value = formation
  showDropdown.value = false
}

async function publishPost() {
  if (!postContent.value && !postImage.value) return
  const post = {
    content: postContent.value,
    image_base64: postImage.value,
    formation_title: selectedFormation.value ? selectedFormation.value.title : null,
    user_id: user.value.id,
    created_at: new Date().toISOString()
  }
  // Insert dans Supabase
  const { data, error } = await supabase.from('posts').insert([post]).select()
  if (!error && data && data.length > 0) {
    // Récupère le profil de l'auteur pour le nouveau post
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .eq('id', user.value.id)
      .single()
    feed.value.unshift({ ...data[0], profile })
    postContent.value = ''
    postImage.value = null
    postImagePreview.value = null
    selectedFormation.value = null
  }
}
</script>

<style scoped>
.community-wrapper {
  max-width: 1200px;
  margin: auto;
  padding: 2rem;
  background: #f9f9fb;
}

.community-top-grid {
  display: grid;
  grid-template-columns: 2.5fr 1fr;
  gap: 2rem;
  margin-bottom: 2.5rem;
  align-items: start;
}

.create-post {
  background: #fff;
  padding: 2rem 2.2rem 1.5rem 2.2rem;
  border-radius: 20px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.create-title {
  font-weight: 700;
  font-size: 1.15rem;
  margin-bottom: 0.5rem;
  color: #222;
}
.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 0.7rem;
}
.input-with-icon .input-icon {
  position: absolute;
  left: 16px;
  width: 22px;
  height: 22px;
  z-index: 2;
}
.input-with-icon input {
  width: 100%;
  padding: 0.85rem 1rem 0.85rem 48px;
  border: none;
  border-radius: 14px;
  background: #f3f4f6;
  font-size: 1.05rem;
  color: #222;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.create-actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.2rem;
}
.left-btns {
  display: flex;
  gap: 0.7rem;
}
.create-actions-row button {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 0;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.01rem;
  cursor: pointer;
  transition: background 0.18s, border 0.18s;
  justify-content: center;
}
.left-btns .gallery, .left-btns .formation {
  border: 1.5px solid #ededfb;
  background: #f7f7fd;
  color: #7376ff;
  min-width: 120px;
}
.publish {
  border: none;
  background: #7376ff;
  color: #fff;
  box-shadow: 0 2px 8px rgba(115,118,255,0.08);
  min-width: 120px;
}
.publish .btn-icon {
  filter: brightness(0) invert(1);
}
.create-actions-row .btn-icon {
  width: 20px;
  height: 20px;
}

.sidebar-block {
  background: #fff;
  border-radius: 16px;
  padding: 1.2rem 1.2rem;
  box-shadow: 0 4px 18px rgba(0,0,0,0.08);
}
.sidebar-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 1rem;
}
.sidebar-header a {
  color: #7376ff;
  font-weight: 500;
  font-size: 0.98rem;
  text-decoration: none;
}
.sidebar-block ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar-block li {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
}
.name {
  font-weight: 600;
}
.info {
  font-size: 0.85rem;
  color: #6b7280;
}

.main-content {
  display: flex;
  gap: 2rem;
}
.feed {
  flex: 3;
}
.post {
  background: white;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
}
.post-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}
.avatar {
  width: 48px;
  height: 48px;
  background: #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-right: 1rem;
}
.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.username {
  font-weight: bold;
}
.time {
  font-size: 0.875rem;
  color: #6b7280;
}
.post-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.post-body {
  color: #4b5563;
  margin-bottom: 1rem;
}
.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #6b7280;
}
.reactions .icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  background: #d1d5db;
  border-radius: 50%;
  margin-right: 0.3rem;
}
.share {
  background: #f3f4f6;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  cursor: pointer;
}
.sidebars {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.formation-tag {
  display: inline-block;
  background: #f3f4f6;
  color: #7376ff;
  border-radius: 8px;
  padding: 4px 12px;
  font-size: 0.98rem;
  font-weight: 700;
  margin-bottom: 0;
  margin-left: 1rem;
  white-space: nowrap;
}
.image-preview {
  margin-bottom: 0.7rem;
}
.image-preview img {
  max-width: 180px;
  max-height: 120px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.dropdown-wrapper {
  position: relative;
}
.dropdown-menu {
  position: absolute;
  top: 110%;
  left: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.08);
  min-width: 180px;
  z-index: 10;
  padding: 8px 0;
}
.dropdown-item {
  padding: 10px 18px;
  cursor: pointer;
  color: #444;
  font-size: 1rem;
  transition: background 0.15s;
}
.dropdown-item:hover {
  background: #f3f4f6;
  color: #7376ff;
}
.header-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
}
</style>
