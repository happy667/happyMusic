<template>
  <transition-group>
    <slot></slot>
  </transition-group>
</template>
<style lang="stylus">
.v-enter, .v-leave-to {
  opacity: 0;
}

.v-enter-active, .v-leave-active {
  transition: opacity 1s;
}
</style>