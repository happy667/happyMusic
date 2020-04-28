export default {
  // 设置歌手
  setSinger(state, singer) {
    state.singer = singer
  },
  // 设置歌手信息页当前索引
  setSingerCurrentIndex(state, index) {
    state.singerCurrentIndex = index
  },
  // 设置是否要加载图片（播放器）
  setIsLoadPlayerImage(state, isLoadPlayerImage) {
    state.isLoadPlayerImage = isLoadPlayerImage
  },
  // 是否要加载图片（视频详情）
  setIsLoadVideoInfoImage(state, isLoadVideoInfoImage) {
    state.isLoadVideoInfoImage = isLoadVideoInfoImage
  },
  // 是否要加载图片（专辑详情）
  setIsLoadAlbumInfoImage(state, isLoadAlbumInfoImage) {
    state.isLoadAlbumInfoImage = isLoadAlbumInfoImage
  }
}
