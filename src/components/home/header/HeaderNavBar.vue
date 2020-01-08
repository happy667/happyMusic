<template>
  <div class="header-navBar-container">
    <!-- 头部导航栏 -->
    <van-tabs v-model="currentIndex"
              title-active-color="#FD4979"
              color="#FD4979"
              animated
              swipeable>
      <!-- 推荐页 -->
      <van-tab title="推荐">
        <Recommend />
      </van-tab>
      <!-- 排行页 -->
      <van-tab title="排行">
        <ranking />
      </van-tab>
      <!-- 歌手页 -->
      <van-tab title="歌手">
        <singer />
      </van-tab>
      <!-- 搜索页 -->
      <van-tab title="MV">
        <video-list />
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import Recommend from '@/components/home/recommend/Recommend'
import Ranking from '@/components/home/ranking/Ranking'
import Singer from '@/components/home/singer/Singer'
import VideoList from '@/components/home/video/VideoList'
export default {
  computed: {
    currentIndex: {
      get () {
        return this.$store.state.currentIndex
      },
      set (index) {
        this.$store.commit('setCurrentIndex', index)
      }
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
<style lang="stylus" scoped>
.header-navBar-container>>>.van-tabs__wrap {
  height: 1.18rem;
}
</style>