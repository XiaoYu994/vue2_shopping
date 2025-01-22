/* 封装axios用于发送请求 */
import axios from 'axios'
import store from '@/store'
import { Toast } from 'vant'

// 创建一个新的axios实例
const request = axios.create({
  baseURL: 'https://smart-shop.itheima.net/index.php?s=/api',
  timeout: 5000,
  headers: { platform: 'h5' }
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 改变全局状态
  store.commit('setLoading', true)
  // 发送请求前检测有没有token 有就携带token到请求头
  const token = store.getters.token
  if (token) {
    config.headers['Access-Token'] = token
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  store.commit('setLoading', false)
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么 这里返回response.data的话相当扒了一层
  store.commit('setLoading', false)
  const res = response.data
  if (res.status !== 200) {
    console.log('状态码错误')
    Toast(res.message)
    return Promise.reject(res.message)
  }
  return res
}, function (error) {
  // 对响应错误做点什么
  store.commit('setLoading', false)
  Toast.fail(error.response?.data?.message || '服务器异常')
  return Promise.reject(error)
})

export default request
