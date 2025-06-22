import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'

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
      {
        path: 'users',
        children: [
          {
            path: 'list',
            name: 'userListView',
            component: () => import('@/views/admin/userManagement/userList.vue'),
          },
          {
            path: 'permissions',
            name: 'permissionsView',
            component: () => import('@/views/admin/userManagement/permissionsView.vue'),
          },
          {
            path: 'roles',
            name: 'rolesView',
            component: () => import('@/views/admin/userManagement/rolesView.vue'),
          },
        ],
      },
    ],
  },
]

export default adminRoutes
