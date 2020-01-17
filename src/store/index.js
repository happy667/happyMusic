import Vue from 'vue'
import Vuex from 'vuex'
import SongSheetDetail from '@/assets/common/js/songSheetDetail.js'
import recommendApi from '@/api/recommend.js'
import rankingApi from '@/api/ranking.js'
import singerApi from '@/api/singer.js'
import videoApi from '@/api/video.js'
import {
  ERR_OK
} from '@/api/config.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    homeCurrentIndex: 0,
    singerCurrentIndex: 0,
    rank: false, // 是否为排行
    recommendNewSong: [], // 推荐新音乐
    recommendNewSongSheet: [], // 新碟
    songSheetDisc: {}, // 歌单详情
    songSheetCagetory: [], // 歌单分类
    rankingList: [], // 榜单列表
    scrollIndex: 0, // 当前滑动的索引
    stop: false, // 是否停止滚动
    isScroll: false, // 是否是滚动状态
    singer: {}, // 歌手
    videoList: [], // mv列表
    videoOffset: 0, // mv列表偏移量
    selectVideo: {}, // 选择的mv
    oldVideo: {}, // 上一次的video
    videoCommentOffset: 0, // mv评论偏移量
    commentObj: {
      isMusician: false,
      comments: [],
      total: 0
    }, // 评论列表
    simiMVList: [], // 相似mv
    searchKeywords: '', // 搜索关键词
    searchCurrentIndex: 0 // 搜索页当前索引
  },
  mutations: {
    // 设置当前索引
    setHomeCurrentIndex(state, index) {
      state.homeCurrentIndex = index
    },
    // 设置字母表滚动索引
    setScrollIndex(state, index) {
      state.scrollIndex = index
    },
    // 设置rank
    setRank(state, rank) {
      state.rank = rank
      console.log(state.rank)
    },
    // 设置歌手信息页当前索引
    setSingerCurrentIndex(state, index) {
      state.singerCurrentIndex = index
    },
    // 设置滚动停止
    setStop(state, stop) {
      state.stop = stop
    },
    // 设置是否在滚动
    setIsScroll(state, isScroll) {
      state.isScroll = isScroll
    },
    // 设置推荐新音乐
    setRecommendNewSong(state, songList) {
      state.recommendNewSong = songList
      // console.log(state.recommendNewSong)
    },
    // 设置推荐新碟歌单
    setRecommendNewSongSheet(state, songSheet) {
      state.recommendNewSongSheet = songSheet
    },
    // 设置歌单详情
    setSongSheet(state, listObj) {
      state.songSheet.push(listObj)
    },
    // 设置歌单详情
    setSongSheetDisc(state, disc) {
      state.songSheetDisc = disc
    },
    // 设置歌单分类
    setSongSheetCagetory(state, songSheetCagetory) {
      state.songSheetCagetory = songSheetCagetory
    },
    // 设置歌单分类
    setRankingList(state, rankingList) {
      state.rankingList = rankingList
    },
    // 设置歌手
    setSinger(state, singer) {
      state.singer = singer
    },
    // 设置video列表偏移量
    setVideoOffset(state, offset) {
      state.videoOffset = offset
    },
    // 设置video列表
    setVideoList(state, list) {
      state.videoList = state.videoList.concat(list)
    },
    // 设置选择的video
    setSelectVideo(state, video) {
      // 重置state中的评论
      state.videoCommentOffset = 0
      state.commentObj = {
        isMusician: false,
        comments: [],
        total: 0
      } // 评论列表
      state.selectVideo = video
    },
    // 设置上次播放的video
    setOldVideo(state, video) {
      console.log(video)
      state.oldVideo = video
    },
    // 设置评论列表偏移量
    setVideoCommentOffset(state, offset) {
      state.videoCommentOffset = offset
    },
    // 设置评论对象
    setCommentObj(state, commentObj) {
      state.commentObj = commentObj
    },
    // 设置相似mv
    setSimiMVList(state, list) {
      state.simiMVList = list
    },
    // 设置搜索关键词
    setSearchKeywords(state, keywords) {
      state.searchKeywords = keywords
    },
    // 设置搜索页当前索引
    setSearchCurrentIndex(state, index) {
      state.searchCurrentIndex = index
    }
  },
  actions: {
    // 获取推荐歌单
    async getRecommendSongSheet(context, limit) {
      console.log(limit)
      const {
        data: res
      } = await recommendApi.getRecommendSongSheet(limit)
      if (res.code === ERR_OK) { // 成功获取推荐歌单
        // console.log(res)
        return res.result
      }
    },
    // 获取推荐新音乐
    async getRecommendNewSong(context) {
      const {
        data: res
      } = await recommendApi.getRecommendNewSong()
      if (res.code === ERR_OK) { // 成功获取推荐新音乐
        context.commit('setRecommendNewSong', res.result)
      }
    },
    // 获取推荐新碟
    async getRecommendNewSongSheet(context, params) {
      const {
        data: res
      } = await recommendApi.getRecommendNewSongSheet(params)
      if (res.code === ERR_OK) { // 成功获取推荐新碟
        context.commit('setRecommendNewSongSheet', res.albums)
      }
    },
    // 获取歌单分类
    async getSongSheetCatList(context) {
      const {
        data: res
      } = await recommendApi.getSongSheetCatList()
      if (res.code === ERR_OK) { // 成功获取歌单分类
        console.log(res)
        context.commit('setSongSheetCagetory', res.tags)
      }
    },
    // 根据参数获取歌单
    async getSongSheet(context, params) {
      const {
        data: res
      } = await recommendApi.getSongSheet(params.tag, params.limit)
      if (res.code === ERR_OK) { // 成功获取歌单数据
        return res
      }
    },
    // 根据id获取歌单列表
    async getSongSheetById(context, id) {
      // 先清空
      context.commit('setSongSheetDisc', {})
      const {
        data: res
      } = await recommendApi.getSongSheetById(id)
      if (res.code === ERR_OK) {
        context.commit('setSongSheetDisc', new SongSheetDetail({
          id: res.playlist.id,
          picUrl: res.playlist.coverImgUrl || res.playlist.backgroundCoverUrl,
          songs: res.playlist.tracks,
          name: res.playlist.name
        }))
      }
    },
    // 获取排行榜
    async getRankingList(context) {
      // 根据id获取对应排行榜,首先根据接口将排行榜进行分类
      // 分为官方榜，流行榜，推荐榜，其他榜
      const rankingListIds = {
        'official': [0, 1, 2, 3, 4], // 存放官方榜下所有排行榜id
        'recommend': [23, 25, 26, 31, 32, 17, 22], // 存放推荐榜榜下所有排行榜id
        'popular': [5, 14, 15, 27, 30, 24, 28], // 存放流行榜下所有排行榜id
        'other': [6, 7, 8, 9, 10, 11, 12, 13, 16, 19, 20, 21, 29, 33] // 存放其他榜下所有排行榜id
      }
      // 存放榜单列表
      const rankingList = []
      // 遍历标题
      for (let title in rankingListIds) {
        let rankingObj = {
          title,
          'rankingList': []
        }
        // 遍历标题下所有榜单
        for (let i = 0; i < rankingListIds[title].length; i++) {
          const {
            data: res
          } = await rankingApi.getRankingListById(rankingListIds[title][i])
          if (res.code === ERR_OK) {
            rankingObj.rankingList.push(res.playlist)
          }
        }
        rankingList.push(rankingObj)
      }
      context.commit('setRankingList', rankingList)
    },
    // 根据id获取歌手专辑详情
    async getSingerAlbumDetail(context, id) {
      // 先清空
      context.commit('setSongSheetDisc', {})
      const {
        data: res
      } = await singerApi.getSingerAlbumDetail(id)
      if (res.code === ERR_OK) {
        context.commit('setSongSheetDisc', new SongSheetDetail({
          id: res.album.id,
          picUrl: res.album.picUrl,
          songs: res.songs,
          name: res.album.name
        }))
      }
    },
    // 获取视频mv
    async getVideoList(context) {
      // 每次获取视频判断
      const videoListLen = this.state.videoList.length
      context.commit('setVideoOffset', videoListLen)
      const offset = this.state.videoOffset
      let videoList = await this.dispatch('getRecommendVideo', offset)
      // 使用settimeout异步的机制给videoList赋值
      await setTimeout(() => {
        context.commit('setVideoList', videoList)
      }, 20)
    },
    // 获取推荐视频
    async getRecommendVideo(context, offset) {
      const {
        data: res
      } = await videoApi.getRecommendVideo(offset)
      if (res.code === ERR_OK) {
        let videoList = res.data
        // 获取视频url
        videoList = await this.dispatch('getVideoUrl', videoList)
        // 获取歌手头像
        videoList = await this.dispatch('getSingerAvatar', videoList)
        return videoList
      }
    },
    // 获取视频url
    async getVideoUrl(context, videoList) {
      videoList.forEach(async (item) => {
        const {
          data: res
        } = await videoApi.getRecommendVideoUrl(item.id)
        if (res.code === ERR_OK) {
          item.videoUrl = res.data.url
        }
      })
      return videoList
    },
    // 获取歌手头像
    // 因为接口没有直接获取用户头像的所以借用获取歌手单曲来获取歌手头像
    async getSingerAvatar(context, videoList) {
      videoList.forEach(async (item) => {
        const {
          data: res2
        } = await singerApi.getSingerSong(item.artistId)
        if (res2.code === ERR_OK) {
          item.artist = res2.artist
        }
      })
      return videoList
    },
    // 获取该mv评论
    async getVideoComment(context) {
      const {
        data: res
      } = await videoApi.getVideoComment(this.state.selectVideo.id, this.state.videoCommentOffset)
      if (res.code === ERR_OK) {
        let comments = this.state.commentObj.comments.concat(res.comments)
        const commentObj = {
          comments,
          total: res.total
        }
        context.commit('setCommentObj', commentObj)
        context.commit('setVideoCommentOffset', this.state.commentObj.comments.length)
      }
    },
    // 获取相似mv
    async getSimiMV(context) {
      const {
        data: res
      } = await videoApi.getSimiMV(this.state.selectVideo.id)
      if (res.code === ERR_OK) {
        let videoList = res.mvs
        // 获取视频url
        await this.dispatch('getVideoUrl', videoList)
        // 获取歌手头像
        await this.dispatch('getSingerAvatar', videoList)
        // 使用settimeout异步的机制给videoList赋值
        await setTimeout(() => {
          context.commit('setSimiMVList', videoList)
        }, 20)
      }
    }
  },
  modules: {},
  getters: {
    // 获取歌单详情
    songSheetDisc(state) {
      return state.songSheetDisc
    }
  }
})
