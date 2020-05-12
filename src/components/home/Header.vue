<template>
  <div class="header-container">
    <!-- 搜索框 -->
      <header-search></header-search>
  </div>
</template>
<script>
import HeaderSearch from '@/components/home/header/HeaderSearch'

export default {
  components: {
    HeaderSearch
  }
}
</script>
<style lang="stylus" scoped>
.header-container {
  width: 100%;
  position: sticky;
  left: 0;
  top: 0;
  z-index: 99;
  box-shadow: 0 0.1rem #fff;
}
</style>