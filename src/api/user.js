import request from "@/axios/request.js";
export default {
    // 获取用户详情
    getUserDetail(uid) {
        console.log(2222)
        const url = `/user/detail?uid=${uid}&timestamp=${new Date().getTime()}`;
        return request({
            method: 'get',
            url
        })
    },
    // 获取用户喜欢歌曲列表
    getUserLikeList(uid) {
        const url = `/likelist?timestamp=${new Date().getTime()}`;
        return request.post(url, {
            uid
        });
    },
    // 喜欢音乐
    likeMusic(id, like) {
        const url = `/like?id=${id}&like=${like}&timestamp=${new Date().getTime()}`;
        return request.get(url);
    },
    // 获取用户关注的歌手
    getUserFollowSinger() {
        const url = `/artist/sublist?timestamp=${new Date().getTime()}`;
        return request.post(url);
    },
    // 关注/取消关注歌手
    updateFollowSinger(id, t) {
        const url = `/artist/sub?timestamp=${new Date().getTime()}`;
        return request.post(url, {
            id,
            t
        });
    },
    // 获取用户播放记录
    getUserPlayRecord(uid, type) {
        const url = `/user/record?uid=${uid}&type=${type}&timestamp=${new Date().getTime()}`;
        return request({
            url
        });
    },
    // 获取用户信息 , 歌单，收藏，mv, dj 数量
    getUserCount() {
        const url = `/user/subcount?timestamp=${new Date().getTime()}`;
        return request.post(url);
    },
    // 获取用户最近播放
    getUserRencent(typeName) {
        let url = `/record/recent/${typeName}?timestamp=${new Date().getTime()}`;
        if (typeName == 'song') {
            url = `/record/recent/${ typeName }?limit=300&timestamp=${new Date().getTime()}`
        }
        return request.post(url);
    },

    // 获取用户收藏的歌单
    getUserSongSheet(uid) {
        const url = `/user/playlist?timestamp=${new Date().getTime()}`;
        return request.post(url, {
            uid
        });
    },
    // 获取用户收藏的视频
    getUserVideo() {
        const url = `/mv/sublist?timestamp=${new Date().getTime()}`;
        return request.post(url);
    },

    // 收藏/取消关注歌单
    updateFollowSongSheet(id, t) {
        console.log(t)
        const url = `/playlist/subscribe?timestamp=${new Date().getTime()}`;
        return request.post(url, {
            id,
            t
        });
    },
    // 获取用户收藏的专辑
    getUserAlbum() {
        const url = `/album/sublist?timestamp=${new Date().getTime()}`;
        return request.post(url);
    },
    // 收藏/取消关注专辑
    updateFollowAlbum(id, t) {
        const url = `/album/sub?timestamp=${new Date().getTime()}`;
        return request.post(url, {
            id,
            t
        });
    },
    // 收藏/取消关注视频
    updateFollowVideo(mvid, t) {
        const url = `/mv/sub?timestamp=${new Date().getTime()}`;
        return request.post(url, {
            mvid,
            t
        });
    },
    // 更改用户信息
    updateUserInfo(user) {
        const url = `/user/update?timestamp=${new Date().getTime()}`;
        return request.post(url, {
            gender: user.gender,
            birthday: user.birthday,
            nickname: user.nickname,
            province: user.province,
            city: user.city,
            signature: user.signature
        });
    },
    // 资源点赞(MV,电台,视频点赞)
    resourceLike({ id, type, t }) {
        const url = `/resource/like?timestamp=${new Date().getTime()}`;
        return request.post(url, {
            id,
            type,
            t
        });
    }
};