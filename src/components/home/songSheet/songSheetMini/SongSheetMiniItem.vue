<template>
  <div class="song-sheet-mini-item-container"
       @click="goToSongSheetInfo">
    <!--  图片 -->
    <div class="img">
      <img v-lazy="item.coverImgUrl"
           class="animated fadeIn"
           :key="item.coverImgUrl" />
    </div>
    <!-- 信息 -->
    <article class="info">
      <!-- 标题 -->
      <div class="title">{{item.name}}</div>
      <div class="bottom">
        <!-- 数量 -->
        <div class="number">{{item.trackCount}}首</div>
        <!-- 来自 -->
        <div class="from">来自{{item.creator.nickname}}</div>
      </div>

    </article>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object
    }
  },
  methods: {
    goToSongSheetInfo () {
      this.$router.push(`/songSheetDisc/${this.item.id}`)
    }

  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.song-sheet-mini-item-container {
  width: 100%;
  display: flex;
  margin-bottom: 0.3rem;

  .img {
    margin-right: 0.4rem;
    width: 1.3rem;
    height: 1.3rem;
    background: $color-common-b;
    border-radius: 0.2rem;

    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 0.2rem;
    }

    .play-num {
      position: absolute;
      right: 0.1rem;
      top: 0.1rem;
      color: #fff;
    }
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;

    .title {
      line-height: 0.5rem;
      color: $color-common-x;
      font-size: $font-size-smaller-x;
      no-wrap();
    }

    .bottom {
      display: flex;
      color: #999;
      height: 0.6rem;
      line-height: 0.6rem;
      font-size: $font-size-mini;
      no-wrap();

      .number {
        margin-right: 0.3rem;
      }

      .from {
        flex: 1;
        width: 1%;
        no-wrap();
      }
    }
  }
}
</style>