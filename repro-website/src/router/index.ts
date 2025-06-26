import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase.ts'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import Notifications from '../components/Notifications.vue'
import Profile from '../components/Profile.vue'
import Statistics from '../components/Statistics.vue'
import Affiliates from '../components/Affiliates.vue'
import Privacy from '../components/Privacy.vue'
import Verification from '../components/Verification.vue'
import Settings from '../components/Settings.vue'
import Transactions from '../components/Transactions.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/formations',
      name: 'formations',
      component: () => import('../views/FormationsView.vue'),
    },
    {
      path: '/formations/edit/:id',
      name: 'edit-formation',
      component: () => import('../views/EditFormationView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/formations/wizard',
      name: 'add-formation',
      component: () => import('../views/AjouterFormationWizard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      component: ProfileView,
      children: [
        { path: '', component: Profile },
        { path: 'notifications', component: Notifications },
        { path: 'profile', component: Profile },
        { path: 'statistics', component: Statistics },
        { path: 'affiliates', component: Affiliates },
        { path: 'privacy', component: Privacy },
        { path: 'verification', component: Verification },
        { path: 'settings', component: Settings },
        { path: 'transactions', component: Transactions }
      ],
      meta: { requiresAuth: true }
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('../views/CommunityView.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      next({ name: 'login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router