import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import insert from '@/components/insert'
Vue.use(Router)

var router = new Router({
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
router.beforeEach(function (to, from, next) {
  var auth = false
  if (!auth && to.name !== 'login') {
    next({name: 'login'})
  } else if (to.name === 'login' && auth) {
    next({name: 'insert'})
  } else {
    next()
  }
})
export default router
