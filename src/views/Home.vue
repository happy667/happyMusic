<template>
  <div class="home-container">
    <home-header></home-header>
    <home-footer></home-footer>
  </div>
</template>
<script>
import HomeHeader from '@/components/home/Header'
import HomeFooter from '@/components/home/Footer'

export default {
  components: {
    HomeHeader,
    HomeFooter
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.home-container {
  width: 100%;
  height: 100%;
  background: $color-common-background;
}
</style>