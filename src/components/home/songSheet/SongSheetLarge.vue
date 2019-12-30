<template>
  <div class="songs-sheet-large-container">
    <div class="songs-Sheet"
         v-for="item in songSheet"
         :key="item.tag">
      <div class="songs-Sheet-title">
        <p class="songs-title">{{item.tag}}</p>
        <div class="viewMore">
          <router-link to="/SongSheetSort">
            View more
          </router-link>
          <van-icon name="arrow" />
        </div>
      </div>
      <ul class="songsSheet-list">
        <router-link tag="li"
                     :to="'/songSheetInfo/'+songs.id"
                     class="songsSheet-list-item"
                     v-for="songs in item.playlists"
                     :key="songs.id">
          <div class="sons-img">
            <img v-lazy="songs.coverImgUrl">
          </div>
          <div class="songs-desc">{{songs.name}}</div>
          <div class="songs-author">{{songs.creator.nickname}}</div>
        </router-link>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    songSheet: Array
  }
}
</script>
<style lang="stylus">
@import '~common/stylus/variable';

.songs-sheet-large-container {
  width: 100%;
  background: $color-common-background;

  .songs-Sheet {
    .songs-Sheet-title {
      padding: 0 0.4rem;
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

    .songsSheet-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 0 0.4rem 0.4rem;

      .songsSheet-list-item {
        box-sizing: border-box;
        padding: 0.3rem 0.5rem 0.4rem;
        margin-bottom: 0.6rem;
        width: 45.5%;
        background: $color-common-background;
        box-shadow: 0 0.25rem 0.6rem rgba(0, 0, 0, 0.1);
        border-radius: 0.3rem;

        .sons-img {
          width: 100%;
          padding:0 0.17rem
          height: 3.2rem;
          box-sizing: border-box;
          border-radius: 0.3rem;
          margin-bottom: 0.2rem;

          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 0.3rem;
          }
        }

        .songs-desc {
          margin-bottom: 0.2rem;
          width: 100%;
          line-height: 0.5rem;
          word-wrap: break-word;
          font-size: $font-size-smaller;
          font-family: $font-common-title;
          no-wrap2();
        }

        .songs-author {
          line-height: 0.6rem;
          width: 100%;
          color: #999;
          font-size: $font-size-smaller-x;
          no-wrap();
        }
      }
    }
  }
}
</style>