<template>
  <section class="section-container">
    <div class="song-img"
         ref="img">
      <img v-lazy="currentSong.picUrl">
      <div class="img"></div>
    </div>

  </section>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['playing']),
    ...mapGetters(['currentSong'])
  },
  watch: {
    playing () {
      const img = this.$refs.img
      this.playing ? img.style.webkitAnimationPlayState = 'running' : img.style.webkitAnimationPlayState = 'paused'
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.section-container {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .song-img {
    position: relative;
    width: 6.4rem;
    height: 6.4rem;
    border-radius: 50%;
    animation: turn 10s linear infinite;
    padding: 1.3rem;
    background: transparent url('http://s3.music.126.net/mobile-new/img/disc-plus.png?b700b62e1971b351dcb8b8ce1c9ceea3=') center center;
    background-size: 100% 100%;
    border-radius: 50%;

    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: $color-common-b;
    }

    .img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: transparent url('http://s3.music.126.net/mobile-new/img/disc_light-plus.png?4392c8c9a8a33d4b2b2c33d3995503c9=') center center;
      background-size: 100% 100%;
    }
  }

  @keyframes turn {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}
</style>