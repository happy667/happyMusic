import playerState from './moduls/player/state'
import userState from './moduls/user/state'
import searchState from './moduls/search/state'
import singerState from './moduls/singer/state'

export default {
  homeCurrentIndex: 0, // 首页当前索引
  oldVideo: {}, // 上一次的video
  audio: null, // 音频对象
  noCacheComponents: [], // 不缓存的组件
  ...playerState,
  ...userState,
  ...searchState,
  ...singerState
}
