<template>
  <div class="song-sheet-swiper-item-container">
    <div class="song-sheet-swiper-item">
      <div class="song-img">
        <img :src="songSheet.picUrl">
        <div class="play-icon">
          <van-icon name="play-circle-o" />
        </div>
      </div>
      <div class="song-desc">{{songSheet.name}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    songSheet: Object
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.song-sheet-swiper-item-container {
  background: $color-common-background;

  .song-sheet-swiper-item {
    box-sizing: border-box;
    padding: 0.3rem 0.2rem;
    width: 2.8rem;
    background: $color-common-background;
    box-shadow: 0 0.25rem 0.6rem rgba(0, 0, 0, 0.1);
    border-radius: 0.3rem;

    .song-img {
      position: relative;
      width: 100%;
      padding: 0 0.17rem;
      height: 2rem;
      box-sizing: border-box;
      border-radius: 0.3rem;
      margin-bottom: 0.2rem;

      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 0.3rem;
      }

      .play-icon {
        position: absolute;
        right: 0.25rem;
        bottom: 0rem;
        font-size: 0.8rem;
        color: #fff;
      }
    }

    .song-desc {
      width: 100%;
      line-height: 0.5rem;
      word-wrap: break-word;
      font-size: $font-size-smaller;
      font-family: $font-common-title;
      text-align: center;
      no-wrap();
    }
  }
}
</style>