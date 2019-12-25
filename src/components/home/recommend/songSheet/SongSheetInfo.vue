<template>
  <div class="song-sheet-info-container">
    <!-- 头部导航栏 -->
    <van-nav-bar title="歌单列表"
                 left-arrow
                 @click-left="routerBack" />
    <!-- 歌单图片 -->
    <div class="songs-img">
      <img src="https://qpic.y.qq.com/music_cover/0yiaX8d9LSmnROyId1RsUUwkjSfBGpSGzgRE4yibD0nlZqfUZFFwxpiaQ/300?n=1">
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.song-sheet-info-container {
  .songs-img {
    width: 100%;

    img {
      display: block;
      width: 100%;
    }
  }
}
</style>