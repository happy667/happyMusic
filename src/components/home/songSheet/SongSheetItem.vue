<template>
  <div class="song-sheet-item-container">
    <div class="sons-img">
      <img v-lazy="songSheet.picUrl">
    </div>
    <div class="songs-desc">{{songSheet.name}}</div>
    <div class="songs-playCount"
         v-if="songSheet.playCount">
      <i class="iconfont icon-bofang"></i>{{songSheet.playCount|convert}}
    </div>
  </div>
</template>
<script>
import 'common/js/convert.js'
export default {
  props: {
    songSheet: Object
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.song-sheet-item-container {
  width: 100%;
  box-sizing: border-box;
  padding: 0.1rem 0.5rem 0.2rem;
  background: $color-common-background;
  box-shadow: 0 0.25rem 0.6rem rgba(0, 0, 0, 0.1);
  border-radius: 0.3rem;

  .sons-img {
    width: 100%;
    padding: 0 0.17rem;
    height: 3rem;
    box-sizing: border-box;
    border-radius: 0.3rem;
    margin-bottom: 0.2rem;

    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 0.3rem;
    }
  }

  .songs-desc {
    margin-bottom: 0.1rem;
    width: 100%;
    line-height: 0.5rem;
    word-wrap: break-word;
    font-size: $font-size-smaller;
    font-family: $font-common-title;
    no-wrap2();
  }

  .songs-playCount {
    line-height: 0.6rem;
    width: 100%;
    color: #999;
    font-size: $font-size-smaller-x;
    no-wrap();
  }
}
</style>