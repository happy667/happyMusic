<template>
  <div class="play-list-container"
       @click="handleClick">
    <transition name="list-fade">
      <div class="container"
           v-show="$store.state.togglePlayList"
           @click.stop>

        <p-l-header></p-l-header>
        <p-l-section></p-l-section>

      </div>
    </transition>
  </div>
</template>
<script>
import PLHeader from './header/Header'
import PLSection from './section/Section'
export default {
  components: {
    PLHeader,
    PLSection
  },
  methods: {
    handleClick () {
      this.$store.commit('setTogglePlayList', false)
    }
  }
}
</script>
<style lang="stylus" scoped>
.list-fade-enter-active, .list-fade-leave-active {
  transition: all 0.3s;
}

.list-fade-enter, .list-fade-leave-to {
  transform: translate3d(0, 100%, 0);
}

.play-list-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2000;

  .container {
    position: absolute;
    width: 100%;
    bottom: 0;
    background: #fff;
    border-radius: 0.5rem 0.5rem 0 0;
  }
}
</style>