<template>
  <div class="songsSheet-contianer">
    <slot></slot>
    <ul class="songsSheet-list">
      <li class="songsSheet-list-item">
        <img class="sons-img"
             src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
        <p class="songs-desc">Sweetie,TheNewest</p>
        <p class="songs-author">Tyler Ford</p>
      </li>
      <li class="songsSheet-list-item">
        <img class="sons-img"
             src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
        <p class="songs-desc">Sweetie,TheNewest</p>
        <p class="songs-author">Tyler Ford</p>
      </li>
      <li class="songsSheet-list-item">
        <img class="sons-img"
             src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
        <p class="songs-desc">Sweetie,TheNewest</p>
        <p class="songs-author">Tyler Ford</p>
      </li>
      <li class="songsSheet-list-item">
        <img class="sons-img"
             src="http://p2.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.webp?imageView&thumbnail=247x0&quality=75&tostatic=0&type=webp">
        <p class="songs-desc">Sweetie,TheNewest</p>
        <p class="songs-author">Tyler Ford</p>
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

.songsSheet-contianer {
  width: 100%;
  margin-top: 0.5rem;

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
      font-size: $font-size-smaller;
      color: #999;
    }
  }

  .songsSheet-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .songsSheet-list-item {
      box-sizing: border-box;
      padding: 0.3rem 0.7rem;
      margin-bottom: 4.5%;
      width: 47.5%;
      height: 10rem;
      background: #fff;
      box-shadow: 0 0 46px rgba(0, 0, 0, 0.1);
      border-radius: 0.3rem;

      .sons-img {
        display: block;
        width: 100%;
        height: 5.7rem;
        border-radius: 0.3rem;
        margin-bottom: 0.5rem;
      }

      .songs-desc {
        width: 5rem;
        height: 1.8rem;
        line-height: 0.85rem;
        word-wrap: break-word;
        font-size: $font-size-small-x;
        font-family: $font-common-title;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .songs-author {
        width: 100%;
        height: 1.2rem;
        line-height: 1.2rem;
        color: #999;
        font-size: $font-size-smaller;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
</style>