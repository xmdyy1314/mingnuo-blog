//管理员端的路由配置
const adminRoutes = [
  {
    path: '/admin',
    name: 'adminView',
    component: () => import('@/views/admin/adminLayout.vue'),
  },
]

export default adminRoutes
