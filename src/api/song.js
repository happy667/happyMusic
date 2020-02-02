import request from '@/axios/request.js'
export default {
  // 获取音乐是否可用
  checkMusic(id) {
    const url = `/check/music?id=${id}`
    return request({
      url
    })
  },
  // 获取音乐播放路径
  getMusicUrl(id) {
    const url = `/song/url?id=${id}`
    return request({
      url
    })
  },
  // 获取歌曲详情
  getSongDetail(ids) {
    const url = `/song/detail?ids=${ids}`
    return request({
      url
    })
  },
  // 获取歌曲评论
  getSongComment(id, offset = 0) {
    let url = `comment/music?id=${id}&offset=${offset}`
    return request({
      url
    })
  }
}
