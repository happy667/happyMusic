<template>
  <div class="singer-mv-container">
    <!-- loading -->
    <template v-if="loading">
      <loading />
    </template>

    <template v-if="mvList&&mvList.length!==0">
      <div class="singer-mv-wrapper">
        <mv-list :list="mvList"
                 @select="selectItem"></mv-list>
      </div>
    </template>
    <template v-else-if="mvList&&mvList.length===0">
      <no-result text="暂无相关MV"></no-result>
    </template>
  </div>
</template>
<script>
import NoResult from '@/components/common/NoResult'
import MvList from './singerMV/MvList'
export default {
  props: {
    mvList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    loading () {
      return this.mvList === null
    }
  },
  methods: {
    // 选择专辑进入专辑详情
    selectItem (item) {
      this.$router.push(`/videoInfo/${item.id}`)
    }
  },
  components: {
    MvList,
    NoResult
  }
}
</script>
<style lang="stylus" scoped>
.singer-mv-container {
  padding: 0 0.4rem 0 0.4rem;
}
</style>