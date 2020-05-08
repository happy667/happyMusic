import playerMutations from './moduls/player/mutations'
import userMutations from './moduls/user/mutations'
import searchMutations from './moduls/search/mutations'
import singerMutations from './moduls/singer/mutations'
export default {
  // 设置当前索引
  setHomeCurrentIndex(state, index) {
    state.homeCurrentIndex = index
  },
  // 设置上次播放的video
  setOldVideo(state, video) {
    state.oldVideo = video
  },
  // 设置音频
  setAudio(state, audio) {
    state.audio = audio
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

  // 设置跳转的是否为前进页面
  setIsAdvance(state, isAdvance) {
    state.isAdvance = isAdvance
  },
  ...playerMutations,
  ...userMutations,
  ...searchMutations,
  ...singerMutations
}
