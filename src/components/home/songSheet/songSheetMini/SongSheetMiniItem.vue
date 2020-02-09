<template>
  <div class="song-sheet-mini-item-container"
       @click="goToSongSheetInfo">
    <!--  图片 -->
    <div class="img">
      <img v-lazy="item.coverImgUrl" />
    </div>
    <!-- 信息 -->
    <div class="info">
      <!-- 标题 -->
      <div class="title">{{item.name}}</div>
      <div class="bottom">
        <!-- 数量 -->
        <div class="number">{{item.trackCount}}首</div>
        <!-- 来自 -->
        <div class="from">来自{{item.creator.nickname}}</div>
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
    position: relative;
    margin-right: 0.4rem;
    height: 0;
    width: 1.8rem;
    padding-bottom: 1.5rem;
    background: $color-common-b;

    img {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 0.1rem;
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

    .title {
      width: 6rem;
      margin-bottom: 0.2rem;
      line-height: 0.5rem;
      font-weight: bold;
      no-wrap2();
    }

    .bottom {
      display: flex;
      color: #999;
      line-height: 0.5rem;

      .number {
        margin-right: 0.3rem;
      }

      .from {
        width: 3rem;
        no-wrap();
      }
    }
  }
}
</style>