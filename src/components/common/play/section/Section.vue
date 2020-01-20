<template>
  <section class="section-container">
    <div class="song-img">
      <img :src="currentSong.picUrl">
    </div>
  </section>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['currentSong'])
  }
}
</script>
<style lang="stylus" scoped>
.section-container {
  flex: 1;
  width: 100%;
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;

  .song-img {
    width: 6.5rem;
    height: 6.5rem;
    border-radius: 50%;

    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
</style>