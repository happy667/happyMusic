import axios from 'axios'
import Vue from 'vue'
import apiConfig from './api.config.js'

// 创建axios实例
const service = axios.create({
        timeout: 10000,
        method: 'get',
        withCredentials: true
    })
    // 配置请求根路径
service.defaults.baseURL = apiConfig.baseUrl
axios.defaults.withCredentials = true
    // request拦截器设置
service.interceptors.request.use(request => {
        // 判断是否连接网络,如果连接则发送请求，否则提示用户连接
        if (navigator.onLine) {
            return request
        } else {
            Vue.prototype.$toast('请连接网络后重试')
        }
    }, error => {
        console.log(error)
            // 对请求错误做些什么
        return Promise.reject(error)
    })
    // response拦截器设置
service.interceptors.response.use(
    response => {
        console.log(response)
            // 错误信息处理
        if (!response.message && response.msg) {
            response.message = response.msg
        }
        switch (status) {
            case 500:
                response.message = '系统出错'
                break
        }
        return response
    },
    error => {
        console.log(error)
        let res = error.response
        let resData = res.data
        try {
            if (res) {
                let status = error.response.data.code
                    // 错误信息处理
                if (resData.msg && !resData.message) {
                    resData.message = resData.msg
                }
                switch (status) {
                    case 500:
                        resData.message = '系统出错'
                        break
                    case 408:
                        resData.message = '请求超时'
                        break
                    default:
                        resData.message = error.response.data.message ? error.response.data.message : '系统出错'
                        break
                }
                return Promise.reject(res) // 返回接口返回的错误信息
            } else {
                let resData = {
                    data: {
                        message: '加载超时'
                    }

                }
                return Promise.reject(resData) // 返回接口返回的错误信息
            }
        } catch (err) {
            console.log(err.response)
            resData.message = err.response.data.message | err.response.data.msg
        }
    })

export default service