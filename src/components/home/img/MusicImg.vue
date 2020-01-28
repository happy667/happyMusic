<template>
  <div class="avatar-wrapper">
    <img v-lazy="avatar" />
  </div>
</template>
<script>
export default {
  props: {
    avatar: String
  }
}
</script>
<style lang="stylus" scoped>
.avatar-wrapper {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;

  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
</style>