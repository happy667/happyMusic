<template>
  <div class="header-search-container">
    <!-- logo -->
    <div class="logo"
         :class="user?'active':''"
         @click="goToMyHome">
      <img v-lazy="image">
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
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState(['user']),
    image () {
      return this.user ? this.user.avatarUrl : require('@/assets/images/logo.png')
    }
  },
  methods: {
    ...mapMutations(['setSearchKeywords', 'setIsAdvance']),
    // 点击搜索跳转搜索页面
    handleSearchClick () {
      // 清空搜索内容
      this.setSearchKeywords('')
      this.$router.push('/search/searchPage')
    },
    goToMyHome () {
      // 不设置为前进页面
      this.setIsAdvance(false)
      this.$router.push('/user')
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
  padding: 0.2rem 0.4rem 0 0.4rem;
  box-sizing: border-box;
  background: $color-common-background;

  .logo {
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    box-sizing: border-box;
    text-align: center;

    img {
      display: block;
      width: 0.7rem;
    }

    &.active {
      margin-top: 6px;
      padding-top: 0;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background: $color-common-b;

      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }

  .search {
    flex: 1;
  }
}
</style>