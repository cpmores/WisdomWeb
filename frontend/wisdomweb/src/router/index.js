import { createRouter, createWebHistory } from 'vue-router'
import PortalView from '../views/PortalView.vue'
import { checkAuthStatus } from '../services/api.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'portal',
      component: PortalView,
      meta: { requiresAuth: false }, // 门户页面不需要认证
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/MainView.vue'),
      meta: { requiresAuth: true }, // 需要登录才能访问
    },
    // 捕获所有未匹配的路由，重定向到门户页面
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// 路由守卫 - 检查登录状态
router.beforeEach((to, from, next) => {
  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    // 检查本地是否有JWT token
    const token = localStorage.getItem('auth_token')

    if (token) {
      // 有token，允许访问（实际验证由后端处理）
      next()
    } else {
      // 没有token，重定向到门户页面
      next('/')
    }
  } else {
    // 不需要认证的路由，直接通过
    next()
  }
})

export default router
