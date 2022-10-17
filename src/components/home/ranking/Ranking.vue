<template>
  <scroll ref="ranking_scroll">
    <div class="ranking-container"
         ref="container">
      <!-- loading -->
      <loading :loading="load" />
      <div class="ranking-list-wrapper">

        <!-- 官方榜 -->
        <template v-if="rankingList1.length>0">
          <ranking-title title="官方榜"></ranking-title>
          <div class="list-container">
            <official-list v-for="rankingObj in rankingList1"
                           :key="rankingObj.id"
                           :rankingObj="rankingObj"></official-list>
          </div>
        </template>
        <!-- 精选榜 -->
        <template v-if="rankingList2.length>0">
          <div class="list-container">
            <ranking-title title="精选榜"></ranking-title>
            <common-list :rankingList="rankingList2">
            </common-list>
          </div>
        </template>
        <!-- 曲风榜 -->
        <template v-if="rankingList3.length>0">
          <div class="list-container">
            <ranking-title title="曲风榜"></ranking-title>
            <common-list :rankingList="rankingList3">
            </common-list>
          </div>
        </template>
        <!-- 全球榜-->
        <template v-if="rankingList4.length>0">
          <div class="list-container">
            <ranking-title title="全球榜"></ranking-title>
            <common-list :rankingList="rankingList4">
            </common-list>
          </div>
        </template>
        <!-- 语种榜-->
        <template v-if="rankingList5.length>0">
          <div class="list-container">
            <ranking-title title="语种榜"></ranking-title>
            <common-list :rankingList="rankingList5">
            </common-list>
          </div>
        </template>
        <!-- 特色榜-->
        <template v-if="rankingList6.length>0">
          <div class="list-container">
            <ranking-title title="特色榜"></ranking-title>
            <common-list :rankingList="rankingList6">
            </common-list>
          </div>
        </template>
        <!-- loading -->
        <loading :loading="loadMore" height="3rem" />
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
      return this.rankingList1.length === 0
    },
    loadMore () {
      return (this.rankingList1.length > 0 &&(this.rankingList2.length === 0 || this.rankingList3.length === 0 || this.rankingList4.length === 0 || this.rankingList5.length === 0 || this.rankingList6.length === 0))
    }
  },
  data () {
    return {
      rankingList1: [],// 排行列表1 官方榜
      rankingList2: [],// 排行列表2 精选榜
      rankingList3: [],// 排行列表3 曲风榜
      rankingList4: [],// 排行列表4 全球榜
      rankingList5: [],// 排行列表5 语种榜
      rankingList6: [],// 排行列表6 特色榜
      rankingListIds: {
        'official': [19723756, 3779629, 3778678, 2884035], // 存放官方榜下所有排行榜id
        'selected': [7657858751, 5453912201, 6723173524, 7356827205, 991319590, 3001890046], // 存放精选榜榜下所有排行榜id
        'genre': [1978921795, 3001835560, 5059633707, 5059661515, 10520166, 71384707, 5059642708, 6886768100], // 存放曲风榜下所有排行榜id
        'global': [60198, 180106, 60131, 27135204, 3812895, 6939992364], // 存放全球榜下所有排行榜id
        'languages': [2809513713, 2809577409, 5059644681, 745956260, 6732051320, 7095271308, 6732014811], // 存放语种榜下所有排行榜id
        'characteristic': [7603212484, 6688069460, 5338990334, 21845217, 3112516681] // 存放特色榜下所有排行榜id
      }
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
      // 分为官方榜，精选榜，曲风榜，全球榜,语种榜,特色榜
      await this.getRankingListByType(this.rankingList1, "official")
      await this.getRankingListByType(this.rankingList2, "selected")
      await this.getRankingListByType(this.rankingList3, "genre")
      await this.getRankingListByType(this.rankingList4, "global")
      await this.getRankingListByType(this.rankingList5, "languages")
      await this.getRankingListByType(this.rankingList6, "characteristic")

    },
    //根据排行类型获取歌单
    async getRankingListByType (list, type) {
      let tempList = [];
      for (let id of this.rankingListIds[type]) {
        const {
          data: res
        } = await rankingApi.getRankingListById(id)
        if (res.code === ERR_OK) {
          list.push(res.playlist)
        }
      }
      list = tempList
    },
    // 刷新
    refresh () {
      this.$refs.ranking_scroll.refresh()
    }
  },
  mounted () {
    // 获取榜单列表
    this.$nextTick(() => {
        this.getRankingList()
    })
  },
  activated () {
      this.getRankingList()
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