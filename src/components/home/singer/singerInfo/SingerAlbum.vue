<template>
  <div class="singer-album-container">
    <!-- loading -->
    <loading :loading="loading" />
    <template v-if="singerAlbum&&singerAlbum.length!==0">
      <div class="singer-album-wrapper">
        <album-list :list="singerAlbum"
                    :showSinger="false"
                    showSongSize
                    @select="selectAlbum" />
      </div>
    </template>
    <template v-else-if="singerAlbum&&singerAlbum.length===0">
      <no-result text="暂无相关专辑"></no-result>
    </template>
  </div>
</template>
<script>
import NoResult from '@/components/common/NoResult'
import AlbumList from '@/components/common/album/AlbumList'
export default {
  props: {
    singerAlbum: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    loading () {
      return this.singerAlbum === null
    }
  },
  methods: {
    // 选择专辑进入专辑详情
    selectAlbum (item) {
      this.$router.push(`/singerAlbum/${item.id}`)
    }
  },
  components: {
    AlbumList,
    NoResult
  }
}
</script>
<style lang="stylus" scoped>
.singer-album-container {
  padding: 0 0.4rem 0 0.4rem;
}
</style>