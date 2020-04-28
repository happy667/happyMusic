<template>
  <div class="album-item-container">
    <div class="item-img ">
      <img v-lazy="item.picUrl"
           class="animated fadeIn" />
    </div>
    <div class="item-name">{{item.name}}</div>
    <div class="item-pub-time">{{item.publishTime|convertDate}}</div>
  </div>
</template>
<script>
import 'common/js/convert.js'
export default {
  props: {
    item: Object
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.album-item-container {
  padding: 0.2rem 0.3rem;
  background: $color-common-background;
  box-shadow: 0 0.1rem 0.8rem rgba(0, 0, 0, 0.1);
  border-radius: 0.2rem;
  box-sizing: border-box;

  /* 选择最后一排 */
  &:nth-last-child(-n+3) {
    margin-bottom: 0;
  }

  .item-img {
    width: 2.1rem;
    height: 2rem;
    border-radius: 0.3rem;
    background: $color-common-b;

    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 0.3rem;
    }
  }

  .item-name {
    width: 2.1rem;
    height: 0.6rem;
    line-height: 0.6rem;
    color: $color-common-x;
    no-wrap();
  }

  .item-pub-time {
    color: #777;
    height: 0.55rem;
    line-height: 0.55rem;
  }
}
</style>