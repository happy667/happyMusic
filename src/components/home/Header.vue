<template>
  <div class="header-container">
    <!-- 搜索框 -->
    <van-sticky>
      <header-search></header-search>
    </van-sticky>
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