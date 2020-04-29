<template>
  <header class="header-container">
    <div class="back"
         @click="handleBack">
      <van-icon name="arrow-down" />
    </div>
    <div class="song-info">
      <div class="song-name">{{currentSong.name}}</div>
      <div class="singer"
           @click="handleClick">{{currentSong.singers}}</div>
    </div>
    <singer-popup :list="currentSong.singersList"
                  :showPopup="showSingerPopup"
                  @showPopup="showSingerPopup=true"
                  @closePopup="showSingerPopup=false"
                  @clickListItem="clickListItem"
                  @finishedLoadImage="handleFinished"
                  :isLoadImage="isLoadImage"></singer-popup>
  </header>

</template>
<script>
import SingerPopup from '@/components/common/SingerPopup'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      // 显示歌手弹出层
      showSingerPopup: false
    }
  },
  computed: {
    ...mapGetters(['currentSong']),
    // 是否要加载图片
    isLoadImage: {
      get () {
        return this.$store.state.isLoadPlayerImage
      },
      set (val) {
        this.$store.commit('setIsLoadPlayerImage', val)
      }
    }

  },
  methods: {
    ...mapMutations(['setPlayerFullScreen', 'setSinger', 'setSingerCurrentIndex', 'setIsPlayerClick', 'setAddNoCacheComponents', 'setIsGetSingerImage']),
    handleBack () {
      this.setPlayerFullScreen(false)
    },
    // 选择歌手
    handleClick () {
      let list = this.currentSong.singersList
      if (list.length === 1) { // 只有一个歌手直接跳转到歌手页面
        let currentPath = `/singerInfo/${this.currentSong.singersList[0].id}`
        if (this.$route.path !== currentPath) { // 如果当前歌手详情页就是所选歌手直接隐藏全屏播放器
          this.setSingerCurrentIndex(0)
          this.$router.push(`/singerInfo/${this.currentSong.singersList[0].id}`)
        }
        this.setIsPlayerClick(true)
        this.setPlayerFullScreen(false)
      } else {
        this.showSingerPopup = true
      }
      this.setIsPlayerClick(true)
    },
    // 选择列表中歌手
    clickListItem () {
      this.setIsPlayerClick(true)
      this.setPlayerFullScreen(false)
      this.showSingerPopup = false
    },
    // 数据获取完成
    handleFinished () {
      this.isLoadImage = false
    }

  },
  components: {
    SingerPopup
  }

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.header-container {
  margin: 0.3rem 0.3rem 0.1rem 0.3rem;
  position: relative;
  display: flex;
  font-size: $font-size-small;

  .back {
    position: absolute;
    top: 0;
    left: 0;
    width: 1rem;
    height: 0.7rem;
    line-height: 0.7rem;
    color: $color-common;
    z-index: 999;
  }

  .song-info {
    width: 100%;
    margin: 0 1.5rem;
    box-sizing: border-box;
    overflow: hidden;

    .song-name, .singer {
      width: 100%;
      height: 0.7rem;
      line-height: 0.7rem;
      text-align: center;
      font-size: $font-size-smaller;
    }

    .song-name {
      font-weight: 600;
      no-wrap();
    }

    .singer {
      no-wrap();
      color: $color-common-x;
    }
  }
}
</style>