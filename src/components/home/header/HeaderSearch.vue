<template>
  <div class="header-search-container">
    <!-- logo -->
    <div class="logo">
      <img src="@/assets/images/Logo.png">
    </div>
    <!-- 搜索框 -->
    <div class="search"
         @click="handleSearchClick">
      <van-search disabled
                  left-icon=""
                  right-icon="search"
                  shape="round"
                  placeholder="请输入搜索关键词" />
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations(['setSearchKeywords']),
    // 点击搜索跳转搜索页面
    handleSearchClick () {
      // 清空搜索内容
      this.setSearchKeywords('')
      this.$router.push('/search/searchPage')
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.header-search-container {
  width: 100%;
  height: 1.7rem;
  display: flex;
  padding: 0.2rem 0.2rem 0 0.8rem;
  box-sizing: border-box;
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