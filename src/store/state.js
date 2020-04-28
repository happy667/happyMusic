import playerState from './moduls/player/state'
import userState from './moduls/user/state'
import searchState from './moduls/search/state'
import singerState from './moduls/singer/state'

export default {
  homeCurrentIndex: 0, // 首页当前索引
  rank: false, // 是否为排行
  scrollIndex: 0, // 当前滑动的索引
  stop: false, // 是否停止滚动
  isScroll: false, // 是否是滚动状态
  oldVideo: {}, // 上一次的video
  audio: null, // 音频对象
  noCacheComponents: ['headerSearchContainer'], // 不缓存的组件
  isAdvance: true, // 跳转的是否为前进页面
  ...playerState,
  ...userState,
  ...searchState,
  ...singerState
}
