<template>
  <div class="home-container">
    <home-header></home-header>

  </div>
</template>
<script>
import HomeHeader from '@/components/home/Header'

export default {
  components: {
    HomeHeader
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.home-container {
  width: 100%;
  height: 100%;
  background: $color-common-background;
  padding-bottom: 1.8rem;
  box-sizing: border-box;
}
</style>