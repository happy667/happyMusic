<template>
  <div class="songs-list-item-containter">
    <!-- 歌曲图片 -->
    <div class="song-img">
      <img src="http://p1.music.126.net/DK1_4sP_339o5rowMdPXdw==/109951164071024476.jpg?imageView&thumbnail=360y360&quality=75&tostatic=0" />
    </div>
    <div class="song-desc">
      <!-- 歌曲名称 -->
      <div class="songName">Honey,Hold Me</div>
      <!-- 歌手名称-专辑名称 -->
      <div class="sgInfo">隔壁老樊</div>
    </div>
    <!-- 选中前 -->
    <div class="love ">
      <i class="iconfont icon-icon-test"></i>
    </div>
    <!--  选中后-->
    <!-- <div class="love active">
          <i class="iconfont icon-aixin"></i>
        </div> -->
  </div>
</template>
<script>
export default {

}
</script>
<style lang="stylus">
@import '~common/stylus/variable';

.songs-list-item-containter {
  position: relative;
  display: flex;
  margin-bottom: 0.4rem;
  padding: 0.3rem 0.4rem;
  background: $color-common-background;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
  border-radius: 0.2rem;

  .song-img {
    width: 1.4rem;
    height: 1.4rem;
    margin-right: 0.6rem;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .song-desc {
    font-size: $font-size-smaller;

    .songName {
      line-height: 0.8rem;
      margin-bottom: 0.1rem;
      font-weight: 500;
    }

    .sgInfo {
      color: #777;
    }
  }

  .love {
    position: absolute;
    top: 50%;
    right: 0.6rem;
    width: 1rem;
    height: 1rem;
    margin-top: -0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      color: $color-common;
      font-size: 0.55rem;
    }
  }
}
</style>