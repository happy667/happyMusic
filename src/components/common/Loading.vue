<template>
  <div class="loading-container"
       v-if="loading">
    <van-loading :size="size"
                 :color="color"
                 :style="style"
                 vertical>{{value}}</van-loading>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: () => '加载中...'
    },
    color: {
      type: String,
      default: () => '#FD4979'
    },
    size: {
      type: String,
      default: () => '26px'
    },
    loading: {
      type: Boolean,
      default: () => true
    },
    noValue: {
      type: Boolean
    },
    height: {
      type: String,
      default: () => '3rem'
    }

  },
  computed: {
    value () {
      return this.noValue ? '' : this.text
    },
    style () {
      return {
        height: this.height
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.loading-container>>>.van-loading {
  justify-content: center;
  background: $color-common-background;
}
</style>