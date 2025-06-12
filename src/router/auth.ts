const authRoutes = [
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
        path: 'index',
        component: () => import('@/views/homeView/indexView.vue'),
        name: 'indexView',
      },
      {
        path: '/profile/:userId',
        name: 'profileView',
        component: () => import('@/views/profileView/profileView.vue'),
      },
      {
        path: 'article/detail/:id',
        component: () => import('@/components/article/detailArticleView.vue'),
        name: 'detailArticle',
      },
      {
        path: 'articles',
        component: () => import('@/views/articlesView/articlesView.vue'),
        name: 'articlesList',
      },
    ],
  },
]

export default authRoutes
