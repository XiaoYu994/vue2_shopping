import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { Toast } from 'vant'
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
      component: () => import('@/views/search/index.vue')
    },
    {
      path: '/searchlist',
      component: () => import('@/views/search/searchList.vue')
    },
    {
      path: '/detail/:id',
      component: () => import('@/views/prodetail/index.vue')
    },
    {
      path: '/comments',
      component: () => import('@/views/comments/index.vue')
    },
    {
      path: '/pay',
      component: () => import('@/views/pay/index.vue')
    }
  ]
})
// 不能访问的页面
const authUrl = ['/pay', '/order']
// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 通过vuex 获取用户是否登录
  const token = store.getters.token
  // 如果访问登录页
  if (to.path === '/login') {
    if (token) {
      // 已登录，直接跳转首页
      next('/')
    } else {
      next()
    }
    return
  }

  if (!authUrl.includes(to.path)) {
    next()
    return
  }
  if (token) {
    next()
  } else {
    Toast('请先登录')
    next({
      path: '/login',
      query: { backUrl: to.fullPath }
    })
  }
})
export default router
