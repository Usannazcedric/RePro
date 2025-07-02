<template>
  <div class="notifications-page">
    <div class="notifications-container">
      <!-- <div class="page-header">
        <h1 class="page-title">Notifications</h1>
      </div> -->

      <!-- État de chargement -->
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p class="loading-message">Chargement des notifications...</p>
      </div>

      <!-- Contenu des notifications -->
      <div v-else>
        <!-- Nouvelles notifications -->
        <div class="notifications-section">
          <h2 class="section-title">Nouvelles notifications</h2>
          <div v-if="newNotifications.length > 0" class="notifications-list">
            <div 
              v-for="notification in newNotifications" 
              :key="notification.id"
              class="notification-item new"
            >
              <div class="notification-avatar">
                <img v-if="notification.avatar_url" :src="notification.avatar_url" class="profile-image" alt="avatar" />
                <div v-else class="avatar-placeholder">{{ notification.name.charAt(0).toUpperCase() }}</div>
              </div>
              <div class="notification-info">
                <div class="notification-content">
                  <span class="user-name">{{ notification.name }}</span>
                  <span v-if="notification.type === 'reaction'">
                    a réagi avec <span class="emoji">{{ notification.emoji }}</span> à votre post
                  </span>
                  <span v-else-if="notification.type === 'review'">
                    a donné <span class="rating">{{ notification.rating }}/5 ⭐</span> à votre formation "<span class="formation-title">{{ notification.formationTitle.length > 30 ? notification.formationTitle.substring(0, 30) + '...' : notification.formationTitle }}</span>"
                  </span>
                </div>
                <div class="notification-time">{{ timeAgo(notification.date) }}</div>
              </div>
              <div class="notification-indicator">
                <div class="new-badge"></div>
              </div>
            </div>
          </div>
          <div v-else class="empty-section">
            <div class="empty-icon">
              <img src="/folder.svg" alt="Aucune notification" />
            </div>
            <p class="empty-message">Vous n'avez aucune notifications en attente</p>
          </div>
        </div>

        <!-- Historique des notifications -->
        <div class="notifications-section">
          <h2 class="section-title">Historique des notifications</h2>
          <div v-if="oldNotifications.length > 0" class="notifications-list">
            <div 
              v-for="notification in oldNotifications" 
              :key="notification.id"
              class="notification-item"
            >
              <div class="notification-avatar">
                <img v-if="notification.avatar_url" :src="notification.avatar_url" class="profile-image" alt="avatar" />
                <div v-else class="avatar-placeholder">{{ notification.name.charAt(0).toUpperCase() }}</div>
              </div>
              <div class="notification-info">
                <div class="notification-content">
                  <span class="user-name">{{ notification.name }}</span>
                  <span v-if="notification.type === 'reaction'">
                    a réagi avec <span class="emoji">{{ notification.emoji }}</span> à votre post
                  </span>
                  <span v-else-if="notification.type === 'review'">
                    a donné <span class="rating">{{ notification.rating }}/5 ⭐</span> à votre formation "<span class="formation-title">{{ notification.formationTitle.length > 30 ? notification.formationTitle.substring(0, 30) + '...' : notification.formationTitle }}</span>"
                  </span>
                </div>
                <div class="notification-time">{{ timeAgo(notification.date) }}</div>
              </div>
            </div>
          </div>
          <div v-else class="empty-section">
            <div class="empty-icon">
              <img src="/folder.svg" alt="Aucune notification" />
            </div>
            <p class="empty-message">Vous n'avez aucune notifications en attente</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase'

export default {
  name: 'Notifications',
  data() {
    return {
      loading: true,
      notifications: [],
      reactionNotifications: [],
      reviewNotifications: []
    }
  },
  async mounted() {
    await this.fetchNotifications()
  },
  computed: {
    newNotifications() {
      return this.notifications.slice(0, 2)
    },
    oldNotifications() {
      return this.notifications.slice(2)
    }
  },
  methods: {
    async fetchNotifications() {
      try {
        this.loading = true
        
        // Récupérer l'utilisateur connecté
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session?.user) {
          console.error('Utilisateur non connecté')
          this.notifications = []
          return
        }

        // Récupérer les notifications de réactions et d'avis en parallèle
        await Promise.all([
          this.fetchReactionNotifications(session.user),
          this.fetchReviewNotifications(session.user)
        ])

        // Combiner toutes les notifications et les trier par date
        this.combineNotifications()

      } catch (error) {
        console.error('Erreur lors du chargement des notifications:', error)
        this.notifications = []
      } finally {
        this.loading = false
      }
    },

    async fetchReactionNotifications(user) {
      try {
        // Récupérer d'abord les posts de l'utilisateur connecté
        const { data: userPosts, error: postsError } = await supabase
          .from('posts')
          .select('id, content')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (postsError) {
          console.error('Erreur lors du chargement des posts:', postsError)
          return
        }

        if (!userPosts || userPosts.length === 0) {
          this.reactionNotifications = []
          return
        }

        const postIds = userPosts.map(post => post.id)

        // Récupérer les réactions récentes sur ces posts (excluant l'auteur des posts)
        const { data: reactions, error: reactionsError } = await supabase
          .from('reactions')
          .select('id, post_id, user_id, emoji, created_at')
          .in('post_id', postIds)
          .neq('user_id', user.id) // Exclure les réactions de l'utilisateur sur ses propres posts
          .order('created_at', { ascending: false })

        if (reactionsError) {
          console.error('Erreur lors du chargement des réactions:', reactionsError)
          return
        }

        if (!reactions || reactions.length === 0) {
          this.reactionNotifications = []
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
        this.reactionNotifications = reactions.map(reaction => ({
          id: `reaction-${reaction.id}`,
          type: 'reaction',
          name: profilesMap[reaction.user_id]?.username || 'Utilisateur',
          avatar_url: profilesMap[reaction.user_id]?.avatar_url || null,
          emoji: reaction.emoji,
          postContent: postsMap[reaction.post_id]?.content?.length > 50 
            ? postsMap[reaction.post_id]?.content.substring(0, 50) + '...' 
            : postsMap[reaction.post_id]?.content || 'votre post',
          date: reaction.created_at
        }))

      } catch (error) {
        console.error('Erreur lors du chargement des notifications de réactions:', error)
        this.reactionNotifications = []
      }
    },

    async fetchReviewNotifications(user) {
      try {
        // Récupérer d'abord les formations de l'utilisateur connecté
        const { data: userFormations, error: formationsError } = await supabase
          .from('formations')
          .select('id, title')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (formationsError) {
          console.error('Erreur lors du chargement des formations:', formationsError)
          return
        }

        if (!userFormations || userFormations.length === 0) {
          this.reviewNotifications = []
          return
        }

        const formationIds = userFormations.map(formation => formation.id)

        // Récupérer les avis récents sur ces formations (excluant l'auteur des formations)
        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select('id, formation_id, user_id, rating, created_at')
          .in('formation_id', formationIds)
          .neq('user_id', user.id) // Exclure les avis de l'utilisateur sur ses propres formations
          .order('created_at', { ascending: false })

        if (reviewsError) {
          console.error('Erreur lors du chargement des avis:', reviewsError)
          return
        }

        if (!reviews || reviews.length === 0) {
          this.reviewNotifications = []
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
        this.reviewNotifications = reviews.map(review => ({
          id: `review-${review.id}`,
          type: 'review',
          name: profilesMap[review.user_id]?.username || 'Utilisateur',
          avatar_url: profilesMap[review.user_id]?.avatar_url || null,
          rating: review.rating,
          formationTitle: formationsMap[review.formation_id]?.title || 'Formation inconnue',
          date: review.created_at
        }))

      } catch (error) {
        console.error('Erreur lors du chargement des notifications d\'avis:', error)
        this.reviewNotifications = []
      }
    },

    combineNotifications() {
      // Combiner réactions et avis, puis trier par date
      const allNotifs = [
        ...this.reactionNotifications,
        ...this.reviewNotifications
      ].sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateB - dateA // Plus récent en premier
      })
      
      this.notifications = allNotifs
    },

    timeAgo(dateStr) {
      const now = new Date()
      const date = new Date(dateStr)
      const diff = Math.floor((now - date) / 1000)
      if (diff < 60) return `il y a ${diff} secondes`
      if (diff < 3600) return `il y a ${Math.floor(diff/60)} minutes`
      if (diff < 86400) return `il y a ${Math.floor(diff/3600)} heures`
      return `il y a ${Math.floor(diff/86400)} jours`
    }
  }
}
</script>

<style scoped>
.notifications-page {
  padding: 1.75rem;
}

.notifications-container {
  max-width: 1000px;
  margin: 0 auto;
}

/* Header */
.page-header {
  margin-bottom: 1.75rem;
}

.page-title {
  font-size: 1.625rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

/* Sections */
.notifications-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1.25rem 0;
}

/* Liste des notifications */
.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.2s ease;
}

.notification-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.notification-item.new {
  border-color: #7376FF;
  background: #fefeff;
}

.notification-avatar {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #d1d5db;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
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
  border-radius: 50%;
}

.notification-info {
  flex: 1;
}

.notification-content {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
}

.emoji {
  font-size: 1.125rem;
  margin: 0 0.25rem;
}

.rating {
  font-weight: 600;
  color: #f59e0b;
  margin: 0 0.25rem;
}

.formation-title {
  font-weight: 600;
  color: #7376ff;
}

.notification-time {
  font-size: 0.8125rem;
  color: #9ca3af;
}

.notification-indicator {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.new-badge {
  width: 8px;
  height: 8px;
  background: #7376FF;
  border-radius: 50%;
}

/* États vides */
.empty-section {
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
}

.empty-icon {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.empty-icon img {
  width: 60px;
  height: 60px;
  opacity: 0.6;
}

.empty-message {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

/* État de chargement */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
}

.loader {
  border: 3px solid #f3f4f6;
  border-top-color: #7376FF;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-message {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .notifications-page {
    padding: 1.25rem;
  }
  
  .notifications-container {
    padding: 1rem;
  }
  
  .notification-item {
    padding: 1rem;
  }
  
  .notification-avatar {
    width: 40px;
    height: 40px;
  }
  
  .avatar-placeholder {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.375rem;
  }
  
  .section-title {
    font-size: 1.125rem;
  }
  
  .notification-content {
    font-size: 0.875rem;
  }
}
</style>