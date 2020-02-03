<template>
  <footer class="footer-container"
          :style="playerShowImage?'':'paddingTop:0.5rem'">
    <!-- 功能区 -->
    <transition enter-active-class="animated fadeIn faster">
      <play-function v-show="playerShowImage"></play-function>
    </transition>
    <!-- 播放进度 -->
    <play-progress></play-progress>
    <!-- 播放控件区域 -->
    <play-controller ref="playController"
                     v-on="$listeners"></play-controller>
  </footer>
</template>
<script>
import PlayFunction from './play/PlayFunction'
import PlayProgress from './play/PlayProgress'
import PlayController from './play/PlayController'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['playerShowImage'])
  },
  components: {
    PlayFunction,
    PlayProgress,
    PlayController
  }
}
</script>
<style lang="stylus" scoped>
.footer-container {
  padding: 0 0.5rem 0.6rem;
  box-sizing: border-box;
}
</style>