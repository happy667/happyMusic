import request from '@/axios/request.js'
export default {
  // 获取推荐页轮播图
  getBanner() {
    const url = '/banner?type=0'
    return request({
      url
    })
  },
  // 获取精品歌单推荐
  getSongSheet(type = '全部', limit = 20) {
    const url = `/top/playlist/highquality?cat=${type}&limit=${limit}`
    return request({
      url
    })
  },
  // 根据id获取歌单详情
  getSongSheetById(id) {
    const url = `/playlist/detail?id=${id}`
    return request({
      url
    })
  }
  // 获取音乐详情
  // getSongInfo(){
  //   song/detail
  // }
}
