<template>
  <div class="home-container">
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
      <van-tab title="搜索">
        <search />
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import Recommend from '@/components/home/Recommend'
import Ranking from '@/components/home/Ranking'
import Singer from '@/components/home/Singer'
import Search from '@/components/home/Search'

export default {
  data () {
    return {
      currentIndex: 0// 当前索引
    }
  },
  components: {
    Recommend,
    Ranking,
    Singer,
    Search
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.home-container {
  background: $color-common-background;
}
</style>