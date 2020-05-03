<template>
  <div class="search-singer-container">
    <!-- loading -->
    <loading :loading="pageLoading" />
    <template v-if="singer.singerList.length!==0">
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="handlePullingUp">
        <singer-list :list="singer.singerList"
                     @select="handleSelect"></singer-list>
      </van-list>
    </template>
    <template v-if="singer.singerCount===0">
      <no-result text="暂无相关歌手"
                 image="search"></no-result>
    </template>
  </div>
</template>
<script>
import SingerList from '@/components/common/singer_desc/SingerList'
import NoResult from '@/components/common/NoResult'
import Singer from '@/assets/common/js/singer.js'
import searchApi from '@/api/search.js'
import { ERR_OK } from '@/api/config.js'
import { mapState, mapMutations } from 'vuex'
import {
  SEARCH_TYPE
} from '@/assets/common/js/config.js'
export default {
  name: 'searchResultSinger',
  data () {
    return {
      singer: {
        singerCount: -1,
        singerList: [],
        isNull: false
      },
      loading: false,
      finished: false
    }
  },
  watch: {
    loadMore () {
      this.$nextTick(() => {
        this.refresh()
      })
    }
  },
  computed: {
    ...mapState(['searchKeywords', 'searchCurrentIndex']),
    pageLoading () {
      return this.singer.singerList.length === 0 && !this.singer.isNull
    }
  },
  mounted () {
    if (this.searchKeywords.trim().length === 0) {
      this.singer.isNull = true
      return
    }
    this.getSearchSinger()
  },
  methods: {
    ...mapMutations(['setSingerCurrentIndex']),
    // 查询歌手
    async getSearchSinger () {
      // 显示加载logo
      this.loading = true
      // 设置偏移量=歌手列表长度
      let offset = this.singer.singerList.length
      const { data: res } = await searchApi.getSearchResult(this.searchKeywords, SEARCH_TYPE.singer, offset, 15)
      if (res.code === ERR_OK) {
        // 没有查询到数据
        if (!res.result.artists || res.result.artistCount === 0) {
          if (this.singer.singerCount === -1) {
            this.singer.singerCount = 0
          }
          this.singer.isNull = true
          return
        }
        // 保存查询数量
        if (this.singer.singerCount === -1) {
          this.singer.singerCount = res.result.artistCount
        }
        let singerList = []
        res.result.artists.forEach(item => {
          singerList.push(new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliaName: item.alias.join(' / '),
            picUrl: item.picUrl,
            mvSize: item.mvSize,
            albumSize: item.albumSize,
            followed: item.followed
          }))
        })
        if (this.singer.singerCount === -1) {
          this.singer.singerCount = res.result.artistCount
        }
        // 因为可能存在重复数据，所以需要去重处理
        // 将每次查询的歌手追加到Singer.SingerList中
        let list = this.singer.singerList.concat(singerList)
        const map = new Map()
        list = list.filter(item => !map.has(item.id) && map.set(item.id, 1))

        this.singer.singerList = list
        // 关闭加载logo
        this.loading = false
      }
    },
    // 上拉加载更多歌手
    handlePullingUp () {
      // 加载时判断当前滚动的页面是否为该页面，因为其他页面在上拉加载时会干扰该页面
      if (this.searchCurrentIndex === 2) {
        if (this.singer.isNull) { // 没有结果了
          this.finished = true
          return
        }
        setTimeout(async () => {
          if (this.singer.singerList.length >= this.singer.singerCount) {
            this.finished = true
          } else {
            await this.getSearchSinger()
          }
          this.loading = false
        }, 500)
      } else {
        this.loading = false
      }
    },
    // 选择歌手
    handleSelect (item) {
      this.setSingerCurrentIndex(0)
      this.$router.push(`/singerInfo/${item.id}`)
    }
  },

  components: {
    SingerList,
    NoResult
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';
</style>