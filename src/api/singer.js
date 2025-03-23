import request from '@/axios/request.js'
export default {
    // 获取歌手列表
    getSingerList({
        type,
        area,
        initial,
        offset = 0,
        limit = 20
    }) {
        let url = `/artist/list?type=${type}&area=${area}&offset=${offset}&limit=${limit}`
        if (initial) {
            url = `/artist/list?type=${type}&area=${area}&initial=${initial}&offset=${offset}&limit=${limit}`
        }
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
    // 获取歌手描述
    getSingerDesc(id) {
        const url = `/artist/desc?id=${id}`
        return request({
            url
        })
    },
    // 获取歌手详情
    getSingerDetail(id) {
        const url = `/artist/detail?id=${id}`
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
        const url = `/simi/artist?id=${id}&timestamp=${new Date().getTime()}`
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
    // 获取专辑评论
    getAlbumComment(id, offset = 0) {
        const url = `/comment/album?id=${id}&offset=${offset}&timestamp=${new Date().getTime()}`
        return request({
            url
        })
    },

    // 获取歌手关注信息
    getSingerFollow(id) {
        const url = `/artist/follow/count?id=${id}&timestamp=${new Date().getTime()}`
        return request({
            url
        })
    }
}