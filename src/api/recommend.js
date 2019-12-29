import request from '@/axios/request.js'
let apiUrl = '/api'
export default {
  // 获取推荐页轮播图
  getBanner() {
    const url = apiUrl + '/banner?type=0'
    return request({
      url
    })
  }
}
