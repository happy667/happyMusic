<template>
  <div class="home-container">
    <!-- 头部tabbar -->
    <m-header></m-header>
    <router-view></router-view>
  </div>

</template>
<script>

import mHeader from '../components/home/Header'
export default {
  components: {
    mHeader
  }
}
</script>
<style lang="stylus" scoped>
.home-container {
  padding: 0.5rem;
}
</style>
