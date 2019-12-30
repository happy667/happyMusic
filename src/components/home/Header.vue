<template>
  <div class="header-container">
    <!-- 搜索框 -->
    <van-sticky>
      <header-search></header-search>
    </van-sticky>
    <!-- 头部导航栏 -->
    <header-nav-bar></header-nav-bar>

  </div>
</template>
<script>
import HeaderSearch from '@/components/home/header/HeaderSearch'
import HeaderNavBar from '@/components/home/header/HeaderNavBar'
export default {
  components: {
    HeaderSearch,
    HeaderNavBar
  }
}
</script>
<style lang="stylus" scoped>
.header-container {
  height: 100%;
}
</style>