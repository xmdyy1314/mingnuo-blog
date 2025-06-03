import { createRouter, createWebHistory } from 'vue-router'
import { useUserInfoStore } from '@/stores/modules/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/activate/:code', //激活页面
      name: 'authActiveView',
      component: () => import('@/views/activeAuth/activeView.vue'),
    },
    {
      path: '/login', //登录页面
      name: 'loginView',
      component: () => import('@/views/loginRegister/loginView.vue'),
    },
    {
      path: '/profile/:userId',
      name: 'profileView',
      component: () => import('@/views/profileView/profileView.vue'),
    },
    {
      path: '/article/edit',
      name: 'editArticleView',
      component: () => import('@/views/editArticle.vue/editArticle.vue'),
    },
    {
      path: '/',
      component: () => import('@/views/layout/layoutView.vue'),
      redirect: '/index',
      children: [
        {
          path: '/index',
          component: () => import('@/views/homeView/indexView.vue'),
          name: 'indexView',
        },
        {
          path: '/article/:id',
          component: () => import('@/components/article/articleView.vue'),
          name: 'detailArticle',
        },
        {
          path: '/articles',
          component: () => import('@/views/articlesView/articlesView.vue'),
          name: 'articlesList',
        },
      ],
    },
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
