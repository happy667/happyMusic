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
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      load: true, // 是否加载
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
    ...mapState(['videoList'])
  },
  methods: {
    ...mapMutations(['setVideoList']),
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
    async getVideoList (context) {
      const offset = this.videoList.length
      console.log(this.videoList)
      const { data: res } = await videoApi.getRecommendVideo(offset)
      if (res.code === ERR_OK) {
        const data = res.data
        let videoList = []
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
              videoList.push(video)
            }
          }
        })
        setTimeout(() => {
          this.setVideoList(videoList)
        }, 2000)
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

.videoList-container {
  .video-list {
    width: 100%;
    padding: 0.5rem;
    box-sizing: border-box;
    position: absolute;
  }

  .no-login {
    /* 减去搜索框、导航栏 */
    height: calc(100vh - (1.7rem + 1.18rem));
  }
}
</style>