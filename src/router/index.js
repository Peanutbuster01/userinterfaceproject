import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Start',
      component: StartView
    },
    {
      path: '/create/',
      name: 'CreateView',
      component: () => import('../views/CreateView.vue')
    },
    {
      path: '/lobby/',
      name: 'LobbyView',
      component: () => import('../views/LobbyView.vue')
    }
  ]
})

export default router
