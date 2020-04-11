<template>
  <div class="no-result-container">
    <van-empty :description="text"
               :image="image" />
  </div>
</template>
<script>
export default {
  props: {
    text: String,
    image: {
      type: String,
      default: () => 'default'
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';
</style>