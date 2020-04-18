<template>
  <div class="album-container">
    <div class="album-image">
      <div class="image-container">
        <div class="image">
          <img v-lazy="item.picUrl"
               class="animated fadeIn">
        </div>
        <div class="digital-album">
          <img src="@/assets/images/digital-album.svg">
        </div>
      </div>
    </div>
    <div class="info">
      <div class="name">{{item.name}}</div>
      <div class="desc">
        <span class="singer">{{item.singerName}}</span>
        <span class="time">{{item.publishTime|convertDate}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.album-container {
  padding: 0.25rem 0;
  display: flex;

  .album-image {
    margin-right: 0.5rem;

    .image-container {
      position: relative;

      .image {
        width: 1.3rem;
        height: 1.3rem;
        background: $color-common-b;
        border-radius: 0.1rem;

        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 0.1rem;
        }
      }

      .digital-album {
        position: absolute;
        top: 0.1rem;
        left: 0;
        width: 2.76rem;
        height: 1.1rem;

        img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 0.3rem;

    .name {
      line-height: 0.5rem;
      font-weight: bold;
      no-wrap2();
    }

    .desc {
      max-width: 6rem;
      display: flex;
      color: #999;
      height: 0.6rem;
      line-height: 0.6rem;
      no-wrap();

      .singer {
        margin-right: 0.3rem;
      }

      .time {
        width: 3rem;
      }
    }
  }
}
</style>