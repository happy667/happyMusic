<template>
  <div class="videoList-container">
    <!-- 正在加载 -->
    <loading :loading="videoList.length===0" />
    <scroll :data="videoList"
            ref="videoListScroll"
            :pullUp="pullUp"
            @pullingUpLoad="handlePullingUp">
      <div class="video-list"
           ref="container">
        <template v-if="videoList.length>0">
          <template v-for="item in videoList">
            <video-item :videoParams="item"
                        :key="item.id"></video-item>
          </template>
        </template>
        <!-- loading -->
        <loading :loading="loadMore"
                 height="3rem" />

      </div>
    </scroll>

  </div>
</template>
<script>
import VideoItem from './VideoItem'
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
      videoList: [] // 视频列表
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
  watch: {
    loadMore () {
      this.$nextTick(() => {
        this.refresh()
      })
    }
  },
  methods: {
    // 上拉加载
    handlePullingUp () {
      if (this.loadMore) { // 如果请求未完成就不继续请求数据
        return
      }
      clearTimeout(this.loadTimer)
      this.loadMore = true
      this.loadTimer = setTimeout(async () => {
        await this.getVideoList()
        this.$nextTick(() => {
          this.$refs.videoListScroll.finishPullUp()
        })
      }, 300)
    },
    // 获取推荐视频
    async getVideoList (context) {
      try {
        const offset = this.videoList.length
        const {
          data: res
        } = await videoApi.getRecommendVideo(offset)
        if (res.code === ERR_OK) {
          const data = res.data
          let videoList = []
          let length = 0 // 用于判断是否执行完毕
          data.forEach(async (item) => {
            // 获取歌手信息
            const {
              data: res2
            } = await SingerApi.getSinger(item.artistId)
            if (res2.code === ERR_OK) {
              let video = new Video({
                id: item.id,
                coverUrl: item.cover,
                name: item.name,
                playCount: item.playCount,
                artist: {
                  id: res2.artist.id,
                  name: res2.artist.name,
                  avatarUrl: res2.artist.img1v1Url
                }
              })
              length++
              this.videoList.push(video)
              if (length === data.length) { // 说明请求完成
                this.loadMore = false
              }
            }
          })
        }
      } catch (e) {
        this.$toast(e.message)
      }
    },
    // 刷新
    refresh () {
      this.$refs.videoListScroll.refresh()
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
  position: absolute;
  width: 100%;
  height: 100%;
  background: $color-common-background;
  box-sizing: border-box;
}
</style>