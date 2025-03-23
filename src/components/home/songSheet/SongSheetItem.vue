<template>
  <div class="song-sheet-item-container">
    <div class="sons-img animated fadeIn">
      <div class="songs-playCount"
           v-if="playCount">
        <i class="iconfont icon-bofang"></i> {{playCount|convertCount}}
      </div>
      <img v-lazy="picUrl"
           :key="picUrl">
    </div>
    <div class="songs-desc">{{songSheet.name}}</div>

  </div>
</template>
<script>
import 'common/js/convert.js'
export default {
  props: {
    songSheet: Object
  },
  computed: {
    picUrl () {
      return this.songSheet.picUrl ? this.songSheet.picUrl : this.songSheet.coverImgUrl
    },
    playCount () {
      return this.songSheet.playCount ? this.songSheet.playCount : this.songSheet.playcount
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.song-sheet-item-container {
  display: flex;
  align-content: space-between;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;
  padding: 0.15rem 0.48rem 0.3rem;
  box-shadow: 0 0.06rem 0.16rem rgba(0, 0, 0, 0.07);
  border-radius: 0.3rem;
  height: 5.1rem;

  .sons-img {
    position: relative;
    width: 100%;
    border-radius: 0.3rem;
    width: 3.1rem;
    height: 3.1rem;
    background: $color-common-b;

    .songs-playCount {
      position: absolute;
      padding: 0.07rem 0.25rem;
      top: 0;
      right: 0;
      height: 0.5rem;
      line-height: 0.5rem;
      border-radius: 0 0.3rem 0 0.3rem;
      color: #fff;
      font-size: $font-size-smaller-x;
      no-wrap();
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.45);

      i {
        font-size: $font-size-smaller-x;
      }
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 0.3rem;
    }
  }

  .songs-desc {
    margin-bottom: 0.2rem;
    width: 100%;
    line-height: 0.55rem;
    word-wrap: break-word;
    font-size: $font-size-smaller-x;
    no-wrap2();
  }
}
</style>