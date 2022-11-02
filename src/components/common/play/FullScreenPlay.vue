<template>
  <transition enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
    <div class="full-screen-play-container">
      <!-- 头部导航栏 -->
      <play-header></play-header>
      <!-- 内容区域 -->
      <play-section ref="playSection"></play-section>
      <!-- 页面底部 -->
      <play-footer></play-footer>
      <!-- 背景 -->
      <div class="bg" :style="bgImage"> </div>
    </div>
  </transition>
</template>
<script>
    import PlayHeader from './header/Header'
    import PlaySection from './section/Section'
    import PlayFooter from './footer/Footer'

    import {
        mapGetters
    } from 'vuex'

    export default {
        computed: {
            ...mapGetters(['currentSong']),
            bgImage() {
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
            height: 100%;
            width: 100%;
            background-color: #161824;
            background-repeat: no-repeat;
            background-position: 50%;
            background-size: auto 100%;
            transform: scale(1.5);
            transform-origin: center center;
            transition: background-image 0.6s;
            filter: blur(25px);
            z-index: -1;
            &::before {
                content: '';
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, .4);
            }
        }
    }
</style>