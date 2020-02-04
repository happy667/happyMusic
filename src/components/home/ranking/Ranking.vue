<template>
  <div class="ranking-container">
    <!-- loading -->
    <van-loading v-if="load"
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
      <!-- loading -->
      <van-loading class="loadMore"
                   v-if="loadMore"
                   size="24px"
                   color="#FD4979"
                   vertical>加载中...</van-loading>
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
    ...mapState(['rankingList']),
    load () {
      return !this.rankingList[0]
    },
    loadMore () {
      return this.rankingList[0] & !this.rankingList[1] || !this.rankingList[2] || !this.rankingList[3]
    }
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

.ranking-container>>>.loadMore {
  height: 2rem !important;
}

.ranking-container {
  width: 100%;
  height: 100%;
  background: $color-common-background;

  .ranking-list-wrapper {
    padding: 0 0.5rem;
    box-sizing: border-box;

    .list-container {
      padding-bottom: 0.5rem;
    }
  }
}
</style>