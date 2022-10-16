import request from '@/axios/request.js'
export default {
    // 根据id获取排行榜
    getRankingListById(idx) {
        const url = `/playlist/detail?id=${idx}`
        return request({
            url
        })
    },
    // 获取排行榜榜单
    getRankingTopList() {
        const url = `/toplist`
        return request({
            url
        })
    }
}