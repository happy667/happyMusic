<template>

  <div class="videoList-container">
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
                       class="loadMore"
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
import SingerApi from '@/api/singer.js'
import Video from '@/assets/common/js/video.js'
import {
  ERR_OK
} from '@/api/config.js'
export default {
  data () {
    return {
      loadMore: false,
      videoList: []// 视频列表
    }
  },
  activated () {
    if (this.videoList.length === 0) {
      this.getVideoList()
    }
    this.$refs.videoListScroll.refresh()
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
  methods: {
    // 上拉加载
    async handlePullingUp () {
      if (this.loadMore) { // 如果请求未完成就不继续请求数据
        return
      }
      clearTimeout(this.loadTimer)
      this.loadMore = true
      this.loadTimer = setTimeout(() => {
        this.getVideoList()
      }, 300)
    },
    // 获取推荐视频
    async getVideoList (context) {
      const offset = this.videoList.length
      const { data: res } = await videoApi.getRecommendVideo(offset)
      if (res.code === ERR_OK) {
        const data = res.data
        let videoList = []
        let length = 0// 用于判断是否执行完毕
        data.forEach(async (item) => {
          // 获取歌手信息
          const { data: res2 } = await SingerApi.getSinger(item.artistId)
          if (res2.code === ERR_OK) {
            // 获取mv路径
            const { data: res3 } = await videoApi.getRecommendVideoUrl(item.id)
            if (res3.code === ERR_OK) {
              let video = new Video({
                id: item.id,
                coverUrl: item.cover,
                name: item.name,
                playCount: item.playCount,
                artist: {
                  id: res2.artist.id,
                  name: res2.artist.name,
                  avatarUrl: res2.artist.img1v1Url
                },
                url: res3.data.url
              })
              length++
              videoList.push(video)
              if (length === data.length) { // 说明请求完成
                this.loadMore = false
                this.videoList = this.videoList.concat(videoList)
                this.$nextTick(() => {
                  this.$refs.videoListScroll.finishPullUp()
                })
              }
            }
          }
        })
      }
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

.videoList-container>>>.loadMore {
  height: 2rem !important;
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