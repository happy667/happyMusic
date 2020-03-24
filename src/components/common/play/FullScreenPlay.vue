<template>
  <div class="full-screen-play-container">
    <!-- 头部导航栏 -->
    <play-header></play-header>
    <!-- 内容区域 -->
    <play-section ref="playSection"></play-section>
    <!-- 页面底部 -->
    <play-footer v-on="$listeners"></play-footer>
    <!-- 背景 -->
    <div class="bg">
      <div class="filter"></div>
      <img v-lazy="currentSong.picUrl" />
    </div>

  </div>
</template>
<script>
import PlayHeader from './header/Header'
import PlaySection from './section/Section'
import PlayFooter from './footer/Footer'

import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['currentSong'])
  },

  components: {
    PlayHeader,
    PlaySection,
    PlayFooter
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.full-screen-play-container>>>.van-slider__button {
  width: 0.25rem;
  height: 0.25rem;
  background: $color-common;
}

.full-screen-play-container>>>.van-slider {
  background-color: #fff;
}

.full-screen-play-container {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  z-index: 99;
  touch-action: none;

  .bg {
    position: absolute;
    left: 50%;
    margin-left: -50%;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.5;
    filter: blur(100px);
    z-index: -1;

    .filter {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #000;
      opacity: 0.4;
    }
  }
}
</style>