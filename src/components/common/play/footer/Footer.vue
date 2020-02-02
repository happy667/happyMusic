<template>
  <footer class="footer-container">
    <!-- 功能区 -->
    <play-function></play-function>
    <!-- 播放进度 -->
    <play-progress></play-progress>
    <!-- 播放控件区域 -->
    <play-controller ref="playController"></play-controller>
  </footer>
</template>
<script>
import PlayFunction from './play/PlayFunction'
import PlayProgress from './play/PlayProgress'
import PlayController from './play/PlayController'
export default {

  components: {
    PlayFunction,
    PlayProgress,
    PlayController
  }
}
</script>
<style lang="stylus" scoped>
.footer-container {
  padding: 0.5rem 0.5rem 0.65rem;
  box-sizing: border-box;
}
</style>