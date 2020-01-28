import Vue from 'vue'
import Vuex from 'vuex'
import SongSheetDetail from '@/assets/common/js/songSheetDetail.js'
import recommendApi from '@/api/recommend.js'
import rankingApi from '@/api/ranking.js'
import singerApi from '@/api/singer.js'
import songApi from '@/api/song.js'
import loginApi from '@/api/login.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  playMode
} from '@/assets/common/js/config.js'
import Song from '@/assets/common/js/song.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null, // 登录的用户
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
    currentPlayIndex: -1 // 当前播放索引
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
        return true
      }
    },
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
        let songList = []
        res.result.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
          let singers = item.song.artists.map(item => item.name).join('/')
          songList.push(new Song({
            id: item.id,
            name: item.name,
            singers,
            picUrl: item.picUrl
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
    // 根据id获取歌单列表
    async getSongSheetById(context, id) {
      // 先清空
      context.commit('setSongSheetDisc', {})
      const {
        data: res
      } = await recommendApi.getSongSheetById(id)
      if (res.code === ERR_OK) {
        let songList = []
        res.playlist.tracks.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
          let singerName = item.ar.map(item => item.name).join('/')
          let singersId = item.ar.map(item => item.id).join(',')
          songList.push(new Song({
            id: item.id,
            name: item.name,
            singers: singerName,
            singersId,
            picUrl: item.al.picUrl
          }))
        })
        context.commit('setSongSheetDisc', new SongSheetDetail({
          id: res.playlist.id,
          picUrl: res.playlist.coverImgUrl || res.playlist.backgroundCoverUrl,
          songs: songList,
          name: res.playlist.name,
          trackUpdateTime: res.playlist.trackUpdateTime
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
        console.log(rankingList)
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
    // 选择音乐播放播放
    setSelectPlay({
      commit,
      state
    }, {
      list,
      index
    }) {
      commit('setPlaying', true)
      commit('setPlayList', list)
      commit('setSequenceList', list)
      commit('setCurrentPlayIndex', index)
    },
    // 检查音乐是否可用
    async checkMusic(context, id) {
      const {
        data: res
      } = await songApi.checkMusic(id)
      return res
    },
    // 播放歌曲
    playMusic(context, params) {
      // 检查音乐是否可用
      this.dispatch('checkMusic', params.song.id).then(res => {
        if (res.success) {
          // 设置当前播放歌曲
          this.dispatch('setSelectPlay', {
            list: params.list,
            index: params.index
          })
        }
      }).catch((res) => {
        // 提示
        console.log(res.response + '132465')
        Vue.$toast(res.message)
      })
    }

  },
  modules: {},
  getters: {
    // 获取歌单详情
    songSheetDisc(state) {
      return state.songSheetDisc
    },
    // 当前歌曲
    currentSong(state) {
      return state.playList[state.currentPlayIndex] || {}
    }
  }
})
