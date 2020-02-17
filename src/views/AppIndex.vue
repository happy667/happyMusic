<template>
  <div class="appIndex-container">
      <router-view></router-view>
  </div>

</template>
<script>
export default {
  name: 'appIndex'
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.appIndex-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  background: $color-common-background;
}
</style>