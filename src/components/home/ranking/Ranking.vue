/* eslint-disable vue/valid-v-for */
<template>
  <div class="ranking-container">
    <!-- loading -->
    <van-loading v-show="this.rankingList.length === 0"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>

    <div class="ranking-list-wrapper"
         v-if="this.rankingList.length!==0 ">
      <template v-for="item in rankingList">
        <!-- 官方榜 -->
        <template v-if="item.title==='official'">
          <ranking-title title="官方榜"
                         :key="item.name"></ranking-title>
          <div class="list-container"
               :key="item.name">
            <official-list v-for="rankingObj in item.rankingList"
                           :key="rankingObj.id"
                           :rankingObj="rankingObj"></official-list>
          </div>

        </template>
        <!-- 推荐榜 -->
        <template v-else-if="item.title==='recommend'">
          <ranking-title title="推荐榜"
                         :key="item.name"></ranking-title>
          <common-list :rankingList="item.rankingList"
                       :key="item.name">
          </common-list>
        </template>
        <!-- 流行榜 -->
        <template v-else-if="item.title==='popular'">
          <ranking-title title="流行榜"
                         :key="item.name"></ranking-title>
          <common-list :rankingList="item.rankingList"
                       :key="item.name">
          </common-list>
        </template>
        <!-- 其他榜 -->
        <template v-else-if="item.title==='other'">
          <ranking-title title="其他榜"
                         :key="item.name"></ranking-title>
          <common-list :rankingList="item.rankingList"
                       :key="item.name">
          </common-list>
        </template>
      </template>

    </div>

  </div>
</template>
<script>
import OfficialList from './OfficialList'
import CommonList from './List'
import RankingTitle from '@/components/common/Title'
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState(['rankingList'])
  },
  methods: {
    ...mapActions(['getRankingList'])
  },
  mounted () {
    // 获取榜单列表
    this.$nextTick(() => {
      if (this.rankingList.length === 0) {
        this.getRankingList()
      }
    })
  },
  components: {
    OfficialList,
    RankingTitle,
    CommonList
  }
}
</script>
<style lang="stylus" scoped>
.ranking-container .list-container>>>.official-list-container:last-child {
  margin-bottom: 0;
}

.ranking-container {
  width: 100%;
  height: 100%;
  background: $color-common-background;

  .ranking-list-wrapper {
    padding: 0 0.5rem 0.3rem;
    box-sizing: border-box;
  }
}
</style>