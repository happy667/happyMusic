<template>
  <div class="videoInfo-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar title="MV"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>
    <video-info></video-info>
    <section>
      <!-- 相关音乐 -->
      <div class="related-music">
        <p>相关音乐</p>
        <song-item></song-item>
      </div>
      <!-- 评论列表 -->
      <comment-list></comment-list>
    </section>

  </div>
</template>
<script>
import VideoInfo from './Video'
import SongItem from '@/components/home/songs/SongItem'
import CommentList from '@/components/home/comment/CommentList'
export default {
  data () {
    return {
      currentIndex: 0// 当前索引
    }
  },
  methods: {
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    }
  },
  components: {
    VideoInfo,
    SongItem,
    CommentList
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.videoInfo-container {
  background: #fff;

  section {
    padding: 0 0.5rem;

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
</style>