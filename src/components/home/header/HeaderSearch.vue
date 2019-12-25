<template>
  <div class="header-search-container">
    <!-- logo -->
    <div class="logo">
      <img src="@/assets/images/Logo.png">
    </div>
    <!-- 搜索框 -->
    <div class="search">
      <van-search placeholder="请输入搜索关键词" />
    </div>
  </div>
</template>
<script>

export default {

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.header-search-container {
  width: 100%;
  display: flex;
  padding: 0.2rem 0.2rem 0 0.8rem;
  background: $color-common-background;

  .logo {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 0.6rem;
    box-sizing: border-box;
    text-align: center;
    margin-right: 0.1rem;

    img {
      width: 100%;
    }
  }

  .search {
    flex: 1;
  }
}
</style>