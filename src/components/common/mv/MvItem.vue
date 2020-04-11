<template>
  <section class="mv-list-item-container"
           @click="handleClick">
    <!-- mv 图片 -->
    <div class="mv-img">
      <img v-lazy="mv.cover"
           class="animated fadeIn"
           :key="mv.cover" />
      <!-- 播放次数 -->
      <div class="play-num">
        <i class="iconfont icon-bofang"></i>
        {{mv.playCount|convertCount}}
      </div>
    </div>
    <!-- mv信息 -->
    <div class="mv-info">
      <!-- 标题 -->
      <div class="mv-title">{{mv.name}}</div>
      <div class="bottom">
        <!-- 时间 -->
        <div class="mv-time">{{mv.duration/1000|convertTime}}</div>
        <!-- 来源 -->
        <div class="mv-source">{{mv.artistName}}</div>
      </div>

    </div>
  </section>
</template>
<script>
import 'common/js/convert.js'
export default {
  props: {
    mv: {
      type: Object
    }
  },
  methods: {
    handleClick () {
      this.$emit('click', this.mv)
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

  .mv-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: $font-size-mini;

    .mv-title {
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