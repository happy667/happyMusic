<template>
  <div class="swiper-container">
    <van-swipe indicator-color="white">
      <van-swipe-item v-for="(item,index) in banners"
                      :key="index">
        <img :src="item.imageUrl">
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
export default {
  props: {
    // 轮播图数据
    banners: {
      type: Array
    }
  },
  data () {
    return {

    }
  }
}
</script>
<style lang="stylus" scoped>
.swiper-container {
  width: 100%;
  padding: 0.2rem 0.4rem;
  box-sizing: border-box;
  border-radius: 0.3rem;

  .van-swipe {
    width: 100%;
    border-radius: 0.3rem;

    .van-swipe-item {
      padding: 0.1rem;
      width: 100%;
      height: 4.2rem !important;
      box-sizing: border-box;
      border-radius: 0.3rem;

      img {
        width: 100%;
        height: 100%;
        border-radius: 0.3rem;
      }
    }
  }
}
</style>