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
      return this.sessions.slice(1, 5); // Affiche les 4 dernières
    }
  }
}
</script>

<style scoped>
.privacy-sessions {
  /* background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07); */
  padding: 32px 28px;
  max-width: 900px;
  margin: 0 auto;
}
.section-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #7376FF;
  margin-bottom: 24px;
  font-family: 'Nunito', sans-serif;
}
.session-card {
  background: #f8f8fa;
  border-radius: 18px;
  padding: 18px 24px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.session-info {
  display: flex;
  gap: 32px;
  align-items: center;
  width: 100%;
}
.browser {
  font-weight: 700;
  color: #222;
}
.city {
  color: #888;
  font-weight: 600;
}
.date {
  color: #444;
  font-weight: 700;
}
.active {
  color: #1976d2;
  font-weight: 700;
  margin-left: auto;
}
</style>