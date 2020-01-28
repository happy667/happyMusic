<template>
  <div class="no-result-container">
    {{text}}
  </div>
</template>
<script>
export default {
  props: {
    text: String
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.no-result-container {
  width: 100%;
  height: 1rem;
  color: $color-common-b;
  font-size: $font-size-smaller;
  text-align: center;
}
</style>