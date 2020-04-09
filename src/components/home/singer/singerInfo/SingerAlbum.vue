<template>
  <div class="singer-album-container">
    <!-- loading -->
    <loading :loading="singerAlbum.length===0" />
    <template v-if="singerAlbum.length!==0">
      <div class="singer-album-wrapper">
        <van-list v-model="loading"
                  :finished="finished"
                  finished-text="没有更多专辑了"
                  :immediate-check='false'
                  @load="handlePullingUp">
          <album-list :list="singerAlbum"
                      @select="selectItem"></album-list>

        </van-list>
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
    },
    finished: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      loading: false
    }
  },
  watch: {
    singerAlbum () {
      // 没有加载完
      this.loading = false
    }
  },
  methods: {
    ...mapMutations(['setIsAdvance']),
    // 选择专辑进入专辑详情
    selectItem (item) {
      // 设置为前进页面
      this.setIsAdvance(true)
      this.$router.push(`/singerAlbum/${item.id}`)
    },
    // 加载更多
    handlePullingUp () {
      this.$emit('pullingUp')
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