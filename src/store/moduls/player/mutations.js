export default {
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
  // 设置是否隐藏迷你播放器
  setHideMiniPlayer(state, hideMiniPlayer) {
    state.hideMiniPlayer = hideMiniPlayer
  }
}
