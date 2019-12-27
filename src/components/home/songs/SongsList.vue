<template>
  <div class="songs-list-containter">
    <song-item></song-item>
    <song-item></song-item>
    <song-item></song-item>
    <song-item></song-item>
    <song-item></song-item>
    <song-item></song-item>
    <song-item></song-item>
  </div>
</template>
<script>
import SongItem from './SongItem'
export default {
  components: {
    SongItem
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';
</style>