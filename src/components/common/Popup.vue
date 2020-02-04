<template>
  <van-popup v-model="show"
             round
             position="bottom"
             :get-container="getContainer">
    <slot></slot>
  </van-popup>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: () => false
    },
    position: {
      type: String,
      default: () => 'bottom'
    },
    container: {
      type: String,
      default: () => 'body'
    }
  },
  methods: {
    getContainer () {
      return document.querySelector(this.container)
    }
  }
}
</script>
<style scoped>
</style>