<template>
  <div class="singer-container">
    <div class="singer-list">
      <singer-item></singer-item>
      <singer-item></singer-item>
      <singer-item></singer-item>
      <singer-item></singer-item>
    </div>
  </div>

</template>
<script>
import SingerItem from './SingerItem'
export default {
  components: {
    SingerItem
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-container {
  .singer-list {
    padding: 0.5rem;
  }
}
</style>