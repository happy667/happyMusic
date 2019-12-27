<template>
  <div class="songs-sheet-large-container">
    <slot></slot>
    <ul class="songsSheet-list">
      <router-link tag="li"
                   to="/songSheetInfo"
                   class="songsSheet-list-item">
        <img class="sons-img"
             src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
        <div class="songs-desc">Sweetie,TheNewestsadadadsadasdsad</div>
        <div class="songs-author">Tyler Ford</div>
      </router-link>
      <router-link tag="li"
                   to="/songSheetInfo"
                   class="songsSheet-list-item">
        <img class="sons-img"
             src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
        <div class="songs-desc">Sweetie,TheNewest</div>
        <div class="songs-author">Tyler Ford</div>
      </router-link>
      <router-link tag="li"
                   to="/songSheetInfo"
                   class="songsSheet-list-item">
        <img class="sons-img"
             src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
        <div class="songs-desc">Sweetie,TheNewest</div>
        <div class="songs-author">Tyler Ford</div>
      </router-link>
      <router-link tag="li"
                   to="/songSheetInfo"
                   class="songsSheet-list-item">
        <img class="sons-img"
             src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
        <div class="songs-desc">Sweetie,TheNewest</div>
        <div class="songs-author">Tyler Ford</div>
      </router-link>
    </ul>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="stylus">
@import '~common/stylus/variable';

.songs-sheet-large-container {
  width: 100%;
  background: $color-common-background;

  .songsSheet-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .songsSheet-list-item {
      box-sizing: border-box;
      padding: 0.3rem 0.5rem;
      margin-bottom: 0.5rem;
      width: 47.5%;
      background: $color-common-background;
      box-shadow: 0 0.25rem 0.6rem rgba(0, 0, 0, 0.1);
      border-radius: 0.2rem;

      .sons-img {
        display: block;
        width: 100%;
        border-radius: 0.2rem;
        margin-bottom: 0.3rem;
      }

      .songs-desc {
        width: 100%;
        line-height: 0.6rem;
        word-wrap: break-word;
        font-size: $font-size-small-x;
        font-family: $font-common-title;
        no-wrap2();
      }

      .songs-author {
        line-height: 0.6rem;
        width: 100%;
        color: #999;
        font-size: $font-size-smaller;
        no-wrap();
      }
    }
  }
}
</style>