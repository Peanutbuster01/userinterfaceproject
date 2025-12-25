import { createRouter, createWebHistory } from 'vue-router'
import StartView from '../views/StartView.vue'
import CreateView from '../views/CreateView.vue'
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
    },

    
    {
      path: '/join/:id',
      name: 'JoinView',
      component: () => import('../views/JoinView.vue')
    },

    {
      path: '/game/:id/:playerId',
      name: 'GameView',
      component: () => import('../views/GameView.vue')
    },
    
    {
      path: '/observe/:id',
      name: 'ObserverView',
      component: () => import('../views/ObserverView.vue')
    }


  ]
})

export default router
