import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // tabbar列表信息
    tabbarList: [
      {
        title: '推荐',
        path: '/Home/Recommend'
      },
      {
        title: '排行',
        path: '/Home/Ranking'
      },
      {
        title: '歌手',
        path: '/Home/Singer'
      },
      {
        title: 'mv',
        path: '/Home/Search'
      }
    ],
    // 当前索引
    currentIndex: 0
  },
  mutations: {
    // 设置当前索引
    setCurrentIndex(state, index) {
      state.currentIndex = index
    },
    // 下一页
    nextPage(state) {
      if (state.currentIndex < state.tabbarList.length - 1) {
        state.currentIndex++
      }
    },
    // 上一页
    prevPage(state) {
      if (state.currentIndex > 0) {
        state.currentIndex--
      }
    }
  },
  actions: {},
  modules: {}
})
