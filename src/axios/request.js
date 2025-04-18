import axios from 'axios'
import Vue from 'vue'
import apiConfig from './api.config.js'
import {
    USER_TOKEN
} from '@/assets/common/js/config.js'
import {
    getItem
} from 'common/js/localStorage.js'
// 创建axios实例
const service = axios.create({
        timeout: 15000,
        method: 'get',
        withCredentials: true
    })
    // 配置请求根路径
service.defaults.baseURL = apiConfig.baseUrl
axios.defaults.withCredentials = true
    // request拦截器设置
service.interceptors.request.use(request => {
        //携带cookie
        // 检查是否需要携带 Cookie
        if (!(request.params && request.params.noCookie) && getItem(USER_TOKEN) !== null) {
            // 初始化 params 对象（如果不存在）
            if (!request.params) {
                request.params = {};
            }

            // 添加 cookie 参数
            const cookieValue = getItem(USER_TOKEN);
            request.params.cookie = `${encodeURIComponent(cookieValue)}`;
        }
        // 判断是否连接网络,如果连接则发送请求，否则提示用户连接
        if (navigator.onLine) {
            return request
        } else {
            Vue.prototype.$toast('请连接网络后重试')
        }
    }, error => {
        // 对请求错误做些什么
        return Promise.reject(error)
    })
    // response拦截器设置
service.interceptors.response.use(
    response => {
        response.data.message = response.data.message || response.data.msg || response.message || response.msg
        return response
    },
    error => {
        let res = error.response
        if (res) {
            let resData = res.data ? res.data : {}
            try {
                if (res) {
                    let status = error.response.data ? error.response.data.code : error.response.code
                        // 错误信息处理
                    if (resData.msg && !resData.message) {
                        resData.message = resData.msg
                    }
                    switch (status) {
                        case 301:
                            resData.message = '未登录'
                            break
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
                console.log(err)
                resData.message = error.response.data.message ? error.response.data.message : '系统出错'
            }
        }

    })

export default service