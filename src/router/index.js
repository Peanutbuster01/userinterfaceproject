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
  ]
})

export default router
