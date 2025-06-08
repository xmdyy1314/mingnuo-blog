import { createRouter, createWebHistory } from 'vue-router'
import { useUserInfoStore } from '@/stores/modules/user'

import authRoutes from './auth'
import adminRoutes from './admin'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    //博客系统的路由
    ...authRoutes,

    //管理员端的路由
    ...adminRoutes,
  ],
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  const userStroe = useUserInfoStore()

  // 需要登录但未登录
  if (to.meta.requiresAuth && !userStroe.token) {
    return next('/login')
  }

  // 检查权限
  if (to.meta.permissions) {
    // const hasPermission = to.meta.permissions.some((perm) => user.permissions.includes(perm))
    // if (!hasPermission) {
    //   return next('/403') // 无权限页面
    // }
  }

  next()
})

export default router
