<template>
  <div class="full-screen-play-container">
    <!-- 头部导航栏 -->
    <play-header></play-header>
    <!-- 内容区域 -->
    <play-section></play-section>
    <!-- 页面底部 -->
    <play-footer></play-footer>
    <!--歌曲列表-->
    <play-list v-show="showPlayList"></play-list>
    <!-- 背景 -->
    <div class="bg"
         :style="background"></div>

  </div>
</template>
<script>
import PlayHeader from './header/Header'
import PlaySection from './section/Section'
import PlayFooter from './footer/Footer'
import PlayList from '@/components/home/playList/PlayList'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      showPlayList: false // 显示隐藏播放列表
    }
  },
  computed: {
    ...mapGetters(['currentSong']),
    background () {
      return {
        backgroundImage: 'url(' + this.currentSong.picUrl + ')'
      }
    }
  },
  components: {
    PlayHeader,
    PlaySection,
    PlayFooter,
    PlayList
  }
}
</script>
<style lang="stylus" scoped>
.full-screen-play-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background: #fff;

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    filter: blur(10px);
    z-index: -1;
    opacity: 0.4;
    //background-image: url('https://p1.music.126.net/DHUrNjC-1d6Snpcfg20Umw==/109951164583315133.jpg');
  }
}
</style>