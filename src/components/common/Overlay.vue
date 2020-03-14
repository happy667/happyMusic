<template>
  <div class="overlay-container">
    <van-overlay :show="showImage">
      <div class="wrapper"
           @click.stop="handleToggleShowImage">
        <van-image :src="imgUrl"></van-image>
      </div>
    </van-overlay>
  </div>
</template>
<script>
export default {
  props: {
    imgUrl: String,
    showImage: {
      type: Boolean,
      default: () => false
    }
  },
  methods: {
    handleToggleShowImage () {
      this.$emit('toggle')
    }
  }
}
</script>
<style lang="stylus" scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
