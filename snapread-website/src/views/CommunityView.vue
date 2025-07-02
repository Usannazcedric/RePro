<template>
  <div class="community-wrapper page-with-footer">
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
          <router-link to="/profile/transactions" class="voir-tout-link">Voir tout</router-link>
        </div>
        <ul v-if="recentLearners.length > 0">
          <li v-for="learner in recentLearners.slice(0,2)" :key="learner.id">
            <div class="avatar">
              <img v-if="learner.avatar_url" :src="learner.avatar_url" class="profile-image" alt="avatar" />
              <div v-else class="avatar-placeholder">{{ learner.name.charAt(0).toUpperCase() }}</div>
            </div>
            <div>
              <div class="name">{{ learner.name }}</div>
              <div class="info">A acheté votre formation - {{ learner.formationTitle }}</div>
            </div>
          </li>
        </ul>
        <div v-else class="no-learners">
          <p class="no-learners-text">Aucun nouvel apprenant pour le moment</p>
        </div>
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
              <div v-if="getPostReactions(post.id).length > 0" class="reaction-bubbles">
                <div 
                  v-for="reaction in getPostReactions(post.id)" 
                  :key="reaction.emoji" 
                  class="reaction-bubble"
                >
                  <span class="reaction-emoji">{{ reaction.emoji }}</span>
                  <span class="reaction-count">{{ reaction.count }}</span>
                </div>
              </div>
              <span v-else class="no-reactions">Aucune réaction</span>
            </div>
            <button class="share">Partager</button>
          </div>
        </div>
      </div>
      <div class="sidebars">
        <div class="sidebar-block">
          <div class="sidebar-header">
            <span>Dernières notifications</span>
            <router-link to="/profile/notifications" class="voir-tout-link">Voir tout</router-link>
          </div>
          <ul v-if="allNotifications.length > 0">
            <li v-for="notification in allNotifications" :key="notification.id">
              <div class="avatar">
                <img v-if="notification.avatar_url" :src="notification.avatar_url" class="profile-image" alt="avatar" />
                <div v-else class="avatar-placeholder">{{ notification.name.charAt(0).toUpperCase() }}</div>
              </div>
              <div>
                <div class="name">{{ notification.name }}</div>
                <div class="info" v-if="notification.type === 'reaction'">
                  A réagi avec {{ notification.emoji }} à {{ notification.postContent.length > 30 ? notification.postContent.substring(0, 30) + '...' : notification.postContent }}
                </div>
                <div class="info" v-else-if="notification.type === 'review'">
                  A donné {{ notification.rating }}/5 ⭐ à votre formation "{{ notification.formationTitle.length > 25 ? notification.formationTitle.substring(0, 25) + '...' : notification.formationTitle }}"
                </div>
              </div>
            </li>
          </ul>
          <div v-else class="no-reactions-sidebar">
            <p class="no-reactions-text">Aucune notification récente</p>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import Footer from '../components/Footer.vue'

const recentLearners = ref([])
const recentReactions = ref([])
const recentReviews = ref([])
const allNotifications = ref([])

const postContent = ref('')
const postImage = ref(null)
const postImagePreview = ref(null)
const showDropdown = ref(false)
const formations = ref([])
const selectedFormation = ref(null)
const feed = ref([])
const user = ref(null)
const postReactions = ref([])

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

async function fetchPostReactions(postIds) {
  if (!postIds || postIds.length === 0) return
  
  try {
    const { data: reactions, error } = await supabase
      .from('reactions')
      .select('*')
      .in('post_id', postIds)
    
    if (error) {
      console.error('Erreur lors du chargement des réactions:', error)
      return
    }
    
    postReactions.value = reactions || []
  } catch (error) {
    console.error('Erreur lors du chargement des réactions:', error)
  }
}

function getPostReactions(postId) {
  const reactions = postReactions.value.filter(r => r.post_id === postId)
  const groupedReactions = {}
  
  reactions.forEach(reaction => {
    if (groupedReactions[reaction.emoji]) {
      groupedReactions[reaction.emoji]++
    } else {
      groupedReactions[reaction.emoji] = 1
    }
  })
  
  return Object.entries(groupedReactions).map(([emoji, count]) => ({
    emoji,
    count
  }))
}

async function fetchRecentLearners() {
  if (!user.value) return
  
  try {
    // Récupérer les achats récents des formations de l'utilisateur connecté
    const { data, error } = await supabase
      .from('purchased_formations')
      .select(`
        id,
        purchased_at,
        user_id,
        formations!inner(
          title,
          user_id
        )
      `)
      .eq('formations.user_id', user.value.id)
      .eq('status', 'active')
      .order('purchased_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Erreur lors du chargement des achats:', error)
      return
    }

    if (!data || data.length === 0) {
      recentLearners.value = []
      return
    }

    // Récupérer les profils des utilisateurs qui ont acheté
    const userIds = [...new Set(data.map(purchase => purchase.user_id))]
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', userIds)

    if (profilesError) {
      console.error('Erreur lors du chargement des profils:', profilesError)
    }

    // Créer un map des profils
    const profilesMap = {}
    if (profiles) {
      profiles.forEach(profile => {
        profilesMap[profile.id] = profile
      })
    }

    // Transformer les données pour l'affichage
    recentLearners.value = data.map(purchase => ({
      id: purchase.id,
      name: profilesMap[purchase.user_id]?.username || 'Utilisateur',
      avatar_url: profilesMap[purchase.user_id]?.avatar_url || null,
      formationTitle: purchase.formations.title,
      purchasedAt: purchase.purchased_at
    }))

  } catch (error) {
    console.error('Erreur lors du chargement des apprenants:', error)
  }
}

async function fetchRecentReactions() {
  if (!user.value) return
  
  try {
    // Récupérer d'abord les posts de l'utilisateur connecté
    const { data: userPosts, error: postsError } = await supabase
      .from('posts')
      .select('id, content')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (postsError) {
      console.error('Erreur lors du chargement des posts:', postsError)
      return
    }

    if (!userPosts || userPosts.length === 0) {
      recentReactions.value = []
      return
    }

    const postIds = userPosts.map(post => post.id)

    // Récupérer les réactions récentes sur ces posts (excluant l'auteur des posts)
    const { data: reactions, error: reactionsError } = await supabase
      .from('reactions')
      .select('id, post_id, user_id, emoji, created_at')
      .in('post_id', postIds)
      .neq('user_id', user.value.id) // Exclure les réactions de l'utilisateur sur ses propres posts
      .order('created_at', { ascending: false })
      .limit(6)

    if (reactionsError) {
      console.error('Erreur lors du chargement des réactions:', reactionsError)
      return
    }

    if (!reactions || reactions.length === 0) {
      recentReactions.value = []
      return
    }

    // Récupérer les profils des utilisateurs qui ont réagi
    const userIds = [...new Set(reactions.map(reaction => reaction.user_id))]
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', userIds)

    if (profilesError) {
      console.error('Erreur lors du chargement des profils:', profilesError)
    }

    // Créer un map des profils
    const profilesMap = {}
    if (profiles) {
      profiles.forEach(profile => {
        profilesMap[profile.id] = profile
      })
    }

    // Créer un map des posts
    const postsMap = {}
    userPosts.forEach(post => {
      postsMap[post.id] = post
    })

    // Transformer les données pour l'affichage
    recentReactions.value = reactions.map(reaction => ({
      id: reaction.id,
      type: 'reaction',
      name: profilesMap[reaction.user_id]?.username || 'Utilisateur',
      avatar_url: profilesMap[reaction.user_id]?.avatar_url || null,
      emoji: reaction.emoji,
      postContent: postsMap[reaction.post_id]?.content || 'votre poste',
      reactedAt: reaction.created_at
    }))

  } catch (error) {
    console.error('Erreur lors du chargement des réactions récentes:', error)
  }
}

async function fetchRecentReviews() {
  if (!user.value) return
  
  try {
    // Récupérer d'abord les formations de l'utilisateur connecté
    const { data: userFormations, error: formationsError } = await supabase
      .from('formations')
      .select('id, title')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (formationsError) {
      console.error('Erreur lors du chargement des formations:', formationsError)
      return
    }

    if (!userFormations || userFormations.length === 0) {
      recentReviews.value = []
      return
    }

    const formationIds = userFormations.map(formation => formation.id)

    // Récupérer les avis récents sur ces formations (excluant l'auteur des formations)
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('id, formation_id, user_id, rating, created_at')
      .in('formation_id', formationIds)
      .neq('user_id', user.value.id) // Exclure les avis de l'utilisateur sur ses propres formations
      .order('created_at', { ascending: false })
      .limit(6)

    if (reviewsError) {
      console.error('Erreur lors du chargement des avis:', reviewsError)
      return
    }

    if (!reviews || reviews.length === 0) {
      recentReviews.value = []
      return
    }

    // Récupérer les profils des utilisateurs qui ont donné un avis
    const userIds = [...new Set(reviews.map(review => review.user_id))]
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', userIds)

    if (profilesError) {
      console.error('Erreur lors du chargement des profils:', profilesError)
    }

    // Créer un map des profils
    const profilesMap = {}
    if (profiles) {
      profiles.forEach(profile => {
        profilesMap[profile.id] = profile
      })
    }

    // Créer un map des formations
    const formationsMap = {}
    userFormations.forEach(formation => {
      formationsMap[formation.id] = formation
    })

    // Transformer les données pour l'affichage
    recentReviews.value = reviews.map(review => ({
      id: review.id,
      type: 'review',
      name: profilesMap[review.user_id]?.username || 'Utilisateur',
      avatar_url: profilesMap[review.user_id]?.avatar_url || null,
      rating: review.rating,
      formationTitle: formationsMap[review.formation_id]?.title || 'Formation inconnue',
      reviewedAt: review.created_at
    }))

  } catch (error) {
    console.error('Erreur lors du chargement des avis récents:', error)
  }
}

function combineNotifications() {
  // Combiner réactions et avis, puis trier par date
  const allNotifs = [
    ...recentReactions.value,
    ...recentReviews.value
  ].sort((a, b) => {
    const dateA = new Date(a.reactedAt || a.reviewedAt)
    const dateB = new Date(b.reactedAt || b.reviewedAt)
    return dateB - dateA // Plus récent en premier
  })
  
  allNotifications.value = allNotifs.slice(0, 6) // Limiter à 6 notifications max
}

onMounted(async () => {
  // Récupère l'utilisateur connecté
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return
  user.value = session.user
  
  // Charge les apprenants récents
  await fetchRecentLearners()
  
  // Charge les réactions récentes
  await fetchRecentReactions()
  
  // Charge les avis récents
  await fetchRecentReviews()
  
  // Combine toutes les notifications
  combineNotifications()
  
  // Charge les formations publiées du user
  const { data } = await supabase
    .from('formations')
    .select('*')
    .eq('user_id', user.value.id)
    .eq('is_published', true) // Afficher seulement les formations publiées
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
  
  // Charge les réactions pour tous les posts
  if (posts && posts.length > 0) {
    const postIds = posts.map(post => post.id)
    await fetchPostReactions(postIds)
  }
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
    formation_id: selectedFormation.value ? selectedFormation.value.id : null,
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
    
    // Pas besoin de recharger les réactions car un nouveau post n'en a pas encore
  }
}
</script>

<style scoped>
.community-wrapper {
  max-width: 1200px;
  margin: auto;
  padding: 2rem;
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
.sidebar-header a, .voir-tout-link {
  color: #7376ff;
  font-weight: 500;
  font-size: 0.98rem;
  text-decoration: none;
  transition: color 0.2s ease;
}

.sidebar-header a:hover, .voir-tout-link:hover {
  color: #5d60d6;
}
.sidebar-block ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar-block li {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.sidebar-block .avatar {
  width: 40px;
  height: 40px;
  margin-right: 0;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #d1d5db;
}

.sidebar-block .avatar-placeholder {
  font-size: 1rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #7376ff;
  color: white;
  font-weight: bold;
  border-radius: 50%;
}

.sidebar-block .profile-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}
.name {
  font-weight: 600;
}
.info {
  font-size: 0.85rem;
  color: #6b7280;
}

.no-learners {
  text-align: center;
  padding: 1rem 0;
}

.no-learners-text {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
  font-style: italic;
}

.no-reactions-sidebar {
  text-align: center;
  padding: 1rem 0;
}

.no-reactions-text {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
  font-style: italic;
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

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #7376ff;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
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
.reaction-bubbles {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.reaction-bubble {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #f3f4f6;
  border-radius: 16px;
  padding: 0.25rem 0.5rem;
  border: 1px solid #e5e7eb;
}

.reaction-emoji {
  font-size: 16px;
}

.reaction-count {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
}

.no-reactions {
  color: #9ca3af;
  font-size: 14px;
  font-style: italic;
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
