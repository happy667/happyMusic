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
import recommendSwiper from './recommend/RecommendSwiper'
import songSheetLarge from './recommend/songSheet/SongSheetLarge'
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
    .viewMore {
      display: flex;
      justify-content: center;
      align-items: center;

      a {
        margin-right: 0.1rem;
      }
    }
  }
}
</style>
