import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'

import Dashboard from '@/components/Dashboard'
import DashboardHome from '@/pages/Home'
import Actividad01 from '@/pages/Actividad01'
import Actividad02 from '@/pages/Actividad02'

import store from './store'

import '@/assets/css/tailwind.css'


Vue.config.productionTip = false

Vue.use(Router)

const routes = [
  { path: '/', redirect: { name: 'DashboardHome' } },
  { path: '/dashboard', component: Dashboard, children: [
      { path: '/', redirect: { name: 'DashboardHome' } },
      { path: 'home', name: 'DashboardHome', component: DashboardHome },
      { path: 'actividad01', name: 'Actividad01', component: Actividad01 },
      { path: 'actividad02', name: 'Actividad02', component: Actividad02 }
    ]
  },
  { path: '/actividad01', redirect: '/' },
  { path: '/actividad02', redirect: '/' }
]

const router = new Router({
  mode: 'history',
  routes
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

