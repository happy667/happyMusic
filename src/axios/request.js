import axios from 'axios'
import * as Message from 'autoprefixer' // 路由配置文件

const ENV = process.env.NODE_ENV

// 创建axios实例
const service = axios.create({
  // baseURL:"http://novel.juhe.im/",代理服务器请求接口地址
  timeout: 10000,
  method: 'get',
  withCredentials: true
})
// 配置请求根路径
service.defaults.baseURL = ' http://localhost:3000'
// request 请求收到后 拦截器设置
service.interceptors.response.use(
  response => {
    if (response) {
      switch (response.status) {
        case 200:
          break

        default:
          Message.error(response.data.data.msg ? response.data.data.msg : '返回状态非200')
      }
      return response
    } else {
      Message.error('响应成功，但是响应信息不存在！')
    }
  },
  error => {
    Message.error(ENV === 'development' ? error.message : '请求错误！')
    return Promise.reject(error.response.data) // 返回接口返回的错误信息
  })

export default service
