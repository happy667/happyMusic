import Vue from 'vue'
import Vuex from 'vuex'
import recommendApi from '@/api/recommend.js'
import rankingApi from '@/api/ranking.js'
import {
  ERR_OK
} from '@/api/config.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    recommendSongSheet: [], // 推荐歌单
    recommendNewSong: [], // 推荐新音乐
    recommendNewSongSheet: [], // 新碟
    songSheet: [], // 歌单(所有类型歌单)
    songSheetDisc: {}, // 歌单详情
    songSheetCagetory: [], // 歌单分类
    rankingList: [] // 榜单列表
  },
  mutations: {
    // 设置当前索引
    setCurrentIndex(state, index) {
      state.currentIndex = index
    },
    // 设置推荐歌单
    setRecommendSongSheet(state, songSheet) {
      state.recommendSongSheet = songSheet
    },
    // 设置推荐新音乐
    setRecommendNewSong(state, songList) {
      state.recommendNewSong = songList
      // console.log(state.recommendNewSong)
    },
    // 设置推荐新碟歌单
    setRecommendNewSongSheet(state, songSheet) {
      state.recommendNewSongSheet = songSheet
      // console.log(state.recommendNewSongSheet)
    },
    // 设置歌单详情
    setSongSheet(state, listObj) {
      state.songSheet.push(listObj)
    },
    // 清空歌单
    clearSongSheet(state) {
      state.songSheet = []
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
    }

  },
  actions: {
    // 获取推荐歌单
    async getRecommendSongSheet(context, params) {
      const {
        data: res
      } = await recommendApi.getRecommendSongSheet()
      if (res.code === ERR_OK) { // 成功获取推荐歌单
        // console.log(res)
        context.commit('setRecommendSongSheet', res.result)
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
    async getSongSheetCatList(context, params) {
      const {
        data: res
      } = await recommendApi.getSongSheetCatList()
      if (res.code === ERR_OK) { // 成功获取歌单分类
        console.log(res)
        // context.commit('setSongSheetCagetory', songSheetCagetory)
      }
    },
    // 根据参数获取歌单
    async getSongSheet(context, params) {
      const {
        data: res
      } = await recommendApi.getSongSheet(params.tag, params.limit)
      if (res.code === ERR_OK) { // 成功获取歌单数据
        // this.songSheet = res.banners
        // console.log(res)
        let listObj = {
          tag: params.tag,
          playlists: res.playlists
        }
        context.commit('setSongSheet', listObj)
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
        console.log(res.playlist)
        context.commit('setSongSheetDisc', res.playlist)

        // 因为接口中返回的歌曲的值为id,所以需要再根据歌单列表中的歌曲id获取歌曲列表
        // 需要将歌曲id用“,”连接传入url中
        // const songIds = res.playlist.trackIds.map(v => v.id)
        // const {
        //   data: res2
        // } = await recommendApi.getSongUrl(songIds)
        // let playlist = [] // 歌曲列表
        // if (res2.code === ERR_OK) {
        //   console.log(res2)
        // for (var i = 0; i < res.playlist.tracks.length; i++) {
        //   // 创建歌曲对象
        //   const songObj = {
        //     id: res.playlist.tracks[i].id, // 歌曲id
        //     name: res.playlist.tracks[i].name, // 歌曲名称
        //     picUrl: res.playlist.tracks[i].al.picUrl, // 歌曲图片
        //     url: res2.data[i].url // 歌曲路径
        //   }
        //   playlist.push(songObj)
        // }

        // 创建歌单对象
        // const songSheetObj = {
        //   name: res.playlist.name, // 歌单名称
        //   coverImgUrl: res.playlist.coverImgUrl, // 歌单背景图片
        //   songsCount: res2.data.length, // 歌曲数量
        //   playlist: playlist // 歌曲列表
        // }
        // context.commit('setSongSheetDisc', songSheetObj)
        // console.log(res.playlist)
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
