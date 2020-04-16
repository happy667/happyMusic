<template>
  <div class="appIndex-container">
    <router-view></router-view>
  </div>

</template>
<script>
export default {
  name: 'appIndex',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // 如果有歌曲播放就隐藏迷你播放器
      if (vm.$store.state.currentPlayIndex !== -1) {
        vm.$store.commit('setHideMiniPlayer', true)
      }
      next()
    })
  },
  beforeRouteLeave (to, from, next) {
    // 如果有歌曲播放就显示迷你播放器
    if (this.$store.state.currentPlayIndex !== -1) {
      this.$store.commit('setHideMiniPlayer', false)
    }
    next()
  }

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