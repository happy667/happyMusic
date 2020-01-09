<template>
  <div class="songs-list-containter">
    <ul class="songs-list">
      <li class="songs-list-item"
          v-for="item in songsList"
          :key="item.id">
        <song-item :song="item"></song-item>
      </li>
    </ul>
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
</style>