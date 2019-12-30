import Vue from 'vue'
import Vuex from 'vuex'
import recommendApi from '@/api/recommend.js'
import {
  ERR_OK
} from '@/api/config.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    songSheet: [] // 歌单(所有类型歌单)
  },
  mutations: {
    // 设置当前索引
    setCurrentIndex(state, index) {
      state.currentIndex = index
    },
    setSongSheet(state, listObj) {
      state.songSheet.push(listObj)
    },
    // 获取完毕清空
    clearSongSheet(state) {
      state.songSheet = []
    }
  },
  actions: {
    // 获取歌单
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
        console.log(listObj)
        context.commit('setSongSheet', listObj)
      }
    }
  },
  modules: {}
})
