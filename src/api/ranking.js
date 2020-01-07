import request from '@/axios/request.js'
export default {
  // 根据id获取排行榜
  getRankingListById(idx) {
    const url = `/top/list?idx=${idx}`
    return request({
      url
    })
  }
}
