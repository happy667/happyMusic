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
import 'common/js/convert.js'
import AlbumList from '@/components/home/singer/albumList/AlbumList'
import { mapMutations } from 'vuex'
export default {
  props: {
    singerAlbum: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    ...mapMutations(['setIsAdvance']),
    // 选择专辑进入专辑详情
    selectItem (item) {
      // 设置为前进页面
      this.setIsAdvance(true)
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