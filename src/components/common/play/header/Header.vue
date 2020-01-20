<template>
  <header class="header-container">
    <div class="back"
         @click="handleBack">
      <van-icon name="arrow-down" />
    </div>
    <div class="song-info">
      <div class="song-name">{{currentSong.name}}</div>
      <div class="singer">{{currentSong.singers}}</div>
    </div>
  </header>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  methods: {
    ...mapMutations(['setPlayerFullScreen']),
    handleBack () {
      this.setPlayerFullScreen(false)
    }
  },
  computed: {
    ...mapGetters(['currentSong'])
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.header-container {
  margin: 0.3rem 0.3rem 0 0.3rem;
  position: relative;
  display: flex;
  font-size: $font-size-small;

  .back {
    position: absolute;
    top: 0;
    left: 0;
    width: 1rem;
    height: 0.7rem;
    line-height: 0.7rem;
    color: $color-common;
    z-index: 999;
  }

  .song-info {
    width: 100%;
    padding: 0 1.5rem;
    box-sizing: border-box;

    .song-name, .singer {
      width: 100%;
      height: 0.7rem;
      line-height: 0.7rem;
      text-align: center;
      no-wrap();
      font-size: $font-size-smaller;
    }

    .song-name {
      font-weight: 600;
    }

    .singer {
      color: #777;
    }
  }
}
</style>