import Vue from 'vue'
import Vuex from 'vuex'
import recommendApi from '@/api/recommend.js'
import rankingApi from '@/api/ranking.js'
import singerApi from '@/api/singer.js'
import loginApi from '@/api/login.js'
import userApi from '@/api/user.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  playMode
} from '@/assets/common/js/config.js'
import Song from '@/assets/common/js/song.js'
import Singer from '@/assets/common/js/singer.js'
import SongSheetDetail from '@/assets/common/js/songSheetDetail.js'
import utils from '@/assets/common/js/utils.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null, // 登录的用户
    homeCurrentIndex: 0,
    singerCurrentIndex: 0,
    rank: false, // 是否为排行
    recommendNewSong: [], // 推荐新音乐
    recommendNewSongSheet: [], // 新碟
    songSheetCagetory: [], // 歌单分类
    rankingList: [], // 榜单列表
    scrollIndex: 0, // 当前滑动的索引
    stop: false, // 是否停止滚动
    isScroll: false, // 是否是滚动状态
    videoList: [], // mv列表
    selectVideo: {}, // 选择的mv                                     //暂时没用到
    oldVideo: {}, // 上一次的video
    searchKeywords: '', // 搜索关键词
    searchCurrentIndex: 0, // 搜索页当前索引
    singer: {}, // 歌手
    playing: false, // 播放状态
    playList: [], // 播放列表
    playerFullScreen: false, // 是否展开播放
    sequenceList: [], // 顺序播放列表
    playMode: playMode.sequence, // 播放模式
    currentPlayIndex: -1, // 当前播放索引
    audio: null, // 音频对象
    togglePlayList: false, // 显示隐藏播放列表
    songReady: false, // 歌曲是否加载完毕
    playerShowImage: true, // 显示播放器图片
    currentLyric: null, // 设置一个歌词维护属性
    currentLineNum: 0, // 当前高亮的歌词行
    currentPlayLyric: '', // 当前播放的歌词
    userLikeList: null // 用户喜欢列表
  },
  mutations: {
    // 设置登录用户
    setLoginUser(state, user) {
      state.user = user
    },
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
    },
    // 设置推荐新碟歌单
    setRecommendNewSongSheet(state, songSheet) {
      state.recommendNewSongSheet = songSheet
    },
    // 设置歌单
    setSongSheet(state, listObj) {
      state.songSheet.push(listObj)
    },
    // 设置歌单分类
    setSongSheetCagetory(state, songSheetCagetory) {
      state.songSheetCagetory = songSheetCagetory
    },
    // 设置歌单分类
    setRankingList(state, rankingList) {
      state.rankingList = rankingList
    },
    // 设置video列表
    setVideoList(state, list) {
      state.videoList = state.videoList.concat(list)
    },
    // 设置上次播放的video
    setOldVideo(state, video) {
      state.oldVideo = video
    },
    // 设置搜索关键词
    setSearchKeywords(state, keywords) {
      state.searchKeywords = keywords
    },
    // 设置搜索页当前索引
    setSearchCurrentIndex(state, index) {
      state.searchCurrentIndex = index
    },
    // 设置歌手
    setSinger(state, singer) {
      state.singer = singer
    },
    // 设置播放状态
    setPlaying(state, playing) {
      state.playing = playing
    },
    // 设置播放列表
    setPlayList(state, list) {
      state.playList = list
    },
    // 设置是否展开播放
    setPlayerFullScreen(state, playerFullScreen) {
      state.playerFullScreen = playerFullScreen
    },
    // 设置播放模式
    setPlayMode(state, mode) {
      state.playMode = mode
    },
    // 设置播放顺序列表
    setSequenceList(state, list) {
      state.sequenceList = list
    },
    // 设置当前播放索引
    setCurrentPlayIndex(state, index) {
      state.currentPlayIndex = index
    },
    // 设置音频
    setAudio(state, audio) {
      state.audio = audio
    },
    // 设置切换歌曲列表
    setTogglePlayList(state, togglePlayList) {
      state.togglePlayList = togglePlayList
    },
    // 设置加载歌曲
    setSongReady(state, songReady) {
      state.songReady = songReady
    },
    // 设置播放器页面图片显示
    setPlayerShowImage(state, playerShowImage) {
      state.playerShowImage = playerShowImage
    },
    // 设置当前歌词
    setCurrentLyric(state, currentLyric) {
      state.currentLyric = currentLyric
    },
    // 当前高亮的歌词行
    setCurrentLineNum(state, currentLineNum) {
      state.currentLineNum = currentLineNum
    },
    // 当前播放的歌词
    setCurrentPlayLyric(state, currentPlayLyric) {
      state.currentPlayLyric = currentPlayLyric
    },
    // 设置用户喜欢列表
    setUserLikeList(state, userLikeList) {
      state.userLikeList = userLikeList
    }
  },
  actions: {
    // 获取登录用户
    async getLoginUser(context) {
      const {
        data: res
      } = await loginApi.loginStatus()
      if (res.code === ERR_OK) {
        context.commit('setLoginUser', res.profile)
        console.log(this.state.user)
        this.dispatch('getUserLikeList', this.state.user.userId)
      }
    },
    // 获取推荐歌单
    async getRecommendSongSheet(context, limit) {
      const {
        data: res
      } = await recommendApi.getRecommendSongSheet(limit)
      if (res.code === ERR_OK) { // 成功获取推荐歌单
        return res.result
      }
    },
    // 获取推荐新音乐
    async getRecommendNewSong(context) {
      const {
        data: res
      } = await recommendApi.getRecommendNewSong()
      if (res.code === ERR_OK) { // 成功获取推荐新音乐
        let songList = []

        res.result.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
          let singers = item.song.artists.map(item => item.name).join('/')
          let singersList = []
          // 处理歌手
          item.song.artists.forEach(item => {
            singersList.push(new Singer({
              id: item.id,
              name: item.name,
              avatar: item.img1v1Url,
              picUrl: item.picUrl
            }))
          })
          songList.push(new Song({
            id: item.id,
            name: item.name,
            singers,
            picUrl: item.picUrl,
            singersList
          }))
        })
        context.commit('setRecommendNewSong', songList)
        console.log(res.result)
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
          rankingList: []
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
        context.commit('setRankingList', rankingList)
      }
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
    // 获取用户喜欢列表
    async getUserLikeList(context, id) {
      const {
        data: res
      } = await userApi.getUserLikeList(id)
      if (res.code === ERR_OK) {
        this.commit('setUserLikeList', res.ids)
      }
    },
    // 选择音乐播放播放
    setSelectPlay({
      commit,
      state
    }, {
      list,
      index
    }) {
      let sequenceList = utils.utils.copyList(list)
      console.log(sequenceList)
      commit('setPlaying', true)
      commit('setPlayList', list)
      commit('setSequenceList', sequenceList)
      commit('setCurrentPlayIndex', index)
    }

  },
  modules: {},
  getters: {
    // 当前歌曲
    currentSong(state) {
      return state.playList[state.currentPlayIndex] || {}
    }
  }
})
