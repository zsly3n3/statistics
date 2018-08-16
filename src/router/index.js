import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import gameid from '@/components/gameid'
import insert from '@/components/insert'
import global from '@/components/Global'
Vue.prototype.global = global
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
    },
    {
      path: '/gameid',
      name: 'gameid',
      component: gameid
    }
  ]
})
router.beforeEach(function (to, from, next) {
  var levelKey = Vue.prototype.global.levelKey
  var auth = localStorage.getItem(levelKey)
  if (auth === null && to.name !== 'login') {
    next({name: 'login'})
  } else if (to.name === 'login' && auth !== null) {
    next({name: 'insert'})
  } else {
    next()
  }
})
export default router
