<template>
  <div class="mv-item-container">
    <div class="video-image">
      <div class="image">
        <img v-lazy="item.imgurl"
             class="animated fadeIn">
      </div>
      <div class="publishTime-playCount">
        <div class="publishTime">
          {{item.publishTime}}
        </div>
        <div class="playCount">
          <i class="iconfont icon-bofang"></i>
          {{item.playCount|convertCount}}
        </div>
      </div>
    </div>
    <div class="title">
      <div class="icon">
        <van-tag plain
                 color="#FD4979">mv</van-tag>
      </div>
      <div class="text">
        {{item.name}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.mv-item-container {
  width: 100%;
  box-sizing: border-box;
  border-radius: 0.3rem;
  height: 4.3rem;

  .video-image {
    position: relative;
    z-index: 1;

    .image {
      width: 100%;
      height: 2.7rem;
      border-radius: 0.3rem;
      background-color: $color-common-b;

      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 0.3rem;
      }
    }

    .publishTime-playCount {
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      padding: 0 0.2rem;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      height: 0.6rem;
      line-height: 0.6rem;
      color: #fff;
      font-size: $font-size-mini-x;

      i {
        font-size: $font-size-mini-x;
      }
    }
  }

  .title {
    position: relative;
    margin: 0.3rem 0;
    display: flex;

    .text {
      text-indent: 0.7rem;
      line-height: 0.5rem;
      no-wrap2();
    }

    .icon {
      position: absolute;
      left: 0;
      top: 0.05rem;
    }
  }
}
</style>