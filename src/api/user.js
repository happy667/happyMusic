import request from '@/axios/request.js'
export default {
  // 获取用户喜欢歌曲列表
  getUserLikeList(uid) {
    const url = `/likelist?uid=${uid}&timestamp=${new Date().getTime()}`
    return request({
      url
    })
  },
  // 喜欢音乐
  likeMusic(id, like) {
    const url = `/like?id=${id}&like=${like}&timestamp=${new Date().getTime()}`
    return request({
      url
    })
  },
  // 获取用户关注的歌手
  getUserFollowSinger() {
    const url = `/artist/sublist`
    return request({
      url
    })
  },
  // 获取用户播放记录
  getUserPlayRecord(uid) {
    const url = `/user/record?uid=${uid}&type=1`
    return request({
      url
    })
  }

}
