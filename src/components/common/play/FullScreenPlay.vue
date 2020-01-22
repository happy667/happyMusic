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
         v-lazy:background-image="currentSong.picUrl "></div>
    <audio ref="audio"
           autoplay
           :src="musicUrl"></audio>
  </div>
</template>
<script>
import PlayHeader from './header/Header'
import PlaySection from './section/Section'
import PlayFooter from './footer/Footer'
import PlayList from '@/components/home/playList/PlayList'
import { mapGetters } from 'vuex'
import songApi from '@/api/song.js'
export default {
  data () {
    return {
      musicUrl: '', // 歌曲路径
      showPlayList: false // 显示隐藏播放列表
    }
  },
  computed: {
    ...mapGetters(['currentSong'])
  },
  watch: {
    currentSong () {
      // 获取音乐播放路径
      this.getMusicUrl(this.currentSong.id)
    }
  },
  methods: {
    // 获取播放歌曲路径
    async getMusicUrl (id) {
      const {
        data: res
      } = await songApi.getMusicUrl(id)
      this.musicUrl = res.data[0].url
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
@import '~common/stylus/variable';

.full-screen-play-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  z-index: 99;

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
    opacity: 0.3;
    background: $color-common-b;
  }
}
</style>