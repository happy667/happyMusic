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
    loginStatus(cookie = '') {
        const url = `login/status`
        return request.post(url, {
            cookie
        })
    },
    // 退出登录
    logout() {
        const url = `/logout?timestamp=${new Date().getTime()}`
        return request({
            url
        })
    },
    //生成二维码key
    createQRKey() {
        const url = `/login/qr/key?timestamp=${new Date().getTime()}`
        return request.post(url, {
            noCookie: true
        })
    },
    //二维码生成
    createQR(key) {
        const url = `/login/qr/create?timestamp=${new Date().getTime()}`
        return request.post(url, {
            key,
            qrimg: true,
            noCookie: true
        })
    },
    checkQR(key) {
        const url = `/login/qr/check?timestamp=${new Date().getTime()}`
        return request.post(url, {
            key,
            noCookie: true
        })
    }
}