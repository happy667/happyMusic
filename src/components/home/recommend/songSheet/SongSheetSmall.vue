<template>
  <div class="songsSheet-contianer">
    <slot></slot>
    <ul class="songsSheet-list">
      <li class="songsSheet-list-item">
        <img class="sons-img"
             src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">

        <div class="songs-desc">Sweetie,TheNewest</div>

      </li>
      <li class="songsSheet-list-item">
        <img class="sons-img"
             src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">

        <div class="songs-desc">Sweetie,TheNewest</div>

      </li>
      <li class="songsSheet-list-item">
        <img class="sons-img"
             src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
        <div class="songs-desc">Sweetie,TheNewest</div>
      </li>
      <li class="songsSheet-list-item">
        <img class="sons-img"
             src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">

        <div class="songs-desc">Sweetie,TheNewest</div>

      </li>
    </ul>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.songSheet-container {
  width: 100%;
  height: 100%;

  .songsSheet-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .songsSheet-list-item {
      box-sizing: border-box;
      padding: 0.2rem 0.3rem;
      margin-top: 2%;
      width: 32%;
      height: 5.5rem;
      background: #fff;
      box-shadow: 0 0 46px rgba(0, 0, 0, 0.1);
      border-radius: 0.3rem;

      .sons-img {
        display: block;
        margin: 0 auto;
        width: 3.5rem;
        height: 3.2rem;
        border-radius: 0.3rem;
        margin-bottom: 0.2rem;
      }

      .songs-desc {
        width: 4rem;
        height: 1.5rem;
        line-height: 0.7rem;
        word-wrap: break-word;
        font-size: $font-size-small-x;
        font-family: $font-common-title;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>