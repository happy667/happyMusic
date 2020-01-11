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
    <div class="comment-title">精彩评论</div>
    <section>

      <scroll :data="commentObj.comments"
              ref="commentScroll"
              :pullUp="pullUp"
              @pullingUpLoad="handlePullingUp">
        <div class="content">
          <!-- 相关音乐 -->
          <div v-if="commentObj.isMusic"
               class="related-music">
            <p>相关音乐</p>
            <!-- <song-item></song-item> -->
          </div>
          <!-- 评论列表 -->
          <comment-list :commentList="commentObj.comments"></comment-list>
        </div>

      </scroll>
    </section>

  </div>
</template>
<script>
import VideoComponent from './Video'
// import SongItem from '@/components/home/song/SongItem'
import CommentList from '@/components/home/comment/CommentList'
import Scroll from '@/components/common/Scroll'
import { mapState } from 'vuex'
import videoApi from '@/api/video.js'
import {
  ERR_OK
} from '@/api/config.js'
export default {
  data () {
    return {
      offset: 0, // 偏移量
      currentIndex: 0, // 当前索引
      commentObj: {}// 评论
    }
  },
  created () {
    this.pullUp = true// 允许上拉记载
    this.getVideoComment()
  },
  computed: {
    ...mapState(['selectVideo'])
  },
  methods: {

    // 返回上一个路由
    routerBack () {
      this.$router.back()
    },
    // 获取该mv评论
    async getVideoComment () {
      const { data: res } = await videoApi.getVideoComment(this.selectVideo.id, this.offset)
      if (res.code === ERR_OK) {
        this.commentObj = {
          isMusician: res.isMusician,
          comments: res.comments
        }
        this.offset = this.commentObj.comments.length
      }
    },
    // 上拉加载
    handlePullingUp () {
      console.log(123)
      this.getVideoComment()
    }
  },
  watch: {
    commentObj () {
      this.$refs.commentScroll.finishPullUp()
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
    CommentList,
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.videoInfo-container {
  // min-height: 100vh;
  background: #fff;
  width: 100%;

  .comment-title {
    font-size: $font-size-smaller;
    font-weight: bold;
    text-indent: 1em;
    height: 1rem;
    line-height: 1rem;
    background: #fff;
  }

  section {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: #fff;
    padding-bottom: 1.8rem;
    box-sizing: border-box;

    .content {
      position: absolute;
      width: 100%;
      top: 0;
      padding: 0 0.5rem;
      box-sizing: border-box;
      z-index: 0;

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