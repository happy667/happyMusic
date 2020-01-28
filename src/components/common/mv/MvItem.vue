<template>
  <div class="mv-list-item-container"
       @click="goToVideoInfo">
    <!-- mv 图片 -->
    <div class="mv-img">
      <img v-lazy="mv.cover" />
      <!-- 播放次数 -->
      <div class="play-num">
        <i class="iconfont icon-bofang"></i>
        {{mv.playCount|convertPlayCount}}
      </div>
    </div>
    <!-- mv信息 -->
    <div class="mv-info">
      <!-- 标题 -->
      <div class="mv-title">{{mv.name}}</div>
      <div class="bottom">
        <!-- 时间 -->
        <div class="mv-time">{{mv.duration/1000|convertPlayTime}}</div>
        <!-- 来源 -->
        <div class="mv-source">{{mv.artistName}}</div>
      </div>

    </div>
  </div>
</template>
<script>
import 'common/js/convert.js'
export default {
  props: {
    mv: {
      type: Object
    }
  },
  inject: ['reload'],
  methods: {
    goToVideoInfo () {
      this.reload()
      this.$router.push(`/videoInfo/${this.mv.id}`)
    }

  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.mv-list-item-container {
  width: 100%;
  display: flex;
  margin-bottom: 0.3rem;

  .mv-img {
    position: relative;
    margin-right: 0.4rem;
    height: 0;
    width: 3.2rem;
    padding-bottom: 1.5rem;
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

  .mv-info {
    flex: 1;

    .mv-title {
      width: 6rem;
      margin-bottom: 0.2rem;
      line-height: 0.5rem;
      font-weight: bold;
      no-wrap2();
    }

    .bottom {
      display: flex;
      color: #999;
      line-height: 0.5rem;

      .mv-time {
        margin-right: 0.3rem;
      }

      .mv-source {
        width: 3rem;
        no-wrap();
      }
    }
  }
}
</style>