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
  return request.get(`blogs/detail/${id}`)
}

//根据页码与类型获取文章
export const getBlogByTypeServer = (page: number, type: string) => {
  return request.get('blogs/by-type', {
    params: {
      page: page,
      type: type,
    },
  })
}

//获取评论列表
export const getBlogCommentsByIdServer = (id: number) => {
  return request.get(`blogs/${id}/comments`)
}

//根据用户id获取用户的作品列表
export const getBlogListByUserIdServer = (id: number) => {
  return request.get(`blogs/${id}/blog-list`)
}
