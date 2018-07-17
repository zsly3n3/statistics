import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import insert from '@/components/insert'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'insert',
      component: insert
    },
    {
      path: '/login',
      name: 'login',
      component: login
    }
  ]
})
