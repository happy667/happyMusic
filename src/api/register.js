import request from '@/axios/request.js'
export default {
  // 注册或修改
  register(form) {
    const url = `/register/cellphone?timestamp=${new Date().getTime()}`
    return request.post(url, {
      phone: form.phone,
      password: form.password,
      captcha: form.captcha,
      nickname: form.nickname
    })
  },
  // 发送验证码
  sendSms(phone) {
    const url = `/captcha/sent`
    return request.post(url, {
      phone
    })
  },
  // 验证验证码
  checkSms(phone, captcha) {
    const url = `/captcha/verify?timestamp=${new Date().getTime()}`
    return request.post(url, {
      phone,
      captcha
    })
  },
  // 检查是否已经注册
  checkRegister(phone) {
    const url = `/cellphone/existence/check?timestamp=${new Date().getTime()}`
    return request.post(url, {
      phone
    })
  }
}
