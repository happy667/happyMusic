<template>
  <div class="songs-list-containter">
    <song-item v-for="item in songsList"
               :key="item.id"
               :song="item"></song-item>
  </div>
</template>
<script>
import SongItem from './SongItem'
export default {
  props: {
    songsList: Array
  },
  methods: {
    // 跳转到mv详情页
    goToVideoInfo () {
      this.$router.push('/videoInfo')
    }
  },
  components: {
    SongItem
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';
</style>