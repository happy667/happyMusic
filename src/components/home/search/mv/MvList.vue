<template>
  <div class="mv-list-container">
    <div class="mv-list">
      <mv-item></mv-item>
      <mv-item></mv-item>
      <mv-item></mv-item>
      <mv-item></mv-item>
      <mv-item></mv-item>
      <mv-item></mv-item>
    </div>
  </div>
</template>
<script>
import MvItem from './MvItem'
export default {
  components: {
    MvItem
  }
}
</script>
<style lang="stylus" scoped>
.mv-list-container {
  width: 100%;

  .mv-list {
    padding: 0.3rem 0;
  }
}
</style>