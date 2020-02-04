<template>
  <div class="songs-list-item-containter">
    <!-- 索引 -->
    <div class="song-index"
         :class="top?'rank':''"
         v-if="index">{{index}}</div>
    <!-- 歌曲图片 -->
    <div class="song-img"
         v-if="showImage">
      <img v-lazy="song.picUrl"
           :key="song.picUrl" />
    </div>
    <div class="song-desc">
      <!-- 歌曲名称 -->
      <div class="song-name">{{song.name}}</div>
      <!-- 歌手名称-专辑名称 -->
      <div class="sg-info">{{song.singers}}</div>
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
  props: {
    song: Object,
    index: Number,
    showImage: {
      type: Boolean,
      default: () => false
    },
    top: {
      type: Boolean,
      default: () => false
    }
  }
}
</script>
<style lang="stylus">
@import '~common/stylus/variable';

.songs-list-item-containter {
  position: relative;
  display: flex;
  padding: 0.2rem 0;

  .song-index {
    width: 1.3rem;
    height: 1.4rem;
    line-height: 1.4rem;
    font-size: $font-size-small;
    color: $color-common-b;
    text-align: center;

    &.rank {
      color: $color-common;
    }
  }

  .song-img {
    width: 1.2rem;
    height: 1.2rem;
    margin: 0.1rem;
    margin-right: 0.4rem;

    img {
      text-align: center;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .song-desc {
    font-size: $font-size-smaller;
    max-width: 4.5rem;
    line-height: 0.7rem;

    .song-name {
      font-weight: 500;
      no-wrap();
    }

    .sg-info {
      color: #777;
      no-wrap();
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