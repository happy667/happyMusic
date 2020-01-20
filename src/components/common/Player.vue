<template>
  <div class="play-container"
       v-show="playList.length>0">
    <!-- 全屏播放器 -->
    <transition name="fade" mode="out-in">
      <FullScreenPlay v-show="playerFullScreen"></FullScreenPlay>
    </transition>
    <transition name="fade" mode="out-in">
      <!-- 迷你播放器 -->
      <mini-play v-show="!playerFullScreen"></mini-play>
    </transition>
  </div>
</template>
<script>
import FullScreenPlay from './play/FullScreenPlay'
import MiniPlay from './play/MiniPlay'
import { mapState } from 'vuex'
export default {

  data () {
    return {
      showPlayList: false// 显示隐藏播放列表
    }
  },
  computed: {
    ...mapState(['playerFullScreen', 'playList'])

  },
  components: {
    FullScreenPlay,
    MiniPlay
  }
}
</script>
<style lang="stylus" scoped>
.play-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
}
</style>