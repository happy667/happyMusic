<template>
  <div class="videoList-container">
    <!-- 正在加载 -->
    <van-loading v-show="this.videoList.length === 0"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <template v-if="this.videoList.length!==0">
      <template v-for="item in videoList">
        <video-item :videoParams="item"
                    :key="item.id"></video-item>
      </template>
    </template>

  </div>
</template>
<script>
import VideoItem from './Video'
import videoApi from '@/api/video.js'
import singerApi from '@/api/singer.js'
import {
  ERR_OK
} from '@/api/config.js'
export default {
  data () {
    return {
      videoList: []
    }
  },
  mounted () {
    // 获取推荐视频
    this.getRecommendVideo()
  },
  watch: {
    videoList () {
      if (this.videoList.length === 0) {
        this.getRecommendVideo()
      }
    }
  },
  methods: {
    // 获取推荐视频
    async getRecommendVideo () {
      let videoList = []
      const { data: res } = await videoApi.getRecommendVideo()
      if (res.code === ERR_OK) {
        videoList = res.data
      }
      // 获取视频url
      await this.getVideoUrl(videoList)
      // 获取歌手头像
      await this.getSingerAvatar(videoList)
      // 使用settimeout异步的机制给videoList赋值
      setTimeout(() => {
        this.videoList = videoList
        console.log(this.videoList)
      }, 0)
    },
    // 获取视频url
    getVideoUrl (videoList) {
      videoList.forEach(async (item) => {
        const { data: res } = await videoApi.getRecommendVideoUrl(item.id)
        if (res.code === ERR_OK) {
          item.videoUrl = res.data.url
        }
      })
    },
    // 获取歌手头像
    // 因为接口没有直接获取用户头像的所以借用获取歌手单曲来获取歌手头像
    getSingerAvatar (videoList) {
      videoList.forEach(async (item) => {
        const { data: res2 } = await singerApi.getSingerSong(item.artistId)
        if (res2.code === ERR_OK) {
          item.avatar = res2.artist.img1v1Url
        }
      })
    }
  },
  components: {
    VideoItem
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.videoList-container {
  padding: 0.5rem;
  width: 100%;
  box-sizing: border-box;
}
</style>