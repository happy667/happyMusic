import request from '@/axios/request.js'
export default {
  // 获取推荐视频
  getRecommendVideo(offset = 0, limit = 3) {
    const url = `/mv/all?offset=${offset}&limit=${limit}`
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
  },
  getVideoComment(id, offset = 0) {
    let url = `comment/mv?id=${id}&offset=${offset}`
    return request({
      url
    })
  }

}
