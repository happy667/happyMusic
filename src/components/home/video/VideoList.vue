<template>
  <div class="videoList-container">
    <template v-for="item in videoList">
      <video-item :video="item"
                  :key="item.id"></video-item>
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
  created () {
    // 获取推荐视频
    this.getRecommendVideo()
  },
  methods: {
    // 获取推荐视频
    async getRecommendVideo () {
      const { data: res } = await videoApi.getRecommendVideo()
      if (res.code === ERR_OK) {
        this.videoList = res.data
        this.videoList.forEach(async (item) => {
          // 获取视频url
          const { data: res } = await videoApi.getRecommendVideoUrl(item.id)
          if (res.code === ERR_OK) {
            item.videoUrl = res.data.url
          }
          // 获取歌手头像
          // 因为接口没有直接获取用户头像的所以借用获取歌手单曲来获取歌手头像
          const { data: res2 } = await singerApi.getSingerSong(item.artistId)
          if (res2.code === ERR_OK) {
            console.log(res2)
            item.avatar = res2.artist.picUrl
          }
        })
      }
      console.log(this.videoList)
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