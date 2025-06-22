//发送请求调用的地址
import axios from 'axios'
import { useUserInfoStore } from '@/stores'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL: 'http://127.0.0.1:8181/api', //本机的实验地址/
  // baseURL: 'http://api.blog.xmdbro.cn/api', //本机的实验地址/
  timeout: 10000, //十秒的响应时间
})

//请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const userStore = useUserInfoStore()
    //如果有token，就将token也携带过去
    if (userStore.token) {
      //将token也携带过去
      config.headers['Authorization'] = `${userStore.token}`
    }
    return config
  },
  (err) => Promise.reject(err),
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response //将请求回来的数据返回出来
  },
  function (error) {
    console.log(error.response.status)

    // 对响应错误做点什么
    //如果token是一个过期的状态就把登录信息清空
    if (error.response.status === 401) {
      // 处理 401 错误，如 token 过期
      ElMessage.error('登录登录已过期，请重新登录！')
      // 清除本地存储的 token
      localStorage.removeItem('user')
      // 跳转到登录页面
      window.location.href = '/login'
    }
    return Promise.reject(error) //如果有错误，就抛出一个错误
  },
)

export default instance
