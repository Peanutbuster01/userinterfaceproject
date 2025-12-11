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
      path: '/lobby/:id',
      name: 'LobbyViewLegacy',
      component: () => import('../views/LobbyViewLegacy.vue')
    },
    {
      path: '/create/',
      name: 'CreateViewLegacy',
      component: () => import('../views/CreateViewLegacy.vue')
    },
    {
      path: '/result/:id',
      name: 'ResultViewLegacy',
      component: () => import('../views/ResultViewLegacy.vue')
    },
    {
      path: '/join/',
      name: 'JoinView',
      component: () => import('../views/JoinView.vue')
    }
  ]
})

export default router
