<template>

  <div class="videoList-container">
    <!-- 正在加载 -->
    <van-loading v-if="this.videoList&&this.videoList.length === 0"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>

    <scroll :data="videoList"
            ref="videoListScroll"
            :pullUp="pullUp"
            @pullingUpLoad="handlePullingUp">
      <div class="video-list">
        <template v-show="this.videoList&&this.videoList.length!==0">
          <template v-for="item in videoList">
            <template v-if="item.artist&&item.videoUrl">
              <video-item :videoParams="item"
                          :key="item.id"></video-item>
            </template>
          </template>
          <van-loading v-if="loadMore"
                       size="24px"
                       color="#FD4979"
                       vertical>加载更多...</van-loading>
        </template>
      </div>

    </scroll>
  </div>
</template>
<script>
import VideoItem from './Video'
import Scroll from '@/components/common/Scroll'
import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      loadMore: false
    }
  },
  created () {
    this.pullUp = true
    // 获取推荐视频

    setTimeout(() => {
      this.$nextTick(() => { // 解决数据还未获取完dom就渲染结束
        if (this.videoList.length === 0) {
          this.getVideoList()
        }
      }, 20)
    })
  },
  computed: {
    ...mapState(['videoList'])
  },
  methods: {
    ...mapActions(['getVideoList']),
    async handlePullingUp () {
      clearTimeout(this.loadTimer)
      this.loadMore = true
      this.loadTimer = setTimeout(() => {
        this.getVideoList()
        this.$nextTick(() => { // 解决数据还未获取完dom就渲染结束
          this.$refs.videoListScroll.finishPullUp()
          this.$refs.videoListScroll.refresh()
          this.loadMore = false
        })
      }, 500)
    }
  },
  components: {
    VideoItem,
    Scroll
  }
}

</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.videoList-container {
  .video-list {
    padding: 0.5rem;
    width: 100%;
    box-sizing: border-box;
    position: absolute;
  }
}
</style>