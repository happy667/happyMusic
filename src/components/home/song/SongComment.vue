<template>
  <div class="song-comment-container">
    <header class="header">
      <van-sticky>
        <van-nav-bar title="评论列表"
                     left-arrow
                     @click-left="routerBack" />
      </van-sticky>
    </header>
    <section class="section">
      <song-item></song-item>
      <!-- 评论列表 -->
      <comment-list></comment-list>
    </section>
  </div>
</template>
<script>
import SongItem from '@/components/home/song/SongItem'
import CommentList from '@/components/home/comment/CommentList'
export default {
  methods: {
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    }
  },
  components: {
    SongItem,
    CommentList
  }
}
</script>
<style lang="stylus" scoped>
.song-comment-container {
  height: 100%;
  background: #fff;

  .section {
    padding: 0.5rem;
  }
}
</style>