//与blog相关的一些代码请求

import request from '@/utils/request'

//发布博客
export const publishBlogServer = (
  title: string,
  summary: string,
  content: string,
  status: string,
  type: string,
) => {
  return request.post('blogs/publish-blog', { title, summary, content, status, type })
}

//根据博客的id来获取博客的详细信息
export const getBlogDetailByIdServer = (id: number) => {
  return request.get(`blogs/${id}`)
}

//获取评论列表
export const getBlogCommentsByIdServer = (id: number) => {
  return request.get(`blogs/${id}/comments`)
}
