<template>
  <div class="singer-album-container">
    <!-- loading -->
    <loading :loading="singerAlbum.length===0" />
    <template v-if="singerAlbum.length!==0">
      <div class="singer-album-wrapper">
        <album-list :list="singerAlbum"
                    @select="selectItem"></album-list>
      </div>
    </template>
  </div>
</template>
<script>
import AlbumList from '@/components/home/singer/albumList/AlbumList'
export default {
  props: {
    singerAlbum: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 选择专辑进入专辑详情
    selectItem (item) {
      this.$router.push(`/singerAlbum/${item.id}`)
    }
  },
  components: {
    AlbumList
  }
}
</script>
<style lang="stylus" scoped>
.singer-album-container {
  padding: 0 0.4rem 0 0.4rem;
}
</style>