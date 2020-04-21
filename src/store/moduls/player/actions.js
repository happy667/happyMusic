import {
  utils
} from '@/assets/common/js/utils.js'
export default {
  // 上一曲
  prev({
    state,
    commit,
    getters,
    dispatch
  }) {
    // 未加载好
    if (!state.songReady) return
    // 如果只有一首就循环播放当前歌曲
    if (state.playList.length === 1) {
      dispatch('loop')
      return
    }
    // 限制播放索引
    let index = utils.limitCutIndex(state.currentPlayIndex, state.playList.length - 1)
    commit('setCurrentPlayIndex', index)
    if (!state.playing) {
      commit('handleTogglePlaying')
    }
    commit('setSongReady', false)
    utils.playMusic(getters.currentSong, null, state.currentPlayIndex)
  },
  // 切换播放暂停
  handleTogglePlaying({
    state,
    commit
  }) {
    if (!state.songReady) return
    commit('setPlaying', !state.playing)
    if (state.currentLyric) {
      state.currentLyric.togglePlay()
    }
  },
  // 下一曲
  next({
    state,
    commit,
    getters,
    dispatch
  }) {
    // 未加载好
    if (!state.songReady) return
    // 如果只有一首就循环播放当前歌曲
    if (state.playList.length === 1) {
      dispatch('loop')
      return
    }
    // 限制当前播放索引
    let index = utils.limitAddIndex(state.currentPlayIndex, state.playList.length)
    commit('setCurrentPlayIndex', index)
    if (!state.playing) {
      commit('handleTogglePlaying')
    }
    commit('setSongReady', false)
    utils.playMusic(getters.currentSong, null, state.currentPlayIndex)
  },
  // 循环播放
  loop({
    state,
    commit
  }) {
    state.audio.currentTime = 0 // 重新播放
    if (state.currentLyric) {
      state.currentLyric.seek(0)
    }
    commit('setPlaying', true)
    state.audio.play()
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
      commit('setPlaying', false) // 如果没有歌曲就停止播放
      commit('setPlayerFullScreen', false)
    } else {
      commit('setPlaying', true)
    }
  }

}
