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
    <div class="comment-title">精彩评论({{commentObj.total}})</div>
    <section>

      <!-- <scroll :data="commentObj.comments"
              ref="commentScroll"
              :pullUp="pullUp"
              @pullingUpLoad="handlePullingUp">

      </scroll> -->
      <div class="content">
        <!-- 相关音乐 -->
        <div v-if="commentObj.isMusic"
             class="related-music">
          <p>相关音乐</p>
          <!-- <song-item></song-item> -->
        </div>
        <!-- 评论列表 -->
        <van-list v-model="loading"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="handlePullingUp">
          <comment-list :commentList="commentObj.comments"></comment-list>
        </van-list>
      </div>
    </section>

  </div>
</template>
<script>
import VideoComponent from './Video'
// import SongItem from '@/components/home/song/SongItem'
import CommentList from '@/components/home/comment/CommentList'
// import Scroll from '@/components/common/Scroll'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      loading: false,
      finished: false
    }
  },
  computed: {
    ...mapState(['selectVideo', 'commentObj'])
  },
  methods: {
    ...mapActions(['getVideoComment']),
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
    // SongItem,
    CommentList
    // Scroll
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.videoInfo-container {
  background: #fff;
  width: 100%;

  .comment-title {
    font-size: $font-size-smaller;
    font-weight: bold;
    text-indent: 1em;
    height: 1rem;
    line-height: 1rem;
  }

  section {
    width: 100%;
    height: calc(100vh - (1.22667rem + 8.5rem + 1rem + 1.8rem));

    .content {
      padding: 0 0.5rem 1.8rem;

      .related-music {
        p {
          height: 1rem;
          line-height: 1rem;
          font-size: $font-size-smaller;
          font-weight: bold;
        }
      }
    }
  }
}
</style>