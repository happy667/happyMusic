<template>
  <div class="comment-list-container">
    <div class="comment-list-title">精彩评论</div>
    <comment-item></comment-item>
    <comment-item></comment-item>
    <comment-item></comment-item>
    <comment-item></comment-item>
    <comment-item></comment-item>
    <comment-item></comment-item>
    <comment-item></comment-item>
    <comment-item></comment-item>
    <comment-item></comment-item>
    <comment-item></comment-item>
    <comment-item></comment-item>
    <comment-item></comment-item>
    <comment-item></comment-item>
  </div>
</template>
<script>
import CommentItem from './CommentItem'
export default {
  components: {
    CommentItem
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.comment-list-container {
  width: 100%;
  background: #fff;

  .comment-list-title {
    font-size: $font-size-smaller;
    font-weight: bold;
  }
}
</style>