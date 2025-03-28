<template>
  <div class="play-all-container">
    <div class="left">
      <div class="play-icon">
        <van-icon name="play-circle-o" />
      </div>
      <div class="play-all"
           @click="$emit('play')">
        <span>播放全部({{length}})</span>
      </div>
    </div>
    <div class="right"
         @click="$emit('filterClick')">
      <i class="iconfont icon-shaixuan"
         :style="{color:filterStatus ?'#fd4979':'#999'}"></i>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    length: {
      type: Number
    },
    showFilter: {
      type: Boolean,
      default: false
    },
    filterStatus : {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.play-all-container {
  display: flex;
  padding: 0 0.4rem;
  align-items: center;
  justify-content: space-between;

  .left {
    display: flex;

    .play-icon {
      font-size: $font-size-large-x;
      color: $color-common;
      margin-right: 0.1rem;

      i {
        height: 0.8rem;
        line-height: 0.8rem;
      }
    }

    .play-all {
      display: flex;
      font-size: $font-size-smaller;
      height: 0.8rem;
      line-height: 0.8rem;
    }
  }

  .right {
    i {
      font-size: $font-size-large-x;
      height: 0.8rem;
      line-height: 0.8rem;
    }
  }
}
</style>