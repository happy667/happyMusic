<template>
  <div class="album-item-container">
    <div class="item-img">
      <img v-lazy="item.picUrl" />
    </div>
    <div class="item-name">{{item.name}}</div>
    <div class="item-pub-time" v-if="item.publishTime">{{item.publishTime|convertDate}}</div>
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
  background: #fff;
  box-shadow: 0 0.1rem 0.8rem rgba(0, 0, 0, 0.1);
  border-radius: 0.2rem;
  box-sizing: border-box;

  /* 选择最后一排 */
  &:nth-last-child(-n+3) {
    margin-bottom: 0;
  }

  .item-img {
    width: 2.2rem;
    height: 2rem;
    border-radius: 0.3rem;

    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 0.3rem;
    }
  }

  .item-name {
    width: 2rem;
    no-wrap();
    height: 0.5rem;
    line-height: 0.5rem;
  }

  .item-pub-time {
    color: #777;
    height: 0.5rem;
    line-height: 0.5rem;
  }
}
</style>