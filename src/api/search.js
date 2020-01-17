import request from '@/axios/request.js'
export default {
  // 获取默认搜索关键词
  getSearchDefault() {
    const url = '/search/default'
    return request({
      url
    })
  },
  // 获取热门搜索
  getHotSearchList() {
    const url = 'search/hot/detail'
    return request({
      url
    })
  },
  // 获取搜索结果
  getSearchResult(keywords, type, offset, limit) {
    const url = `/search?keywords=${keywords}&offset=${offset}&limit=${limit}&type=${type}`
    return request({
      url
    })
  }

}
