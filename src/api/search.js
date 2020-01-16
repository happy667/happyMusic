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
  getSearchResult(search) {
    const url = `/search?keywords=${search.keywords}&offset=${search.offset}&limit=${search.limit}&type=${search.type}`
    return request({
      url
    })
  }

}
