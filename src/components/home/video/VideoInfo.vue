<template>
  <div class="videoInfo-container">
    <!-- 正在加载 -->
    <template v-if="!video">
      <!-- loading -->
      <loading />
    </template>
    <template v-else>
      <div class="video"
           ref="video">
        <video-component :videoParams="video"
                         :class="fixed?'fixed':''"
                         @openFullScreen="fixed=false"
                         @closeFullScreen="fixed=true"
                         @toggleInfo="handleToggleInfo">
        </video-component>
        <div class="fixed-box"></div>
      </div>
      <section class="container">
        <!-- 视频信息 -->
        <div class="video-info"
             v-if="!loadVideoInfo">
          <div class="info-top"
               @click="handleToggleInfo">
            <div class="content">
              <!-- 视频标题 -->
              <div class="title">
                <div class="icon">
                  <van-tag size="large"
                           plain
                           color="#FD4979">mv</van-tag>
                </div>
                <div class="name">{{video.name}}</div>
              </div>
              <div class="right-icon">
                <van-icon :name="rightIcon" />
              </div>

            </div>

            <!-- 视频描述 -->
            <div class="video-desc-container animated fadeIn"
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
          <!-- 视频收藏、分享、点赞、评论 -->
          <div class="info-center van-hairline--bottom">
            <div class="item"
                 :class="video.liked?'active':''"
                 @click="handleClickLike">
              <div class="love icon">
                <i class="iconfont icon-dianzan"></i>
              </div>
              <p class="text">{{video.likeCount|convertCount}}</p>
            </div>
            <div class="item"
                 :class="video.followed?'active':''"
                 @click="handleClickFollow">
              <div class="follow icon">
                <van-icon :name="followIcon" />
              </div>
              <p class="text">{{video.subCount|convertCount}}</p>
            </div>
            <div class="item"
                 @click="handleClickComment">
              <div class="comment icon">
                <van-icon name="more-o" />
              </div>
              <p class="text">{{video.commentCount|convertCount}}</p>
            </div>
            <div class="item"
                 ref="share"
                 @click="handleClickShare()">
              <div class="share icon">
                <i class="iconfont icon-fenxiang"></i>
              </div>
              <p class="text">{{video.shareCount|convertCount}}</p>
            </div>
          </div>
          <!-- 视频出处 -->
          <div class="info-bottom"
               @click="selectCreator(video.creatorList)">
            <div class="play-source-img">
              <my-image :src="video.artist.avatar" />
            </div>
            <div class="play-source-author">
              {{video.creatorName}}
            </div>
          </div>
        </div>
        <div class="other-info"
             v-if="!loadVideoInfo">
          <!-- 相关mv -->
          <div class="related-mv"
               v-if="simiMVList">
            <p>相关视频</p>
            <video-list :list="simiMVList"
                        @select="goToVideoInfo"></video-list>
          </div>
          <!-- 评论列表 -->
          <div class="comment"
               ref="commentContainer"
               v-if="simiMVList&&commentList">
            <div class="comment-title">精彩评论 {{commentText}}</div>
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
        <loading :loading="loadVideoInfo||!simiMVList||!commentList" />
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
import Clipboard from 'clipboard'
import MyImage from '@/components/common/img/Image'
import VideoComponent from './Video'
import CommentList from '@/components/home/comment/CommentList'
import VideoList from '@/components/common/video/VideoList'
import NoResult from '@/components/common/NoResult'
import videoApi from '@/api/video.js'
import VideoDetail from '@/assets/common/js/videoDetail.js'
import Video from '@/assets/common/js/video.js'
import Singer from '@/assets/common/js/singer.js'
import SingerPopup from '@/components/common/SingerPopup'
import userApi from '@/api/user.js'
import {
  mapMutations,
  mapState,
} from 'vuex'
import {
  ERR_OK
} from '@/api/config.js'
import {
  RECOURCE_TYPE
} from '@/assets/common/js/config.js'

export default {
  name: 'videoInfo',
  props: {
    id: String
  },
  data () {
    return {
      loading: false, // 加载中
      loadVideoInfo: false, // 加载视频详情
      finished: false, // 加载完所有数据
      video: null, // 视频
      simiMVList: null, // 相似mv列表
      commentList: null, // 评论列表
      commentCount: 0, // 评论数量
      showMoreInfo: false, // 是否显示更多信息
      showSingerPopup: false, // 显示歌手弹出层
      fixed: true // 固定视频
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
    ...mapState(['currentPlayIndex', 'user']),
    commentText () {
      return this.commentCount === 0 ? '' : this.commentCount
    },
    rightIcon () {
      return this.showMoreInfo ? 'arrow-up' : 'arrow-down'
    },
    followIcon () {
      return this.video.followed ? 'like' : 'like-o'
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
      // 初始化分享
      this.initShare()

    })
  },
  methods: {
    ...mapMutations(['setHideMiniPlayer', 'setSingerCurrentIndex', 'setAddNoCacheComponents']),
    // 获取视频详情
    async getVideoDetail (id) {
      try {
        // 获取视频详情
        const { data: videoDetailRes } = await videoApi.getVideoDetail(id);
        if (videoDetailRes.code !== ERR_OK) {
          this.$toast.fail('系统出错');
          return;
        }
        // 获取视频 URL
        const { data: videoUrlRes } = await videoApi.getVideoUrl(id);
        if (videoUrlRes.code !== ERR_OK) {
          this.$toast.fail('系统出错');
          return;
        }
        const videoData = videoDetailRes.data;
        // 获取歌手信息
        const creatorList = this.getSingerInfo(videoData.artists);
        // 创建视频详情对象
        const video = new VideoDetail({
          id: videoData.id,
          coverUrl: videoData.cover,
          name: videoData.briefDesc || videoData.name,
          playCount: videoData.playCount,
          subCount: videoData.subCount,
          commentCount: videoData.commentCount,
          shareCount: videoData.shareCount,
          publishTime: videoData.publishTime,
          desc: videoData.desc,
          duration: videoData.duration,
          creatorName: videoData.artists.map(item => item.name).join(' / '),
          creatorList,
          artist: creatorList[0],
          followed: videoDetailRes.subed,
          url: videoUrlRes.data.url,
        });
        this.video = video;
        // 获取视频的点赞和评论信息
        this.loadVideoInfo = true;
        const { data: videoDetailInfoRes } = await videoApi.getVideoDetailInfo(id);
        if (videoDetailInfoRes.code === ERR_OK) {
          video.liked = videoDetailInfoRes.liked;
          video.likeCount = videoDetailInfoRes.likedCount;
        }
        this.loadVideoInfo = false;
        // 更新组件状态
        this.commentCount = videoData.commentCount;
        this.video = video;
      } catch (error) {
        this.$toast.fail('系统出错');
        this.$router.replace('/');
      }
    },
    //获取歌手信息
    getSingerInfo (artists) {
      const creatorList = [];
      for (const item of artists) {
        const artist = item;
        const creator = new Singer({
          id: artist.id,
          name: artist.name,
          avatar: artist.img1v1Url,
          followed: artist.followed,
        });
        creatorList.push(creator);
      }
      return creatorList;
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
    handleClickFollow () {
      if (this.user) { // 说明已经登录
        this.follow() // 收藏/取消收藏专辑
      } else { // 弹窗提示去登录
        this.$utils.alertLogin(this.$router.currentRoute.fullPath)
      }
    },
    // 收藏/取消收藏专辑
    follow () {
      let follow = !this.video.followed
      follow = follow ? 1 : 0 // 1代表收藏，0代表不收藏
      if (follow) { // 收藏
        userApi.updateFollowVideo(this.video.id, follow).then(res => {
          if (res.data.code === ERR_OK) {
            this.video.followed = true
            this.video.subCount += 1
            this.$toast('收藏成功')
          }
        }).catch(err => {
          this.$toast(err.data.message)
        })
      } else {
        this.$utils.alertConfirm({
          message: '确定取消收藏该视频',
          confirmButtonText: '确定'
        }).then(async () => {
          userApi.updateFollowVideo(this.id, follow).then(res => {
            if (res.data.code === ERR_OK) {
              this.video.followed = false
              this.video.subCount -= 1
              this.$toast('已取消收藏')
            }
          }).catch(err => {
            this.$toast(err.data.message)
          })
        }).catch(() => { })
      }
    },
    // 选中歌曲喜欢
    handleClickLike () {
      let video = this.video
      if (this.user) { // 说明已经登录
        this.likeVideo(video) // 点赞视频
      } else { // 弹窗提示去登录
        this.$utils.alertLogin(this.$router.currentRoute.fullPath)
      }
    },
    likeVideo (video) {
      let like = !video.liked
      userApi.resourceLike({
        id: video.id,
        type: RECOURCE_TYPE.mv,
        t: like
      }).then(res => {
        if (res.data.code === ERR_OK) {
          // 同步点赞状态
          this.video.liked = like
          if (like) { // 点赞加1
            this.video.likeCount += 1
            this.$toast('点赞成功')
          } else { // 取消点赞加1
            this.video.likeCount -= 1
            this.$toast('已取消点赞')
          }
        }
      }).catch(err => {
        this.$toast(err.data.message)
      })
    },
    // 点击评论
    handleClickComment () {
      let element = this.$refs.commentContainer
      let player = this.$refs.video
      let top = element.offsetTop - player.offsetHeight
      window.scrollTo(0, top)
    },
    // 分享
    handleClickShare () {
      this.clipboard.on('success', e => {
        this.$toast('已复制到剪贴板')
      })
      this.clipboard.on('error', e => {
        this.$toast('浏览器不支持自动复制')
      })
    },
    // 初始化分享
    initShare () {
      // 分享
      this.clipboard = new Clipboard(this.$refs.share, {
        text: () => {
          if (this.user) {
            return `${this.video.creatorName}的视频《${this.video.name}》:\rhttps://music.163.com/#/mv/${this.video.id}/?userid=${this.user.userId}(来自@网易云音乐)`
          } else {
            return `${this.video.creatorName}的视频《${this.video.name}》:\rhttps://music.163.com/#/mv/${this.video.id}(来自@网易云音乐)`
          }
        }
      })
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

  .fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 999;
  }

  .fixed-box {
    width: 100%;
    height: 5.17rem;
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
        padding: 0.1rem 0.4rem 0;
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

      .info-center {
        padding: 0.3rem 0;
        display: flex;

        .item {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          color: $color-common-b2;

          .icon {
            height: 0.7rem;
            line-height: 0.7rem;
            margin-bottom: 0.2rem;

            i {
              font-size: $font-size-large;
            }
          }

          p {
            font-size: $font-size-smaller-x;
          }

          &.active {
            .icon {
              color: $color-common;
            }
          }
        }
      }

      .info-bottom {
        padding: 0.2rem 0.4rem;
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
      .comment-title {
        font-size: $font-size-smaller;
        font-weight: bold;
        height: 1rem;
        line-height: 1rem;
      }

      .related-mv {
        margin-bottom: 0.4rem;
        background: #fff;
        padding: 0 0.4rem 0.4rem;

        p {
          height: 1rem;
          line-height: 1rem;
          font-size: $font-size-smaller;
          font-weight: bold;
        }
      }

      .comment {
        padding: 0 0.4rem;
        background: #fff;
      }
    }
  }
}
</style>