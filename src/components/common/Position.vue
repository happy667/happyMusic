<template>
  <transition v-if="animation"
              enter-active-class="animated fadeIn faster"
              leave-active-class="animated fadeOut faster">
    <div class="position-container"
         @click.stop="handleClick">
      <div class="icon">
        <van-icon name="aim"
                  size="0.6rem" />
      </div>
    </div>
  </transition>
  <div v-else
       class="position-container"
       @click.stop="handleClick">
    <div class="icon">
      <van-icon name="aim"
                size="0.6rem" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    animation: {
      type: Boolean,
      default: () => true
    }
  },
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.position-container {
  position: fixed;
  right: 2rem;
  bottom: 2.5rem;
  z-index: 99;

  .icon {
    width: 0.8rem;
    height: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    color: $color-common;
    border-radius: 50%;
    box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.2);
  }
}
</style>