export default {
    // 当前歌曲
    currentSong(state) {
        return state.playList[state.currentPlayIndex] || {}
    }
}