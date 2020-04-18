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
  },
  // 获取歌手单曲
  getSingerSong(id) {
    const url = `/artists?id=${id}&timestamp=${new Date().getTime()}`
    return request({
      url
    })
  },
  // 获取歌手专辑
  getSingerAlbum(id, offset, limit = 9) {
    const url = `/artist/album?id=${id}&offset=${offset}&limit=${limit}&timestamp=${new Date().getTime()}`
    return request({
      url
    })
  },
  // 获取歌手专辑详情
  getAlbumInfo(id) {
    const url = `/album?id=${id}`
    return request({
      url
    })
  },
  // 获取歌手详情
  getSingerDetail(id) {
    const url = `/artist/desc?id=${id}`
    return request({
      url
    })
  },
  getSinger(id) {
    const url = `/artists?id=${id}`
    return request({
      url
    })
  },
  // 获取歌手mv
  getSingerMV(id, offset = 0, limit = 26) {
    const url = `/artist/mv?id=${id}&offset=${offset}&limit=${limit}&timestamp=${new Date().getTime()}`
    return request({
      url
    })
  },
  // 获取相似歌手
  getSimilarSinger(id) {
    const url = `/simi/artist?id=${id}`
    return request({
      url
    })
  },
  // 获取专辑内容
  getSingerAlbumDetail(id) {
    const url = `/album?id=${id}`
    return request({
      url
    })
  },
  getAlbumComment(id, offset = 0) {
    const url = `/comment/album?id=${id}&offset=${offset}`
    return request({
      url
    })
  }
}
