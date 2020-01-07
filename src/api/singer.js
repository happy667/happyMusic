import request from '@/axios/request.js'
export default {
  // 获取歌手列表
  getSingerList() {
    const url = 'top/artists?limit=100'
    return request({
      url
    })
  },
  // 获取热门歌手列表
  getRecommendSingerList() {
    const url = '/top/artists?offset=0&limit=30'
    return request({
      url
    })
  }

}
