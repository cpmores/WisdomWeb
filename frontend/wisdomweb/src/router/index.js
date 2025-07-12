import { createRouter, createWebHistory } from 'vue-router'
import PortalView from '../views/PortalView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'portal',
      component: PortalView,
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/MainView.vue'),
      meta: { requiresAuth: true }, // 需要登录才能访问
    },
  ],
})

// 路由守卫 - 检查登录状态
router.beforeEach((to, from, next) => {
  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    // 这里应该检查实际的登录状态
    // 暂时使用 localStorage 来模拟登录状态
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

    if (!isLoggedIn) {
      // 未登录，重定向到首页
      next('/')
    } else {
      // 已登录，允许访问
      next()
    }
  } else {
    // 不需要认证的路由，直接通过
    next()
  }
})

export default router
