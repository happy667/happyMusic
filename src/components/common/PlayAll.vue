<template>
  <div class="play-all-container">
    <div class="play-icon">
      <van-icon name="play-circle-o" />
    </div>
    <div class="play-all"
         @click="$emit('play')">
      <span>播放全部({{length}})</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    length: {
      type: Number
    }
  }

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.play-all-container {
  display: flex;
  padding-left: 0.4rem;
  align-items: center;

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
</style>