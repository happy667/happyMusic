<template>
  <section class="video-list-item-container" @click="handleClick">
    <!-- video 图片 -->
    <div class="video-img">
      <img v-lazy="video.coverUrl" class="animated fadeIn" :key="video.coverUrl" />
      <!-- 播放次数 -->
      <div class="play-num" v-if="video.playCount">
        <i class="iconfont icon-bofang"></i>
        {{video.playCount|convertCount}}
      </div>
    </div>
    <!-- video信息 -->
    <article class="video-info">
      <!-- 标题 -->
      <h4 class="video-title">{{video.name}}</h4>
      <div class="bottom">
        <!-- 时间 -->
        <div class="video-time">{{video.duration/1000|convertTime}}</div>
        <!-- 来源 -->
        <div class="video-source">{{video.creatorName}}</div>
      </div>

    </article>
  </section>
</template>
<script>
  import 'common/js/convert.js'
  export default {
    props: {
      video: {
        type: Object
      }
    },
    methods: {
      handleClick () {
        this.$emit('click', this.video)
      }
    }
  }
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable';

  .video-list-item-container {
    width: 100%;
    display: flex;
    margin-bottom: 0.3rem;

    .video-img {
      position: relative;
      height: 1.7rem;
      width: 2.9rem;
      background: $color-common-b;
      flex: none;

      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 0.1rem;
      }

      .play-num {
        position: absolute;
        right: 0.1rem;
        top: 0.1rem;
        color: #fff;
      }
    }

    .video-info {
      margin-left: 0.4rem;
      flex: 1;
      width: 1%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .video-title {
        color: $color-common-x;
        line-height: 0.5rem;
        no-wrap2();
        font-size: $font-size-smaller-x;
      }

      .bottom {
        display: flex;
        color: #999;
        height: 0.6rem;
        line-height: 0.6rem;
        no-wrap();
        font-size: $font-size-mini;

        .video-time {
          margin-right: 0.3rem;
        }

        .video-source {
          no-wrap();
        }
      }
    }
  }
</style>