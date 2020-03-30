<template>
  <div class="button-container">
    {{text}}
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: () => '按钮'
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.button-container {
  width: 100%;
  padding: 0.4rem 0;
  color: #fff;
  font-size: 0.55rem;
  border-radius: 1rem;
  background: $color-common;
  box-shadow: 0 0.15rem 0.4rem #f4b3c5;
  text-align: center;
}
</style>