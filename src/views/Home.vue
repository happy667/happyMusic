<template>
  <div class="home-container">
    <!-- 头部tabbar -->
    <home-header></home-header>
    <div class="wrapper"
         ref="wrapper">
      <div class="container">
        <!-- 功能模块 -->
        <home-section></home-section>
      </div>
    </div>

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
  mounted () {
    // 创建Bscroll实例实现特效

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
