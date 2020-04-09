<template>
  <div class="play-list-container"
       @click="handleClick">
    <transition enter-active-class="animated fadeInUp faster"
                leave-active-class="animated fadeOutDown faster">
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
.play-list-container {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
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