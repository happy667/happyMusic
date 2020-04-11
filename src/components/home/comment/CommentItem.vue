<template>
  <div class="comment-item-container">
    <section class="comment-wrapper">
      <!-- 评论信息 -->
      <div class="comment-left">
        <!-- 用户头像 -->
        <div class="avatar">
          <mini-image :avatar="comment.user.avatarUrl"></mini-image>
        </div>
      </div>
      <div class="comment-right van-hairline--bottom">
        <div class="top">
          <!-- 用户昵称 -->
          <div class="comment-nikeName">{{comment.user.nickname}}</div>
          <!--评论时间-->
          <div class="comment-time">{{comment.time|convertDate}}</div>
        </div>
        <div class="bottom">
          <!-- 评论内容 -->
          <article class="comment-content">
            {{comment.content}}
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import 'common/js/convert.js'
import MiniImage from '../img/MiniImage'
export default {
  props: {
    comment: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    MiniImage
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.comment-item-container>>>.avatar-wrapper {
  width: 0.9rem;
  height: 0.9rem;
}

.comment-item-container {
  padding: 0.35rem 0;

  .comment-wrapper {
    display: flex;

    .comment-left {
      margin-right: 0.3rem;
    }

    .comment-right {
      display: flex;
      flex-direction: column;
      flex: 1;

      .top {
        display: flex;
        flex-direction: column;

        .comment-nikeName {
          width: 100%;
          font-size: $font-size-smaller-x;
          line-height: 0.57rem;
          color: #666;
          no-wrap();
        }

        .comment-time {
          color: #777;
        }
      }

      .bottom {
        .comment-content {
          padding: 0.3rem 0;
          line-height: 0.55rem;
          word-break: break-all;
        }
      }
    }
  }
}
</style>