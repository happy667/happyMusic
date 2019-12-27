<template>
  <div class="songSheet-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar title="songSheet"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>
    <!-- 歌单分类 -->
    <van-tabs v-model="currentIndex"
              title-active-color="#FD4979"
              color="#FD4979"
              animated
              sticky
              swipeable>
      <!-- 推荐页 -->
      <van-tab title="推荐">
        <song-sheet-small></song-sheet-small>
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
      <van-tab title="搜索">
        <search />
      </van-tab>
      <van-tab title="搜索">
        <search />
      </van-tab>
      <van-tab title="搜索">
        <search />
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import songSheetSmall from './SongSheetSmall'

export default {
  data () {
    return {
      currentIndex: 0// 当前索引

    }
  },
  methods: {

    // 返回上一个路由
    routerBack () {
      this.$router.back()
    }
  },
  components: {
    songSheetSmall
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.songSheet-container {
  width: 100%;
  height: 100%;
  background: $color-common-background;
}
</style>