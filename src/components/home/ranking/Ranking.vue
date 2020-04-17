<template>
  <scroll ref="ranking_scroll">
    <div class="ranking-container"
         ref="container">
      <!-- loading -->
      <loading :loading="load" />
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
  </scroll>
</template>
<script>
import Scroll from '@/components/common/Scroll'
import OfficialList from './OfficialList'
import CommonList from './List'
import RankingTitle from '@/components/common/Title'
import rankingApi from '@/api/ranking.js'
import { mapState } from 'vuex'
import {
  ERR_OK
} from '@/api/config.js'
export default {
  computed: {
    ...mapState(['currentPlayIndex']),
    load () {
      return !this.rankingList[0]
    },
    loadMore () {
      return this.rankingList[0] & !this.rankingList[1] || !this.rankingList[2] || !this.rankingList[3]
    }
  },
  data () {
    return {
      rankingList: []// 排行列表
    }
  },
  watch: {
    loadMore () {
      if (this.currentPlayIndex !== -1) {
        this.$emit('refreshList')
      }
    },
    rankingList () {
      if (this.currentPlayIndex !== -1) {
        this.$emit('refreshList')
      }
    }
  },
  methods: {
    // 获取排行榜
    async getRankingList () {
      // 根据id获取对应排行榜,首先根据接口将排行榜进行分类
      // 分为官方榜，流行榜，推荐榜，其他榜
      const rankingListIds = {
        'official': [0, 1, 2, 3, 4], // 存放官方榜下所有排行榜id
        'recommend': [23, 25, 26, 31, 32, 17, 22], // 存放推荐榜榜下所有排行榜id
        'popular': [5, 14, 15, 27, 30, 24, 28], // 存放流行榜下所有排行榜id
        'other': [6, 7, 8, 9, 10, 11, 12, 13, 16, 19, 20, 21, 29, 33] // 存放其他榜下所有排行榜id
      }
      // 存放榜单列表
      const rankingList = []
      // 遍历标题
      for (let title in rankingListIds) {
        let rankingObj = {
          title,
          rankingList: []
        }
        // 遍历标题下所有榜单
        for (let i = 0; i < rankingListIds[title].length; i++) {
          const {
            data: res
          } = await rankingApi.getRankingListById(rankingListIds[title][i])
          if (res.code === ERR_OK) {
            rankingObj.rankingList.push(res.playlist)
          }
        }
        rankingList.push(rankingObj)
        this.rankingList = rankingList
      }
    },
    // 刷新
    refresh () {
      this.$refs.ranking_scroll.refresh()
    }
  },
  mounted () {
    // 获取榜单列表
    this.$nextTick(() => {
      if (this.rankingList.length === 0) {
        this.getRankingList()
      }
    })
  },
  activated () {
    if (this.rankingList.length === 0) {
      this.getRankingList()
    }
  },

  components: {
    OfficialList,
    RankingTitle,
    CommonList,
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
.ranking-container .list-container>>>.official-list-container:last-child {
  margin-bottom: 0;
}

.ranking-container {
  width: 100%;
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