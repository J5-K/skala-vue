import { createRouter, createWebHistory } from 'vue-router'
import WeatherHomeView from '../views/WeatherHomeView.vue'

const routes = [
  {
    path: '/',
    name: 'weather-home',
    component: WeatherHomeView,
  },
  {
    path: '/about',
    name: 'weather-about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: '/city-search',
    name: 'weather-search',
    component: () => import('../views/WeatherSearchView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: '/tips',
    name: 'weather-tips',
    component: () => import('../views/WeatherTipsView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
