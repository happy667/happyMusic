<template>
  <div class="recommend-container">
    <!-- 轮播图区域 -->
    <van-swipe :autoplay="3000"
               indicator-color="white">
      <van-swipe-item>
        <div class="swiper-item">
          <img src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="swiper-item">
          <img src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="swiper-item">
          <img src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
        </div>
      </van-swipe-item>
    </van-swipe>
    <!-- 推荐歌单区域 -->
    <div class="latestSongs-wrapper">
      <div class="latestSongs">
        <p class="songs-title">Latest Songs</p>
        <span class="viewMore">View more</span>
      </div>

      <ul class="latestSongs-list">
        <li class="latestSongs-list-item">
          <img class="sons-img"
               src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
          <div class="songs-desc">Sweetie,TheNewest</div>
          <div class="songs-author">Tyler Ford</div>
        </li>
        <li class="latestSongs-list-item">
          <img class="sons-img"
               src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
          <div class="songs-desc">Sweetie,TheNewest</div>
          <div class="songs-author">Tyler Ford</div>
        </li>
        <li class="latestSongs-list-item">
          <img class="sons-img"
               src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
          <div class="songs-desc">Sweetie,TheNewest</div>
          <div class="songs-author">Tyler Ford</div>
        </li>
        <li class="latestSongs-list-item">
          <img class="sons-img"
               src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
          <div class="songs-desc">Sweetie,TheNewest</div>
          <div class="songs-author">Tyler Ford</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.recommend-container {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;

  .swiper-item {
    padding: 0.3rem;
    width: 100%;
    height: 7rem;
    box-sizing: border-box;
    background: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 0.3rem;
    }
  }

  .latestSongs-wrapper {
    margin-top: 0.5rem;

    .latestSongs {
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
        font-size: $font-size-smaller;
        color: #999;
      }
    }

    .latestSongs-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .latestSongs-list-item {
        box-sizing: border-box;
        padding: 0.3rem 0.7rem 0.4rem 0.7rem;
        margin-bottom: 4.5%;
        width: 47.5%;
        height: 10rem;
        background: #fff;
        box-shadow: 0 0 46px rgba(0, 0, 0, 0.1);
        border-radius: 0.3rem;

        .sons-img {
          width: 100%;
          height: 5.7rem;
          border-radius: 0.3rem;
          margin-bottom: 0.5rem;
        }

        .songs-desc {
          width: 5rem;
          line-height: 0.85rem;
          word-wrap: break-word;
          font-size: $font-size-small-x;
          font-family: $font-common-title;
        }

        .songs-author {
          width: 100%;
          height: 1.2rem;
          line-height: 1.2rem;
          color: #999;
          font-size: $font-size-smaller;
        }
      }
    }
  }
}
</style>