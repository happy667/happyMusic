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
    /**
     *获取搜索结果
     * @param {关键词} keywords
     * @param {类型} type
     * @param {偏移量} offset
     * @param {限制} limit
     */
    getSearchResult(keywords, type = 1, offset = null, limit = null) {
        let url = `/cloudsearch?keywords=${keywords}&type=${type}`
        if (offset && limit) {
            url = `/cloudsearch?keywords=${keywords}&offset=${offset}&limit=${limit}&type=${type}`
        }
        return request({
            url
        })
    },
    // 获取所有搜索结果
    getSearchAll(keywords) {
        const url = `/search/suggest?keywords=${keywords}`
        return request({
            url
        })
    }

}