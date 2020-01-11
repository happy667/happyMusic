<template>
  <div class="comment-list-container">
    <template v-for="item in commentList">
      <comment-item :key="item.commentId"
                    :comment="item"></comment-item>
    </template>

  </div>
</template>
<script>
import CommentItem from './CommentItem'
export default {
  props: {
    commentList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    CommentItem
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.comment-list-container>>>.comment-item-container {
  &:last-child {
    border-bottom: none;
  }
}

.comment-list-container {
  width: 100%;
  background: #fff;
}
</style>