//管理员端的路由配置
const adminRoutes = [
  {
    path: '/admin',
    name: 'adminView',
    component: () => import('@/views/admin/adminLayout.vue'),
    //admin是主路由
    children: [
      {
        path: 'blog/pending',
        name: 'blogPendingView',
        component: () => import('@/views/admin/blogManagement/pendingView.vue'),
      },
    ],
  },
]

export default adminRoutes
