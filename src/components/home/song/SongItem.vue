<template>
  <div class="songs-list-item-containter">
    <!-- 索引 -->
    <div class="song-index"
         v-if="index">{{index}}</div>
    <!-- 歌曲图片 -->
    <div class="song-img">
      <img v-lazy="picUrl"
           :key="picUrl" />
    </div>
    <div class="song-desc">
      <!-- 歌曲名称 -->
      <div class="songName">{{song.name}}</div>
      <!-- 歌手名称-专辑名称 -->
      <div class="sgInfo">{{singers}}</div>
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
    index: Number
  },
  computed: {
    // 处理歌手
    singers () {
      let singers = this.song.song === undefined ? this.song.ar : this.song.song.artists
      singers = singers.map(item => item.name).join('/')
      return singers
    },
    // 处理图片
    picUrl () {
      let picUrl = this.song.picUrl === undefined ? this.song.al.picUrl : this.song.picUrl
      return picUrl
    }
  }
}
</script>
<style lang="stylus">
@import '~common/stylus/variable';

.songs-list-item-containter {
  position: relative;
  display: flex;
  padding: 0.3rem 0.4rem;
  background: $color-common-background;
  border-radius: 0.2rem;

  .song-index {
    height: 1.4rem;
    line-height: 1.4rem;
    margin-right: 0.5rem;
    font-size: $font-size-small;
    color: $color-common-b;
  }

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
      max-width: 4rem;
      no-wrap();
    }

    .sgInfo {
      color: #777;
      max-width: 4rem;
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