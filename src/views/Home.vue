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
  background: $color-common-background;
}
</style>