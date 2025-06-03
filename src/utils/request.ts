//发送请求调用的地址
import axios from 'axios'
import { useUserInfoStore } from '@/stores'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL: 'http://127.0.0.1:8080/api', //本机的实验地址/
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
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response //将请求回来的数据返回出来
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error) //如果有错误，就抛出一个错误
  },
)

export default instance
