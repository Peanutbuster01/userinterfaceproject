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
      path: '/poll/:id',
      name: 'PollView',
      component: () => import('../views/PollViewLegacy.vue')
    },
    {
      path: '/lobby/:id',
      name: 'LobbyView',
      component: () => import('../views/LobbyViewLegacy.vue')
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
      path: '/result/:id',

      name: 'ResultView',
      component: () => import('../views/ResultViewLegacy.vue')
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
    }


  ]
})

export default router
