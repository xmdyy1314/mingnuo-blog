//与用户有关的一些请求

import request from '@/utils/request'

//用户的注册请求
export const registerAuthServer = (username: string, password: string, email: string) => {
  return request.post('auth/register', { username, password, email })
}

//用户的激活请求
export const activateAuthServer = (code: string, username: string) => {
  return request.post('auth/activate', { code, username })
}

//用户的登录请求
export const loginAuthServer = (username: string, password: string) => {
  return request.post('auth/login', { username, password })
}

//获取用户信息
export const getUserBaseInfoServer = (id: number) => {
  return request.get(`auth/get-info/${id}`)
}

//（非）收藏博客
export const collectBlogServer = (blog_id: number, action: string) => {
  return request.post('auth/collect-blog', { blog_id, action })
}

//点赞操作
export const agreeBlogOrCommentServer = (
  target_id: number,
  action: string,
  target_type: string,
) => {
  return request.post('auth/bc-like', { target_id, action, target_type })
}

//回复评论 或者 评论博客
export const respondCommentServer = (blog_id: number, parent_id: number, content: string) => {
  return request.post(`auth/${blog_id}/comments`, { parent_id, content })
}

//获取用户的收藏列表
export const getCollectionsByUserIdServer = (userid: number, page: number) => {
  return request.get(`auth/collect-list/${userid}?page=${page}`)
}
