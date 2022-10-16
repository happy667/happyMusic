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
          <!-- 精选榜 -->
          <template v-else-if="item.title==='selected'">
            <ranking-title title="精选榜"
                           :key="item.name"></ranking-title>
            <common-list :rankingList="item.rankingList"
                         :key="item.name">
            </common-list>
          </template>
          <!-- 曲风榜 -->
          <template v-else-if="item.title==='genre'">
            <ranking-title title="曲风榜"
                           :key="item.name"></ranking-title>
            <common-list :rankingList="item.rankingList"
                         :key="item.name">
            </common-list>
          </template>
          <!-- 全球榜-->
          <template v-else-if="item.title==='global'">
            <ranking-title title="全球榜"
                           :key="item.name"></ranking-title>
            <common-list :rankingList="item.rankingList"
                         :key="item.name">
            </common-list>
          </template>
          <!-- 语种榜-->
          <template v-else-if="item.title==='languages'">
            <ranking-title title="语种榜"
                           :key="item.name"></ranking-title>
            <common-list :rankingList="item.rankingList"
                         :key="item.name">
            </common-list>
          </template>
          <!-- 特色榜-->
          <template v-else-if="item.title==='characteristic'">
            <ranking-title title="特色榜"
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
      return this.rankingList[0] & !this.rankingList[1] || !this.rankingList[2] || !this.rankingList[3] || !this.rankingList[4] || !this.rankingList[5]
    }
  },
  data () {
    return {
      rankingList: []// 排行列表
    }
  },
  watch: {
    rankingList () {
      this.refresh()
    }
  },
  methods: {
    // 获取排行榜
    async getRankingList () {
      // 根据id获取对应排行榜,首先根据接口将排行榜进行分类
      // 分为官方榜，精选榜，曲风榜，全球榜,语种榜,特色榜
      const rankingListIds = {
        'official': [19723756, 3779629, 3778678, 2884035], // 存放官方榜下所有排行榜id
        'selected': [7657858751, 5453912201, 6723173524, 7356827205,991319590,3001890046], // 存放精选榜榜下所有排行榜id
        'genre': [1978921795, 3001835560, 5059633707, 5059661515, 10520166, 71384707, 5059642708, 6886768100], // 存放曲风榜下所有排行榜id
        'global': [60198, 180106, 60131, 27135204, 3812895, 6939992364], // 存放全球榜下所有排行榜id
        'languages': [2809513713, 2809577409, 5059644681, 745956260, 6732051320, 7095271308, 6732014811], // 存放语种榜下所有排行榜id
        'characteristic': [7603212484, 6688069460, 5338990334, 21845217, 3112516681] // 存放特色榜下所有排行榜id
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
@import '~common/stylus/variable'
.ranking-container .list-container>>>.official-list-container:last-child
  margin-bottom 0
.ranking-container
  width 100%
  background $color-common-background
  .ranking-list-wrapper
    padding 0 0.5rem
    box-sizing border-box
    .list-container
      padding-bottom 0.5rem
</style>