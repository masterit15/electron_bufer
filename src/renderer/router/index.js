import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Главная',
      component: require('@/view/Home').default,
      meta: {
        layout: 'main',
        requiresAuth: true
      }
    },
    {
      path: '/auth',
      name: 'Авторизация',
      component: require('@/view/Auth').default,
      meta: {
        layout: 'empty',
        requiresGuest: true
      }
    },
    {
      path: '/lockscreen',
      name: 'Блокировка',
      component: require('@/view/LockScreen').default,
      meta: {
        layout: 'empty',
        requiresGuest: true
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)){
    if (!localStorage.getItem('user')){
      // делаем редирект на страницу авторизации
      next('/auth')
    }else{
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)){
    if (localStorage.getItem('user')) {
      // делаем редирект на главную страницу
      next('/')
    } else {
      next()
    }
  }else{
    next()
  }
})

export default router