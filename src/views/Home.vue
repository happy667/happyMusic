<template>
  <div class="home-container">
    <home-header></home-header>
    <!-- 头部导航栏 -->
    <home-section></home-section>
  </div>
</template>
<script>
import HomeHeader from '@/components/home/Header'
import HomeSection from '@/components/home/Section'
export default {
  components: {
    HomeHeader,
    HomeSection
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.home-container>>>.van-loading {
  /* 减去搜索框、导航栏、底部播放区域高度 */
  height: calc(100vh - (1.7rem + 1.18rem + 1.8rem));
  background: #fff;
}

.home-container {
  width: 100%;
  height: 100%;
  padding-bottom: 1.8rem;
  background: $color-common-background;
  box-sizing: border-box;
}
</style>