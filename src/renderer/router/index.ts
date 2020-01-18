import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/renderer/components/index.vue')
    }
    // {
    //   path: '/online',
    //   name: 'Online',
    //   //  require('@/components/Online').default
    //   component: () => import('@/components/Online')
    // },
    // {
    //   path: '/settings',
    //   name: 'Settings',
    //   component: require('@/components/Settings').default
    // }
  ]
})
