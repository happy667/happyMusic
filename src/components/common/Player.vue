<template>
  <div class="play-container"
       ref="play"
       v-show="playList.length>0">
    <!-- 全屏播放器 -->
    <transition enter-active-class="animated fadeInUp faster">
      <FullScreenPlay v-show="playerFullScreen"></FullScreenPlay>
    </transition>
    <!-- 迷你播放器 -->
    <mini-play v-show="!playerFullScreen">
    </mini-play>
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
  watch: {
    playerFullScreen () {
      if (this.playerFullScreen) {
        this.$refs.play.style.position = 'fixed'
      } else {
        this.$refs.play.style.position = 'relative'
      }
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
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
}
</style>