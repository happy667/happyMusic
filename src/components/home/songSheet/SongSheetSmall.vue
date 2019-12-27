<template>
  <div class="songs-sheet-small-container">
    <ul class="songsSheet-list">
      <router-link tag="li"
                   to="/songSheetInfo"
                   class="songsSheet-list-item">
        <img class="sons-img"
             src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
        <div class="songs-desc">Sweetie,TheNewest</div>
      </router-link>
      <router-link tag="li"
                   to="/songSheetInfo"
                   class="songsSheet-list-item">
        <img class="sons-img"
             src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
        <div class="songs-desc">Sweetie,TheNewest</div>
      </router-link>
      <router-link tag="li"
                   to="/songSheetInfo"
                   class="songsSheet-list-item">
        <img class="sons-img"
             src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
        <div class="songs-desc">Sweetie,TheNewest</div>
      </router-link>
      <router-link tag="li"
                   to="/songSheetInfo"
                   class="songsSheet-list-item">
        <img class="sons-img"
             src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
        <div class="songs-desc">Sweetie,TheNewest</div>
      </router-link>
    </ul>
  </div>
</template>
<script>
export default {

}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.songs-sheet-small-container {
  width: 100%;
  background: $color-common-background;

  .songsSheet-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-bottom: 0.5rem;

    .songsSheet-list-item {
      box-sizing: border-box;
      padding: 0.2rem 0.3rem;
      margin-top: 3%;
      width: 31%;
      background: $color-common-background;
      box-shadow: 0 0.25rem 0.6rem rgba(0, 0, 0, 0.1);
      border-radius: 0.2rem;

      .sons-img {
        display: block;
        margin: 0 auto;
        width: 100%;
        border-radius: 0.2rem;
        margin-bottom: 0.2rem;
      }

      .songs-desc {
        width: 100%;
        line-height: 0.6rem;
        word-wrap: break-word;
        font-size: $font-size-smaller;
        font-family: $font-common-title;
        no-wrap2();
      }
    }
  }
}
</style>