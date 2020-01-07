<template>
  <div id="app">
    <router-view v-transition></router-view>
    <home-footer></home-footer>
  </div>
</template>

<script>
import HomeFooter from '@/components/home/Footer'
export default {
  components: {
    HomeFooter
  }
}
</script>

<style lang="stylus" scoped>
#app>>>.van-loading {
  height: 100vw;
}
</style>
