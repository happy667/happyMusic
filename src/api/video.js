import request from '@/axios/request.js'
export default {
  // 获取推荐视频
  getRecommendVideo(limit = 3) {
    const url = `/mv/first?limit=${limit}`
    return request({
      url
    })
  },
  // 获取推荐视频路径
  getRecommendVideoUrl(id) {
    const url = `/mv/url?id=${id}`
    return request({
      url
    })
  }

}
