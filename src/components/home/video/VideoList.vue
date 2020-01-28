<template>

  <div class="videoList-container"
       v-cloak>
    <!-- 正在加载 -->
    <van-loading v-if="videoList.length===0"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <scroll :data="videoList"
            ref="videoListScroll"
            :pullUp="pullUp"
            @pullingUpLoad="handlePullingUp">
      <div class="video-list">
        <template v-if="videoList.length!==0">
          <template v-for="item in videoList">
            <video-item :videoParams="item"
                        :key="item.id"></video-item>
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
import videoApi from '@/api/video.js'
import {
  ERR_OK
} from '@/api/config.js'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      loadMore: false
    }
  },
  created () {
    this.pullUp = true
  },
  mounted () {
    // 获取推荐视频
    this.$nextTick(() => {
      if (this.videoList.length === 0) {
        this.getVideoList()
      }
    })
  },
  computed: {
    ...mapState(['videoList', 'videoOffset'])
  },
  methods: {
    ...mapMutations(['setVideoOffset', 'setVideoList']),
    // 上拉加载
    async handlePullingUp () {
      clearTimeout(this.loadTimer)
      this.loadMore = true
      this.loadTimer = setTimeout(() => {
        this.getVideoList()
        this.$nextTick(() => {
          this.$refs.videoListScroll.finishPullUp()
          this.loadMore = false
        })
      }, 500)
    },
    // 获取推荐视频
    getVideoList (context) {
      // 每次获取视频前设置偏移量
      const videoListLen = this.videoList.length
      this.setVideoOffset(videoListLen)
      const offset = this.videoOffset
      console.log(offset)
      videoApi.getRecommendVideo(offset).then(res => {
        console.log(res)
        if (res.data.code === ERR_OK) {
          let videoList = res.data.data
          // 获取视频详情
          // videoList.forEach(async (item) => {
          //   const {
          //     data: res
          //   } = await videoApi.getVideoDetail(item.id)
          //   if (res.code === ERR_OK) {
          //     console.log(res)
          //     item.avatarUrl = res.data.avatarUrl
          //   }
          // })
          // 获取视频播放路径
          videoList.forEach(async (item) => {
            const {
              data: res
            } = await videoApi.getRecommendVideoUrl(item.id)
            if (res.code === ERR_OK) {
              console.log(res.data.url)
              item.videoUrl = res.data.url
            }
          })
          console.log(111)
          this.setVideoList(videoList)
        }
      })
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

[v-cloak] {
  display: none;
}

.videoList-container {
  .video-list {
    width: 100%;
    padding: 0.5rem;
    box-sizing: border-box;
    position: absolute;
  }
}
</style>