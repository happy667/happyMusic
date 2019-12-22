<template>
  <div class="appIndex-container">
    <!-- 背景图片 -->
    <div class="bgImage">
      <img src="@/assets/images/bgImages/bg1.jpg" />
    </div>
    <transition mode="out-in"
                enter-active-class="animated fadeIn faster"
                leave-active-class="animated fadeOut faster">
      <router-view></router-view>
    </transition>
  </div>

</template>
<script>
export default {

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.appIndex-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 2rem;

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