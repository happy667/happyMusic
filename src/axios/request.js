import axios from 'axios'

// 创建axios实例
const service = axios.create({
  // baseURL:"http://novel.juhe.im/",代理服务器请求接口地址
  timeout: 10000,
  method: 'get',
  withCredentials: true
})
// 配置请求根路径
service.defaults.baseURL = ' http://120.77.183.150:3000'
// request 请求收到后 拦截器设置
service.interceptors.response.use(
  response => {
    if (response) {
      switch (response.status) {
        case 200:
          break
      }
      return response
    }
  },
  error => {
    return Promise.reject(error.response) // 返回接口返回的错误信息
  })

export default service
