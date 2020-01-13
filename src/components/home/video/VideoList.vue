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
        <template v-if="this.videoList&&this.videoList.length!==0">
          <template v-for="item in videoList">
            <template v-if="item.artist&&item.videoUrl">
              <video-item :videoParams="item"
                          :key="item.id"></video-item>
            </template>
          </template>
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
  created () {
    this.pullUp = true

    setTimeout(() => {
      // 获取推荐视频
      this.$nextTick(() => { // 解决数据还未获取完dom就渲染结束
        if (this.videoList.length === 0) {
          this.getVideoList()
        }
      })
    }, 30)
  },
  computed: {
    ...mapState(['videoList'])
  },

  watch: {
    videoList () {

    }
  },
  methods: {
    ...mapActions(['getVideoList']),
    handlePullingUp () {
      this.getVideoList()
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