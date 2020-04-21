<template>
  <transition name="slide">
    <div class="full-screen-play-container">
      <!-- 头部导航栏 -->
      <play-header></play-header>
      <!-- 内容区域 -->
      <play-section ref="playSection"></play-section>
      <!-- 页面底部 -->
      <play-footer></play-footer>
      <!-- 背景 -->
      <div class="bg">
        <div class="filter"></div>
        <div class="image"
             :style="bgImage"></div>
      </div>
    </div>
  </transition>
</template>
<script>
import PlayHeader from './header/Header'
import PlaySection from './section/Section'
import PlayFooter from './footer/Footer'

import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['currentSong']),
    bgImage () {
      return {
        backgroundImage: `url(${this.currentSong.picUrl})`
      }
    }
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

.slide-enter-active, .slide-leave-active {
  transition: transform 0.4s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(0, 100%, 0);
}

.full-screen-play-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  z-index: 99;
  touch-action: none;
  background-color: $color-common-background;

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.7;

    .filter {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #000;
      opacity: 0.6;
    }

    .image {
      width: 100%;
      height: 100%;
      transition: background-image 1s;
      background: no-repeat 50% / cover;
      filter: blur(100px);
    }
  }
}
</style>