import request from '@/axios/request.js'
export default {
  // 登录
  login(form) {
    const url = `/login/cellphone?timestamp=${new Date().getTime()}`
    return request.post(url, {
      phone: form.phone,
      password: form.password
    })
  },
  // 获取登录状态
  loginStatus() {
    const url = `login/status?timestamp=${new Date().getTime()}`
    return request({
      url
    })
  },
  // 退出登录
  logout() {
    const url = `/logout?timestamp=${new Date().getTime()}`
    return request({
      url
    })
  }
}
