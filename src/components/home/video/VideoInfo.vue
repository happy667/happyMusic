<template>
  <div class="videoInfo-container">
    <!-- 头部导航栏 -->
    <van-nav-bar :title="$route.meta.title"
                 left-arrow
                 @click-left="routerBack" />
    <!-- 正在加载 -->
    <template v-if="!video">
      <van-loading size="24px"
                   color="#FD4979"
                   vertical>加载中...</van-loading>
    </template>
    <template v-else>
      <van-sticky>
        <div class="video">
          <video-component :videoParams="video"
                           @toggleInfo="handleToggleInfo"
                           :showMoreInfo="showMoreInfo"
                           :moreInfo="true"></video-component>
        </div>
      </van-sticky>
      <div class="content">
        <!-- 相关mv -->
        <div class="related-mv"
             v-if="simiMVList">
          <p>相关视频</p>
          <video-list :list="simiMVList"
                      @click="goToVideoInfo"></video-list>
        </div>
        <!-- 评论列表 -->
        <div class="comment"
             v-if="commentList">
          <div class="comment-title">精彩评论{{commentText}}</div>
          <van-list v-model="loading"
                    :immediate-check='false'
                    :finished="finished"
                    :finished-text="commentCount===0?'':'没有更多了'"
                    @load="handlePullingUp">
            <template v-if="commentList.length!==0">
              <comment-list :commentList="commentList"></comment-list>
            </template>
            <template v-else>
              <no-result text="还没有小伙伴发表评论哦~"></no-result>
            </template>
          </van-list>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import VideoComponent from './Video'
import CommentList from '@/components/home/comment/CommentList'
import VideoList from '@/components/common/mv/MvList'
import NoResult from '@/components/common/NoResult'
import videoApi from '@/api/video.js'
import SingerApi from '@/api/singer.js'
import VideoDetail from '@/assets/common/js/videoDetail.js'
import { mapMutations, mapState } from 'vuex'
import {
  ERR_OK
} from '@/api/config.js'
export default {
  name: 'videoInfo',
  props: {
    id: String
  },
  data () {
    return {
      loading: false, // 加载中
      finished: false, // 加载完所有数据
      video: null, // 视频
      simiMVList: null, // 相似mv列表
      commentList: null, // 评论列表
      commentCount: 0, // 评论数量
      showMoreInfo: false// 是否显示更多信息
    }
  },
  beforeRouteLeave (to, from, next) {
    // 如果播放就显示迷你播放器
    if (this.currentPlayIndex !== -1) {
      this.setHideMiniPlayer(false)
    }
    next()
  },
  inject: ['reload'],
  computed: {
    ...mapState(['currentPlayIndex']),
    commentText () {
      return this.commentCount === 0 ? '' : this.commentCount
    }
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getVideoDetail(this.id)
      await this.getSimiMV(this.id)
      await this.getVideoComment(this.id)
    })
  },
  methods: {
    ...mapMutations(['setIsAdvance', 'setHideMiniPlayer']),
    // 返回上一个路由
    routerBack () {
      this.$utils.routerBack()
    },
    // 获取视频详情
    async getVideoDetail (id) {
      const { data: res } = await videoApi.getVideoDetail(id)
      if (res.code === ERR_OK) {
        const data = res.data
        // 获取歌手信息
        const { data: res2 } = await SingerApi.getSinger(data.artistId)
        if (res2.code === ERR_OK) {
          let video = new VideoDetail({
            id: data.id,
            coverUrl: data.cover,
            name: data.name,
            playCount: data.playCount,
            artist: { id: res2.artist.id, name: res2.artist.name, avatarUrl: res2.artist.picUrl },
            url: data.brs[1080],
            publishTime: data.publishTime,
            desc: data.desc
          })

          this.commentCount = data.commentCount
          this.video = video
        }
        console.log(this.video)
      }
    },
    // 获取相似mv
    async getSimiMV (id) {
      const {
        data: res
      } = await videoApi.getSimiMV(id)
      if (res.code === ERR_OK) {
        this.simiMVList = res.mvs
      }
    },
    // 获取该mv评论
    async getVideoComment (id) {
      let offset = this.commentList ? this.commentList.length : 0
      let list = this.commentList ? this.commentList : []
      const {
        data: res
      } = await videoApi.getVideoComment(id, offset)
      if (res.code === ERR_OK) {
        this.commentList = list.concat(res.comments)
        console.log(this.commentList)
      }
    },
    // 上拉加载
    handlePullingUp () {
      setTimeout(async () => {
        await this.getVideoComment(this.id)
        if (this.commentList.length >= this.commentCount) {
          this.finished = true
        }
        this.loading = false
      }, 500)
    },
    goToVideoInfo (mv) {
      this.reload()
      // 设置为前进页面
      this.setIsAdvance(true)
      this.$router.push(`/videoInfo/${mv.id}`)
    },
    // 切换显示隐藏视频详情信息
    handleToggleInfo () {
      this.showMoreInfo = !this.showMoreInfo
    }
  },
  components: {
    VideoComponent,
    CommentList,
    VideoList,
    NoResult
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.videoInfo-container {
  background: $color-common-background;
  width: 100%;
  min-height: 100vh;

  .content {
    width: 100%;
    box-sizing: border-box;
    padding: 0 0.5rem;
    min-height: cale(1.22667rem + 8.5rem);

    .comment {
      .comment-title {
        font-size: $font-size-smaller;
        font-weight: bold;
        height: 1rem;
        line-height: 1rem;
      }
    }

    .related-mv {
      p {
        height: 1rem;
        line-height: 1rem;
        font-size: $font-size-smaller;
        font-weight: bold;
      }
    }
  }
}
</style>