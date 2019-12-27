<template>
  <div class="videoList-container">
    <video-item></video-item>
    <video-item></video-item>
  </div>
</template>
<script>
import VideoItem from './Video'
export default {

  components: {
    VideoItem
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.videoList-container {
  padding: 0.5rem;
  width: 100%;
  box-sizing: border-box;
}
</style>