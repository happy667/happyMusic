<template>
  <div class="recommend-container">
    <recommend-swiper></recommend-swiper>
  </div>
</template>
<script>
import recommendSwiper from './recommend/Swiper'
export default {
  components: {
    recommendSwiper
  }
}
</script>

<style lang="stylus" scoped>
.recommend-container {
  width: 100%;
  height: 100%;
  background: blue;
}
</style>