<template>
  <div class="header-container">
    <div class="tabbar-wrapper">
      <ul class="tabbar-list">
        <!-- 推荐 -->
        <li class="tabbar-item">
          <span>推荐</span>
        </li>
        <!-- 歌手 -->
        <li class="tabbar-item">
          <span>歌手</span>
        </li>
        <!-- 排行 -->
        <li class="tabbar-item">
          <span>排行</span>
        </li>
        <!-- 搜索 -->
        <li class="tabbar-item">
          <span>搜索</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
 <style lang="stylus" scoped>
 @import '~common/stylus/variable';

 .header-container {
   .tabbar-wrapper {
     .tabbar-list {
       width: 100%;
       display: flex;
       background: #fff;
       height: 5rem;
       text-align: center;
       font-size: $font-size-large;
       color: $color-common-x;
       font-family: $font-title;
     }
   }
 }
</style>