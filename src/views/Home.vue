<template>
  <div class="home-container">
    <!-- 头部tabbar -->
    <m-header></m-header>
    <!-- 功能模块 -->
    <m-section></m-section>
  </div>

</template>
<script>

import mHeader from '../components/home/Header'
import mSection from '../components/home/Section'

export default {
  data () {
    return {

    }
  },
  components: {
    mHeader,
    mSection
  }
}
</script>
<style lang="stylus" scoped>
.home-container {
  height: 100%;
}
</style>
