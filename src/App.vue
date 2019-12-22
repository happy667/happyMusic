<template>
  <div id="app">
    <!-- 背景图片 -->
    <div class="bgImage">
      <img src="./assets/images/bgImages/bg1.jpg" />
    </div>
    <transition mode="out-in"
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 2rem 2rem 1rem 2rem;

  .bgImage {
    img {
      position: fixed;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      z-index: -100;
    }
  }
}
</style>
