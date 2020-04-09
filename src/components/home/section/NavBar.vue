<template>
  <div class="header-navBar-container"
       ref="navBar">
    <!-- 头部导航栏 -->
    <van-tabs v-model="currentIndex"
              @change="handleChange"
              title-active-color="#FD4979"
              color="#FD4979"
              animated
              swipeable>
      <!-- 推荐页 -->
      <van-tab title="推荐">
        <Recommend ref="recommend" />
      </van-tab>
      <!-- 排行页 -->
      <van-tab title="排行">
        <ranking ref="ranking" />
      </van-tab>
      <!-- 歌手页 -->
      <van-tab title="歌手">
        <singer ref="singer" />
      </van-tab>
      <!-- 搜索页 -->
      <van-tab title="MV">
        <video-list ref="mv" />
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import Recommend from '@/components/home/recommend/Recommend'
import Ranking from '@/components/home/ranking/Ranking'
import Singer from '@/components/home/singer/Singer'
import VideoList from '@/components/home/video/VideoList'
import { playlistMixin } from '@/assets/common/js/mixin.js'
import { mapState } from 'vuex'
export default {
  mixins: [playlistMixin],
  computed: {
    ...mapState(['oldVideo']),
    currentIndex: {
      get () {
        return this.$store.state.homeCurrentIndex
      },
      set (index) {
        this.$store.commit('setHomeCurrentIndex', index)
      }
    }

  },
  methods: {
    handleChange () {
      this.handlePlaylist(this.playList)
      if (this.currentIndex === 3) return
      if (this.oldVideo.$data && this.oldVideo.$data.isPlay) {
        this.oldVideo.pauseCurrentVideo()
      }
    },
    handlePlaylist (playList) {
      // 适配播放器与页面底部距离
      const bottom = playList.length > 0 ? '1.6rem' : ''
      this.$nextTick(() => {
        switch (this.currentIndex) {
          case 0:
            this.$refs.recommend.$refs.container.style.paddingBottom = bottom
            this.$refs.recommend.refresh()
            break
          case 1:
            this.$refs.ranking.$refs.container.style.paddingBottom = bottom
            this.$refs.ranking.refresh()
            break
          case 2:
            this.$refs.singer.$refs.list.$refs.container.style.paddingBottom = bottom
            this.$refs.singer.$refs.list.refresh()
            break
          case 3:
            this.$refs.mv.$refs.container.style.paddingBottom = bottom
            this.$refs.mv.refresh()
            break
        }
      })
    }
  },
  components: {
    Recommend,
    Ranking,
    Singer,
    VideoList
  }

}
</script>
<style lang="stylus" scoped></style>