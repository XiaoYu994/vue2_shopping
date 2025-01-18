import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/home',
      children: [{
        path: '/user',
        component: () => import('@/views/layout/user.vue')
      },
      {
        path: '/cart',
        component: () => import('@/views/layout/cart.vue')
      },
      {
        path: '/category',
        component: () => import('@/views/layout/category.vue')
      },
      {
        path: '/home',
        component: () => import('@/views/layout/home.vue')
      }

      ]
    },
    {
      path: '/login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/order',
      component: () => import('@/views/order/index.vue')
    },
    {
      path: '/search',
      component: () => import('@/views/order/index.vue')
    },
    {
      path: '/detail/ :id',
      component: () => import('@/views/prodetail/index.vue')
    },
    {
      path: '/pay',
      component: () => import('@/views/pay/index.vue')
    }
  ]
})

export default router
