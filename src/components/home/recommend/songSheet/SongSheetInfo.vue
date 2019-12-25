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
    <!-- 歌单描述 -->
    <section>
      <div class="songs-desc">
        <div class="songs-title">Catch me if you</div>
        <div class="songs-num">23 songs</div>
        <!-- 播放按钮 -->
        <div class="playBtn">
          <i class="iconfont icon-bofang"></i>
        </div>
      </div>
      <!-- 歌曲列表 -->
      <songs-list></songs-list>
    </section>

  </div>
</template>
<script>
import SongsList from '@/components/home/recommend/songs/SongsList'
export default {
  methods: {
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    }
  },
  components: {
    SongsList
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.song-sheet-info-container {
  background: $color-common-background;

  .songs-img {
    width: 100%;
    height: 0;
    padding-bottom: 100%;

    img {
      display: block;
      width: 100%;
    }
  }

  section {
    padding: 0 0.4rem;

    .songs-desc {
      padding: 0.4rem 0;
      position: relative;
      background: $color-common-background;

      .songs-title {
        width: 6rem;
        line-height: 1rem;
        font-weight: 500;
        font-size: $font-size-large;
        no-wrap();
      }

      .songs-num {
        font-size: $font-size-smaller;
        color: #777;
      }

      .playBtn {
        position: absolute;
        right: .6rem;
        top: 0;
        margin-top: -0.8rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: red;
        background: linear-gradient(to right, #702cfa, #3f12fd);
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        box-shadow: 0 0.01rem 0.3rem #702cfa;

        i {
          color: #fff;
          font-size: 0.8rem;
        }
      }
    }
  }
}
</style>