<template>
  <div class="swiper-container">
    <van-swipe :autoplay="3000"
               indicator-color="white">
      <van-swipe-item>
        <img src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
      </van-swipe-item>
      <van-swipe-item>
        <img src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
      </van-swipe-item>
      <van-swipe-item>
        <img src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="stylus" scoped>
.van-swipe {
  .van-swipe-item {
    padding: 0.1rem;
    width: 100%;
    height: 5rem !important;
    box-sizing: border-box;
    background: #fff;
    border-radius: 0.3rem;

    img {
      width: 100%;
      height: 100%;
      border-radius: 0.3rem;
    }
  }
}
</style>