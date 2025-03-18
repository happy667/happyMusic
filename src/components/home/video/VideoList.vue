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
import singerApi from '@/api/singer.js'
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
    async getVideoList () {
      try {
        const offset = this.videoList.length;
        const { data: res } = await videoApi.getRecommendVideo(offset);
        if (res.code !== ERR_OK) {
          this.$toast.fail('系统出错');
          return
        }

        const data = res.data;

        // 使用 Promise.all 并行获取歌手信息
        const videoPromises = data.map(async (item) => {
          const { data: singerRes } = await singerApi.getSinger(item.artistId);
          if (singerRes.code !== ERR_OK) {
            this.$toast.fail('系统出错');
            return
          }

          return new Video({
            id: item.id,
            coverUrl: item.cover,
            name: item.name,
            playCount: item.playCount,
            artist: {
              id: singerRes.artist.id,
              name: singerRes.artist.name,
              avatarUrl: singerRes.artist.img1v1Url,
            },
          });
        });

        // 等待所有视频信息获取完成
        const newVideos = await Promise.all(videoPromises);
        this.videoList = [...this.videoList, ...newVideos];
        this.loadMore = false; // 请求完成，关闭加载更多状态
      } catch (error) {
        this.$toast('获取视频列表失败');
        this.loadMore = false; // 请求失败，关闭加载更多状态
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