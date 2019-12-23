<template>
  <div class="home-container">
    <!-- 头部tabbar -->
    <home-header></home-header>
    <!-- 功能模块 -->
    <home-section></home-section>
  </div>

</template>
<script>

import homeHeader from '../components/home/Header'
import homeSection from '../components/home/Section'

export default {
  data () {
    return {

    }
  },
  components: {
    homeHeader,
    homeSection
  }
}
</script>
<style lang="stylus" scoped>
.home-container {
  height: 100%;
}
</style>
