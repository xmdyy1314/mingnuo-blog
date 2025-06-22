import request from '@/utils/request'

//获取博客的各个状态的数量
export const getBlogStatusCountServer = () => {
  return request.get('admin/blog-count')
}

//获取待审核列表信息
export const getBlogListByStatusServer = (
  status: string,
  page: number,
  title: string,
  username: string,
) => {
  return request.get(
    `admin/blog-list?status=${status}&page=${page}&title=${title}&username=${username}`,
  )
}

//根据id获取博客的详细信息 只有有博客的审核资格才可获取到
export const getBlogDetailByBlogidServer = (id: number) => {
  return request(`admin/${id}/blog-detail`)
}

//审核博客
export const auditBlogByIdServer = (blog_id: number, new_status: string, reason: string) => {
  return request.post('admin/blog-audit', { blog_id, new_status, reason })
}

//获取博客的审核列表
export const getBlogAuditHistoryServer = (blog_id: number) => {
  return request.get(`admin/blog-audit-history?blog_id=${blog_id}`)
}

//获取权限列表信息
export const getUsersPermissionsServer = (page: number) => {
  return request.get(`admin/users-permissions?page=${page}`)
}

//获取用户信息系表
export const getUserListServer = (page: number, page_size: number) => {
  return request.get(`admin/users-list?page=${page}&page_size=${page_size}`)
}

//获取角色列表
export const getRoleListServer = (page: number) => {
  return request.get(`admin/users-roles?page=${page}`)
}
