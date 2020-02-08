import request from '@/axios/request.js'
export default {
  // 获取用户详情
  getUserDetail(uid) {
    const url = `/user/detail?uid=${uid}`
    return request({
      url
    })
  },
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
    const url = `/artist/sublist?timestamp=${new Date().getTime()}`
    return request({
      url
    })
  },
  // 关注/取消关注歌手
  updateFollow(id, t) {
    const url = `/artist/sub?id=${id}&t=${t}&timestamp=${new Date().getTime()}`
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
  },
  // 获取用户信息 , 歌单，收藏，mv, dj 数量
  getUserCount() {
    const url = `/user/subcount`
    return request({
      url
    })
  }

}
