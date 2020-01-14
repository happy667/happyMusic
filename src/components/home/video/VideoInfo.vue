<template>
  <div class="videoInfo-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar title="MV"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>
    <div class="video">
      <video-component :videoParams="selectVideo"></video-component>
    </div>
    <!-- 相关mv -->

    <div class="content">
      <div class="related-mv">
        <van-loading class="load"
                     size="1rem"
                     color="#FD4979"
                     v-if="simiMVList.length===0" />
        <p>相关MV</p>
        <template v-if="simiMVList.length!==0">
          <mv-list :list="simiMVList"></mv-list>
        </template>
      </div>
      <div class="comment">
        <div class="comment-title">精彩评论{{commentTotal}}</div>
        <!-- 评论列表 -->

        <van-list v-model="loading"
                  :finished="finished"
                  :finished-text="commentObj.total===0?'':'没有更多了'"
                  @load="handlePullingUp">
          <template v-if="commentObj.comments.length!==0">
            <comment-list :commentList="commentObj.comments"></comment-list>
          </template>
          <template v-else>
            <div class="comment-list">
              还没有小伙伴发表评论哦~
            </div>
          </template>
        </van-list>

      </div>
    </div>
  </div>
</template>
<script>
import VideoComponent from './Video'
import CommentList from '@/components/home/comment/CommentList'
import MvList from '@/components/common/mv/MvList'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      loading: false,
      finished: false
    }
  },
  created () {
    this.$nextTick(() => {
      console.log(123)
      this.getSimiMV()
    })
  },
  computed: {
    ...mapState(['selectVideo', 'commentObj', 'simiMVList']),
    commentTotal () {
      return this.commentObj.total === 0 ? '' : this.commentObj.total
    }
  },
  methods: {
    ...mapActions(['getVideoComment', 'getSimiMV']),
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    },

    // 上拉加载
    handlePullingUp () {
      setTimeout(async () => {
        await this.getVideoComment()
        if (this.commentObj.comments.length >= this.commentObj.total) {
          this.finished = true
        }
        this.loading = false
      }, 500)
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.selectVideo.id) {
        vm.$router.push('/home')
      }
    })
  },
  components: {
    VideoComponent,
    CommentList,
    MvList
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.videoInfo-container {
  background: $color-common-background;
  width: 100%;

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

      .comment-list {
        width: 100%;
        height: 1rem;
        color: $color-common-b;
        font-size: $font-size-smaller;
        text-align: center;
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