import Vue from 'vue'
import Vuex from 'vuex'
import loginApi from '@/api/login.js'
import userApi from '@/api/user.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  playMode
} from '@/assets/common/js/config.js'
import utils from '@/assets/common/js/utils.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null, // 登录的用户
    homeCurrentIndex: 0,
    singerCurrentIndex: 0,
    rank: false, // 是否为排行
    scrollIndex: 0, // 当前滑动的索引
    stop: false, // 是否停止滚动
    isScroll: false, // 是否是滚动状态
    videoList: [], // mv列表
    oldVideo: {}, // 上一次的video
    searchKeywords: '', // 搜索关键词
    searchCurrentIndex: 0, // 搜索页当前索引
    showSearchList: false, // 是否显示搜索列表
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
    userLikeList: null, // 用户喜欢列表
    removeLikeSong: null // 移除的喜欢歌曲
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
    // 设置歌手页是否在滚动
    setIsScroll(state, isScroll) {
      state.isScroll = isScroll
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
    // 设置显示搜索列表
    setShowSearchList(state, showSearchList) {
      state.showSearchList = showSearchList
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
    },
    // 设置移除的喜欢歌曲
    setRemoveLikeSong(state, song) {
      state.removeLikeSong = song
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
