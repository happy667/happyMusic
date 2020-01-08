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
  /* 减去搜索框、导航栏、底部播放区域高度 */
  height: calc(100vh - (1.7rem + 1.18rem + 1.8rem));
  background: #fff;
}
</style>
