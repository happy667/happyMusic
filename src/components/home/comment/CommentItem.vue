<template>
  <div class="comment-item-container">

    <!-- 评论信息 -->
    <div class="comment-header">
      <!-- 用户头像 -->
      <div class="avatar">
        <music-img></music-img>
      </div>
      <div class="comment-info">
        <!-- 用户昵称 -->
        <div class="comment-nikeName">123</div>
        <!--评论时间-->
        <div class="comment-time">2019年12月15日</div>
      </div>
    </div>
    <!-- 评论内容 -->
    <div class="comment-content">
      评论内容评论内容评论内容评论内容评论内容评论内容评论内容
    </div>
  </div>
</template>
<script>
import MusicImg from '../img/MusicImg'
export default {
  components: {
    MusicImg
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.comment-item-container {
  padding: 0.35rem 0;
  border-bottom: 0.03rem solid #efefef;
  background: #fff;

  .comment-header {
    display: flex;

    .avatar {
      margin-right: 0.3rem;
    }

    .comment-info {
      display: flex;
      flex-direction: column;

      .comment-nikeName {
        width: 100%;
        font-size: $font-size-smaller;
        line-height: 0.7rem;
        color: #999;
        no-wrap();
      }

      .comment-time {
        color: #999;
      }
    }
  }

  .comment-content {
    padding-top: 0.3rem;
    line-height: 0.5rem;
  }
}
</style>