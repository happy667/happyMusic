<template>
  <div class="videoInfo-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar :title="$route.meta.title"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>
    <!-- 正在加载 -->
    <template v-if="!video">
      <!-- loading -->
      <loading />
    </template>
    <template v-else>
      <van-sticky :offset-top="46">
        <div class="video">
          <video-component :videoParams="video"
                           @toggleInfo="handleToggleInfo" />
        </div>
      </van-sticky>
      <section class="container">
        <!-- 视频信息 -->
        <div class="video-info">
          <div class="info-top van-hairline--bottom"
               @click="handleToggleInfo">
            <div class="content">
              <!-- 视频标题 -->

              <div class="title">
                <div class="icon">
                  <van-tag plain
                           color="#FD4979">mv</van-tag>
                </div>
                <div class="name">{{video.name}}</div>
              </div>
              <div class="right-icon">
                <van-icon :name="rightIcon" />
              </div>

            </div>

            <!-- 视频描述 -->
            <div class="video-desc-container"
                 v-show="showMoreInfo">
              <div class="top">
                <div class="video-num">{{video.playCount}} 次观看</div>
                <div class="video-time">{{video.publishTime}} 发布</div>
              </div>
              <div class="bottom">
                <div class="desc">{{video.desc}}</div>
              </div>
            </div>
          </div>
          <!-- 视频出处 -->
          <div class="info-bottom"
               @click="selectSinger(video.artist)">
            <div class="play-source-img">
              <mini-image :avatar="video.artist.avatarUrl"></mini-image>
            </div>
            <div class="play-source-author">
              {{video.artist.name}}
            </div>
          </div>
        </div>
        <div class="other-info">
          <!-- 相关mv -->
          <div class="related-mv"
               v-if="simiMVList">
            <p>相关视频</p>
            <video-list :list="simiMVList"
                        @select="goToVideoInfo"></video-list>
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
      </section>
    </template>
  </div>
</template>
<script>
import MiniImage from '../img/MiniImage'
import VideoComponent from './Video'
import CommentList from '@/components/home/comment/CommentList'
import VideoList from '@/components/common/video/VideoList'
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
    },
    rightIcon () {
      return this.showMoreInfo ? 'arrow-up' : 'arrow-down'
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
    ...mapMutations(['setHideMiniPlayer', 'setSingerCurrentIndex']),
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
    // 解除监听滚动
    removeListenerScroll () {
      window.removeEventListener('scroll', this.handleScroll)
    },
    // 添加监听滚动
    addListenerScroll () {
      window.addEventListener('scroll', this.handleScroll)
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
      this.$router.push(`/videoInfo/${mv.id}`)
    },
    // 选择歌手
    selectSinger (item) {
      this.setSingerCurrentIndex(0)
      this.$router.push(`/singerInfo/${item.id}`)
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
    NoResult,
    MiniImage
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.videoInfo-container {
  background: $color-common-background;
  width: 100%;
  min-height: 100vh;

  .container {
    width: 100%;
    box-sizing: border-box;
    background: $color-common-b;

    .video-info {
      margin-bottom: 0.4rem;
      background: $color-common-background;
      display: flex;
      flex-direction: column;

      .info-top {
        padding: 0.1rem 0.5rem;
        line-height: 1rem;

        .content {
          display: flex;
          justify-content: space-between;

          .title {
            display: flex;
            width: 100%;
            no-wrap();

            .icon {
              margin-right: 0.2rem;
            }

            .name {
              font-size: $font-size-smaller;
              no-wrap();
            }
          }

          .right-icon {
            width: 1rem;
            text-align: center;
          }
        }

        .video-desc-container {
          color: $color-common-b2;
          font-size: $font-size-mini;

          .top {
            display: flex;
            justify-content: space-between;
            line-height: 0.6rem;
          }

          .bottom {
            line-height: 0.5rem;
          }
        }
      }

      .info-bottom {
        padding: 0.2rem 0.5rem;
        display: flex;
        align-items: center;

        .play-source-img {
          margin-right: 0.3rem;
        }

        .play-source-author {
          font-size: $font-size-smaller;
        }
      }
    }

    .other-info {
      padding: 0 0.5rem;
      background: $color-common-background;

      .comment-title {
        font-size: $font-size-smaller-x;
        font-weight: bold;
        height: 1rem;
        line-height: 1rem;
      }

      .related-mv {
        p {
          height: 1rem;
          line-height: 1rem;
          font-size: $font-size-smaller-x;
          font-weight: bold;
        }
      }
    }
  }
}
</style>