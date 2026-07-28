<template>
  <transition name="slide-up">
    <div class="full-screen-play-container">
      <!-- 头部导航栏 -->
      <play-header></play-header>
      <!-- 内容区域 -->
      <play-section ref="playSection"></play-section>
      <!-- 页面底部 -->
      <play-footer></play-footer>
      <!-- 背景 -->
      <div class="bg" v-lazy:background-image="bgImage"></div>
    </div>
  </transition>
</template>
<script>
import PlayHeader from "./header/Header";
import PlaySection from "./section/Section";
import PlayFooter from "./footer/Footer";

import { mapState } from "pinia";

import { usePlayerStore } from "@/stores";
export default {
  computed: {
    ...mapState(usePlayerStore, ["currentSong"]),
    bgImage() {
      let bgImage = this.currentSong.album ? this.currentSong.album.picUrl : "";
      return bgImage;
    },
  },

  components: {
    PlayHeader,
    PlaySection,
    PlayFooter,
  },
};
</script>
<style lang="stylus" scoped>

.full-screen-play-container
    position fixed
    top 0
    left 0
    bottom 0
    right 0
    width 100%
    height 100%
    display flex
    flex-direction column
    box-sizing border-box
    z-index 99
    touch-action none
    background-color $color-common-background

    .bg
        position absolute
        height 100%
        width 100%
        background-color #161824
        background-repeat no-repeat
        background-position 50%
        background-size auto 100%
        transform scale(1.5)
        transform-origin center center
        transition background-image 0.6s
        filter blur(25px)
        z-index -1

        &::before
            content ''
            position absolute
            left 0
            right 0
            top 0
            bottom 0
            background-color rgba(0, 0, 0, .35)

.slide-up-enter-active
    transition transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out

.slide-up-leave-active
    transition transform 0.2s cubic-bezier(0.6, 0, 0.86, 0), opacity 0.2s ease-in

.slide-up-enter-from
    transform translateY(100%)
    opacity 1

.slide-up-leave-to
    transform translateY(100%)
    opacity 0
</style>
