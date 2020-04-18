<template>
  <div class="singer-mv-container">
    <!-- loading -->
    <template v-if="mvList.length===0">
      <loading />
    </template>

    <template v-else>
      <div class="singer-mv-wrapper">
        <mv-list :list="mvList"
                 @select="selectItem"></mv-list>
      </div>
    </template>
  </div>
</template>
<script>
import MvList from './singerMV/MvList'
export default {
  props: {
    mvList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 选择专辑进入专辑详情
    selectItem (item) {
      this.$router.push(`/videoInfo/${item.id}`)
    }
  },
  components: {
    MvList
  }
}
</script>
<style lang="stylus" scoped>
.singer-mv-container {
  padding: 0 0.4rem 0 0.4rem;
}
</style>