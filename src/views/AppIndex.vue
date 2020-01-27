<template>
  <div class="appIndex-container">
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
  height :100vh;
  box-sizing: border-box;
  background:$color-common-background;
}
</style>