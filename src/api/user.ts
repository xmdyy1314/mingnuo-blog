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
