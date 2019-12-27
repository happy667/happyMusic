<template>
  <div class="recommend-container">
    <!-- 轮播图区域 -->
    <recommend-swiper></recommend-swiper>
    <!-- 推荐歌单区域 -->
    <song-sheet-Large>
      <div class="songsSheet">
        <p class="songs-title">Latest Songs</p>
        <div class="viewMore">
          <router-link to="/SongSheetSort">
            View more
          </router-link>
          <van-icon name="arrow" />
        </div>
      </div>
    </song-sheet-Large>
  </div>
</template>
<script>
import recommendSwiper from './RecommendSwiper'
import songSheetLarge from '@/components/home/songSheet/SongSheetLarge'
export default {
  components: {
    recommendSwiper,
    songSheetLarge
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.recommend-container {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;

  .songsSheet {
    display: flex;
    justify-content: space-between;
    font-size: $font-size-small-x;
    height: 1.5rem;
    line-height: 1.5rem;
    font-family: $font-common-title;

    .songs-title {
      height: 1.5rem;
      line-height: 1.5rem;
    }

    .viewMore {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: $font-size-smaller;
      color: #999;

      a {
        margin-right: 0.1rem;
      }
    }
  }
}
</style>
