<template>
  <div class="privacy-sessions">
    <h2 class="section-title">Session en cours</h2>
    <div v-if="currentSession" class="session-card">
      <div class="session-info">
        <span class="browser">{{ currentSession.browser }}</span>
        <span class="city">{{ currentSession.city }}, {{ currentSession.country }}</span>
        <span class="date">{{ formatDate(currentSession.login_at) }}</span>
        <span class="active">Actif en ce moment</span>
      </div>
    </div>
    <h2 class="section-title">Dernières sessions</h2>
    <div v-for="session in pastSessions" :key="session.id" class="session-card">
      <div class="session-info">
        <span class="browser">{{ session.browser }}</span>
        <span class="city">{{ session.city }}, {{ session.country }}</span>
        <span class="date">{{ formatDate(session.login_at) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase'

export default {
  data() {
    return {
      sessions: [],
      user: null
    }
  },
  async created() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = '/login';
      return;
    }
    this.user = session.user;
    await this.fetchSessions();
  },
  methods: {
    async fetchSessions() {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', this.user.id)
        .order('login_at', { ascending: false });
      if (!error) {
        this.sessions = data || [];
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleString('fr-FR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    }
  },
  computed: {
    currentSession() {
      return this.sessions.length > 0 ? this.sessions[0] : null;
    },
    pastSessions() {
      return this.sessions.slice(1, 5); 
    }
  }
}
</script>

<style scoped>
.privacy-sessions {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #7376FF;
  margin-bottom: 12px;
  font-family: 'Nunito', sans-serif;
}

.session-card {
  background: #f8f8fa;
  border-radius: 14px;
  padding: 14px 18px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08); /* comme input */
}

.session-info {
  display: flex;
  gap: 24px;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
}

.browser {
  font-weight: 700;
  color: #222;
  font-size: 0.95rem;
}

.city {
  color: #666;
  font-weight: 600;
  font-size: 0.9rem;
}

.date {
  color: #444;
  font-weight: 700;
  font-size: 0.9rem;
}

.active {
  color: #1976d2;
  font-weight: 700;
  margin-left: auto;
  font-size: 0.9rem;
}
</style>
