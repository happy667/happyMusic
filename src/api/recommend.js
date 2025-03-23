import request from '@/axios/request.js'
export default {
    // 获取推荐页轮播图
    getBanner() {
        const url = '/banner?type=0'
        return request({
            url
        })
    },
    // 获取推荐歌单
    getRecommendSongSheet(limit = 30) {
        const url = `/personalized?limit=${limit}`
        return request({
            url
        })
    },
    // 推荐新音乐
    getRecommendNewSong() {
        const url = '/personalized/newsong'
        return request({
            url
        })
    },
    // 获取推荐新碟上架
    getRecommendNewAlbum() {
        const url = `/album/newest`
        return request({
            url
        })
    },
    // 获取推荐歌单分类列表
    getSongSheetCatList() {
        const url = '/playlist/hot'
        return request({
            url
        })
    },
    // 根据歌单类型获取歌单
    getSongSheet(type = '全部', limit = 20) {
        const url = `/top/playlist/highquality?cat=${type}&limit=${limit}`
        return request({
            url
        })
    },
    // 根据id获取歌单详情
    getSongSheetById(id) {
        const url = `/playlist/detail?id=${id}&timestamp=${new Date().getTime()}`
        return request({
            url
        })
    },
    // 获取歌单评论
    getSongSheetComment(id, offset = 0) {
        let url = `comment/playlist?id=${id}&offset=${offset}&timestamp=${new Date().getTime()}`
        return request({
            url
        })
    },
    // 根据id获取音乐url
    getSongUrl(ids) {
        const url = `/song/url?id=${ids}`
        return request({
            url
        })
    }
}