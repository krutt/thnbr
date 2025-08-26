/* ~~/src/main.js */

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'
import './assets/styles.css'

/* routes */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
  ],
})

/* stores */
const pinia = createPinia()

createApp(App).use(pinia).use(router).mount('#app')
