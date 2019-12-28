<template>
  <header class="header-container">
    <div class="back"
         @click="handleBack">
      <van-icon name="arrow-left" />
    </div>
    <div class="song-info">
      <div class="song-name">Faded</div>
      <div class="singer">Alan Walker</div>
    </div>
  </header>
</template>
<script>
export default {
  methods: {
    handleBack () {
      this.$router.back()
    }
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