import request from '@/axios/request.js'
export default {
  // 获取推荐视频
  getRecommendVideo(offset) {
    const url = `/top/mv?limit=6&offset=${offset}`
    return request({
      url
    })
  },
  // 获取视频路径
  getVideoUrl(id) {
    const url = `/mv/url?id=${id}`
    return request({
      url
    })
  },
  // 获取视频详情
  getVideoDetail(id) {
    const url = `/mv/detail?mvid=${id}&timestamp=${new Date().getTime()}`
    return request({
      url
    })
  },
  // 获取视频点赞数评论数
  getVideoDetailInfo(id) {
    const url = `/mv/detail/info?mvid=${id}&timestamp=${new Date().getTime()}`
    return request({
      url
    })
  },
  // 获取mv评论
  getVideoComment(id, offset = 0) {
    let url = `comment/mv?id=${id}&offset=${offset}&timestamp=${new Date().getTime()}`
    return request({
      url
    })
  },
  // 获取相似mv
  getSimiMV(id) {
    let url = `/simi/mv?mvid=${id}`
    return request({
      url
    })
  }

}
