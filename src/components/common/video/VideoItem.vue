<template>
  <section class="video-list-item-container"
           @click="handleClick">
    <!-- video 图片 -->
    <div class="video-img">
      <img v-lazy="video.cover"
           class="animated fadeIn"
           :key="video.cover" />
      <!-- 播放次数 -->
      <div class="play-num">
        <i class="iconfont icon-bofang"></i>
        {{video.playCount|convertCount}}
      </div>
    </div>
    <!-- video信息 -->
    <div class="video-info">
      <!-- 标题 -->
      <div class="video-title">{{video.name}}</div>
      <div class="bottom">
        <!-- 时间 -->
        <div class="video-time">{{video.duration/1000|convertTime}}</div>
        <!-- 来源 -->
        <div class="video-source">{{video.artistName}}</div>
      </div>

    </div>
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
    margin-right: 0.4rem;
    height: 0;
    width: 2.9rem;
    padding-bottom: 1.7rem;
    background: $color-common-b;

    img {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      left: 0;
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
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: $font-size-mini;

    .video-title {
      line-height: 0.5rem;
      font-weight: bold;
      no-wrap2();
    }

    .bottom {
      max-width: 6rem;
      display: flex;
      color: #999;
      height: 0.6rem;
      line-height: 0.6rem;
      no-wrap();

      .video-time {
        margin-right: 0.3rem;
      }

      .video-source {
        width: 3rem;
        no-wrap();
      }
    }
  }
}
</style>