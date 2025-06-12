import request from '@/utils/request'
import { nl } from 'element-plus/es/locales.mjs'

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
