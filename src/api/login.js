import request from '@/axios/request.js'
export default {
  // 登录
  login(form) {
    const url = `/login/cellphone?timestamp=${new Date().getTime()}`
    return request.post(url, {
      phone: form.phone,
      password: form.password
    })
  }
}
