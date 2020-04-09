import Vue from 'vue'
import Vuex from 'vuex'
import loginApi from '@/api/login.js'
import userApi from '@/api/user.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  playMode,
  USER_TOKEN
} from '@/assets/common/js/config.js'
import {
  getItem
} from 'common/js/localStorage.js'
import {
  utils
} from '@/assets/common/js/utils.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: getItem(USER_TOKEN), // token
    user: null, // 登录的用户
    homeCurrentIndex: 0,
    singerCurrentIndex: 0,
    rank: false, // 是否为排行
    scrollIndex: 0, // 当前滑动的索引
    stop: false, // 是否停止滚动
    isScroll: false, // 是否是滚动状态
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
    userRecommendIndex: 0, // 用户每日推荐页当前索引
    singer: null, // 歌手
    noCacheComponents: [], // 不缓存的组件
    isPlayerClick: false, // 是否为播放页面点击的
    isGetSingerImage: false, // 是否获取歌手图片
    isAdvance: false, // 跳转的是否为前进页面
    isGetAlbumSingerImage: false, // 是否获取专辑歌手图片
    hideMiniPlayer: false // 隐藏迷你播放器
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
    // 设置歌手
    setSinger(state, singer) {
      state.singer = singer
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
    // 设置用户每日推荐页当前索引
    setUserRecommendIndex(state, index) {
      state.userRecommendIndex = index
    },
    // 设置token
    setToken(state, token) {
      state.token = token
    },
    // 设置添加不缓存的路由
    setAddNoCacheComponents(state, name) {
      console.log(state.noCacheComponents)
      // 判断是否已经存在该组件,不存在就添加进去
      if (!state.noCacheComponents.includes(name)) {
        state.noCacheComponents.push(name)
      }
    },
    // 设置移除不缓存的路由
    setRemoveNoCacheComponents(state, name) {
      // 判断是否包含移除的路由，包含就移除该路由

      let index = state.noCacheComponents.indexOf(name)
      if (index !== -1) { // 说明存在
        state.noCacheComponents.splice(index, 1)
      }
    },
    // 设置是否为播放页面点击的
    setIsPlayerClick(state, isPlayerClick) {
      state.isPlayerClick = isPlayerClick
    },
    // 设置是否获取歌手图片（播放器页面点击歌手获取）
    setIsGetSingerImage(state, isGetSingerImage) {
      state.isGetSingerImage = isGetSingerImage
    },
    // 设置跳转的是否为前进页面
    setIsAdvance(state, isAdvance) {
      state.isAdvance = isAdvance
    },
    // 设置是否获取歌手图片（专辑详情点击歌手获取）
    setIsGetAlbumSingerImage(state, isGetAlbumSingerImage) {
      state.isGetAlbumSingerImage = isGetAlbumSingerImage
    },
    // 设置是否隐藏迷你播放器
    setHideMiniPlayer(state, hideMiniPlayer) {
      state.hideMiniPlayer = hideMiniPlayer
    }

  },
  actions: {
    // 获取登录用户信息
    getLoginUserInfo(context) {
      loginApi.loginStatus().then(res => {
        if (res.data.code === ERR_OK) {
          let user = res.data.profile
          context.commit('setLoginUser', user)
          context.dispatch('getUserLikeList', user.userId)
        }
      }).catch(err => console.log(err.data.message))
    },
    // 获取用户喜欢列表
    async getUserLikeList(context, id) {
      const {
        data: res
      } = await userApi.getUserLikeList(id)
      if (res.code === ERR_OK) {
        context.commit('setUserLikeList', res.ids)
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
      commit('setPlaying', true)
      commit('setSequenceList', list)
      commit('setCurrentPlayIndex', index)
      commit('setPlayList', list)
    },
    // 删除歌曲列表
    deleteSongList({
      commit
    }) {
      commit('setPlaying', false)
      commit('setPlayList', [])
      commit('setSequenceList', [])
      commit('setCurrentPlayIndex', -1)
      commit('setPlayerFullScreen', false)
    },
    // 删除歌曲
    deleteSong({
      commit,
      state
    }, song) {
      // 返回截取后的数据，因为是返回一个新的数组
      let playlist = state.playList.slice()
      let sequenceList = state.sequenceList.slice()
      // 使用utils中的findIndex方法查找当前歌曲索引
      let {
        findIndex
      } = utils
      // 移除歌曲列表中的歌曲
      let currentIndex = state.currentPlayIndex
      let pIndex = findIndex(playlist, song)
      // 移除随机列表中的歌曲
      playlist.splice(pIndex, 1)
      let sIndex = findIndex(sequenceList, song)
      sequenceList.splice(sIndex, 1)
      if (currentIndex === playlist.length) {
        currentIndex--
        commit('setCurrentPlayIndex', currentIndex)
      }
      commit('setPlayList', playlist)
      commit('setSequenceList', sequenceList)
      if (!playlist.length) {
        console.log(123)
        commit('setPlaying', false) // 如果没有歌曲就停止播放
        commit('setPlayerFullScreen', false)
      } else {
        commit('setPlaying', true)
      }
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
