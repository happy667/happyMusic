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
      <div class="video"
           :class="fixed?'fixed':''">
        <video-component :videoParams="video"
                         @openFullScreen="fixed=false"
                         @closeFullScreen="fixed=true"
                         @toggleInfo="handleToggleInfo">
        </video-component>
      </div>
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
               @click="selectCreator(video.creatorList)">
            <div class="play-source-img">
              <my-image :src="video.artist.avatarUrl" />
            </div>
            <div class="play-source-author">
              {{video.creatorName}}
            </div>
          </div>
        </div>
        <div class="other-info">
          <template v-if="!simiMVList&&!commentList">
            <!-- loading -->
            <loading />
          </template>
          <template v-else>
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
          </template>
        </div>
      </section>
      <singer-popup :list="video.creatorList"
                    :showPopup="showSingerPopup"
                    @closePopup="showSingerPopup=false"
                    @finishedLoadImage="handleFinished"
                    @clickListItem="clickListItem"
                    :isLoadImage="isLoadImage"></singer-popup>
    </template>

  </div>
</template>
<script>
import MyImage from '@/components/common/img/Image'
import VideoComponent from './Video'
import CommentList from '@/components/home/comment/CommentList'
import VideoList from '@/components/common/video/VideoList'
import NoResult from '@/components/common/NoResult'
import videoApi from '@/api/video.js'
import singerApi from '@/api/singer.js'
import VideoDetail from '@/assets/common/js/videoDetail.js'
import Video from '@/assets/common/js/video.js'
import Singer from '@/assets/common/js/singer.js'
import SingerPopup from '@/components/common/SingerPopup'
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
      showMoreInfo: false, // 是否显示更多信息
      showSingerPopup: false, // 显示歌手弹出层
      fixed: true// 固定视频
    }
  },
  beforeRouteLeave (to, from, next) {
    // 如果播放就显示迷你播放器
    if (this.currentPlayIndex !== -1) {
      this.setHideMiniPlayer(false)
    }
    next()
  },
  activated () {
    // 初始化加载图片
    this.isLoadImage = true
  },
  inject: ['reload'],
  computed: {
    ...mapState(['currentPlayIndex']),
    commentText () {
      return this.commentCount === 0 ? '' : this.commentCount
    },
    rightIcon () {
      return this.showMoreInfo ? 'arrow-up' : 'arrow-down'
    },
    // 是否要加载图片
    isLoadImage: {
      get () {
        return this.$store.state.isLoadVideoInfoImage
      },
      set (val) {
        this.$store.commit('setIsLoadVideoInfoImage', val)
      }
    }
  },
  mounted () {
    this.$nextTick(async () => {
      await this.getVideoDetail(this.id)
      await this.getSimiMV(this.id)
      await this.getVideoComment(this.id)
      // 初始化加载图片
      this.isLoadImage = true
    })
  },
  methods: {
    ...mapMutations(['setHideMiniPlayer', 'setSingerCurrentIndex', 'setAddNoCacheComponents']),
    // 返回上一个路由
    routerBack () {
      this.$utils.routerBack()
    },
    // 获取视频详情
    async getVideoDetail (id) {
      const { data: res } = await videoApi.getVideoDetail(id)
      if (res.code === ERR_OK) {
        const data = res.data
        let creatorList = []
        let video = new VideoDetail({
          id: data.id,
          coverUrl: data.cover,
          name: data.name,
          playCount: data.playCount,
          url: this.handleUrls(data.brs),
          publishTime: data.publishTime,
          desc: data.desc,
          duration: data.duration,
          creatorName: data.artists.map(item => item.name).join('/'),
          creatorList
        })

        data.artists.forEach(item => {
          let creator = new Singer({
            id: item.id,
            name: item.name
          })
          creatorList.push(creator)
        })

        console.log(video)
        // 获取歌手信息
        const { data: res2 } = await singerApi.getSinger(data.artistId)
        if (res2.code === ERR_OK) {
          video.artist = { id: res2.artist.id, name: res2.artist.name, avatarUrl: res2.artist.picUrl }
          this.commentCount = data.commentCount
          this.video = video
          if (!this.video.url) {
            this.$toast.fail('暂无视频资源')
          }
        }

        console.log(this.video)
      }
    },
    // 处理路径
    handleUrls (urls) {
      let url = ''
      if (urls[1024]) {
        url = urls[1024]
      } else if (urls[720]) {
        url = urls[720]
      } else if (urls[480]) {
        url = urls[480]
      } else if (urls[240]) {
        url = urls[240]
      }
      return url
    },
    // 获取相似mv
    async getSimiMV (id) {
      const {
        data: res
      } = await videoApi.getSimiMV(id)
      if (res.code === ERR_OK) {
        // 用于保存处理后的视频列表
        let videoList = []
        res.mvs.forEach(item => {
          let video = new Video({
            id: item.id,
            coverUrl: item.cover,
            name: item.name,
            playCount: item.playCount,
            duration: item.duration,
            creatorName: item.artists.map(item => item.name).join('/')
          })
          videoList.push(video)
        })
        this.simiMVList = videoList
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
      // 初始化加载图片
      this.isLoadImage = true
      this.setAddNoCacheComponents('videoInfo')
      this.$router.push(`/videoInfo/${mv.id}`)
    },
    // 切换显示隐藏视频详情信息
    handleToggleInfo () {
      this.showMoreInfo = !this.showMoreInfo
    },
    // 选择创作者
    selectCreator () {
      console.log(123)
      let list = this.video.creatorList
      if (list.length === 1) { // 只有一个歌手直接跳转到歌手页面
        this.setSingerCurrentIndex(0)
        this.$router.push(`/singerInfo/${list[0].id}`)
      } else {
        this.showSingerPopup = true
      }
    },
    // 选择列表中歌手
    clickListItem () {
      this.showSingerPopup = false
    },
    // 数据获取完成
    handleFinished () {
      this.isLoadImage = false
    }

  },
  components: {
    VideoComponent,
    CommentList,
    VideoList,
    NoResult,
    MyImage,
    SingerPopup
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.videoInfo-container {
  background: $color-common-background;
  width: 100%;
  min-height: 100vh;

  .video {
    &.fixed {
      position: sticky;
      top: 46px;
      left: 0;
      width: 100%;
      z-index: 10;
    }
  }

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
          flex: 1;
          font-size: $font-size-smaller;
          height: 0.6rem;
          line-height: 0.6rem;
          no-wrap();
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