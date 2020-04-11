<template>
  <div class="avatar-wrapper">
    <img v-lazy="avatar"
         :key="avatar"
         class="animated fadeIn" />
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
@import '~common/stylus/variable';

.avatar-wrapper {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: $color-common-b;

  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
</style>