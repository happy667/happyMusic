import playerMutations from './moduls/player/mutations'
import userMutations from './moduls/user/mutations'
import searchMutations from './moduls/search/mutations'
import singerMutations from './moduls/singer/mutations'
export default {
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
  // 设置音频
  setAudio(state, audio) {
    state.audio = audio
  },
  // 设置切换歌曲列表
  setTogglePlayList(state, togglePlayList) {
    state.togglePlayList = togglePlayList
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
  ...playerMutations,
  ...userMutations,
  ...searchMutations,
  ...singerMutations
}
