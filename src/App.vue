<template>
  <div id="app">
    <transition mode="out-in"
                enter-active-class="animated fadeIn faster"
                leave-active-class="animated fadeOut faster">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
</script>
<style lang="stylus" scoped>
#app {
  height: 100%;
}
</style>
