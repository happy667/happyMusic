<template>
  <div class="singer-container">
    <template v-if="singer.singerList.length===0&&!singer.isNull">
      <van-loading size="24px"
                   color="#FD4979"
                   vertical>加载中...</van-loading>
    </template>
    <template v-if="singer.singerList.length!==0">
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="handlePullingUp">
        <ul class="singer-list">
          <li class="singer-list-item"
              v-for="item in singer.singerList"
              :key="item.id">
            <singer-item :singer="item"
                         @select="handleSelect"></singer-item>
          </li>
        </ul>
      </van-list>
    </template>
    <template v-if="singer.isNull">
      <no-result text="暂无相关歌手"></no-result>
    </template>
  </div>
</template>
<script>
import SingerItem from '@/components/home/singer/SingerItem'
import NoResult from '@/components/common/NoResult'
import Singer from '@/assets/common/js/singer.js'
import searchApi from '@/api/search.js'
import { ERR_OK } from '@/api/config.js'
import { mapState } from 'vuex'
export default {
  name: 'searchResultSinger',
  data () {
    return {
      singer: {
        singerCount: 0,
        singerList: [],
        isNull: false
      },
      loading: false,
      finished: false
    }
  },
  computed: {
    ...mapState(['searchKeywords', 'searchCurrentIndex'])
  },
  mounted () {
    if (this.searchKeywords.trim().length === 0) {
      this.singer.isNull = true
      return
    }
    this.getSearchSinger()
  },
  methods: {
    // 查询歌手
    async getSearchSinger () {
      // 显示加载logo
      this.loading = true
      // 设置偏移量=歌手列表长度
      let offset = this.singer.singerList.length
      const { data: res } = await searchApi.getSearchResult(this.searchKeywords, 100, offset, 15)
      if (res.code === ERR_OK) {
        // 没有查询到数据
        if (res.result.singerCount === 0 || !res.result.artists) {
          this.singer.isNull = true
          return
        }
        let singerList = []
        res.result.artists.forEach(item => {
          singerList.push(new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliaName: item.alias.join(' / '),
            picUrl: item.picUrl
          }))
        })
        if (this.singer.singerCount === 0) {
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
      if (this.searchCurrentIndex === 1) {
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
      this.$router.push(`/singerInfo/${item.id}`)
    }
  },

  components: {
    SingerItem,
    NoResult
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-container {
  min-height: calc(100vh - (1.8rem + 1.22667rem + 1.18rem)) !important;
  box-sizing: border-box;
}
</style>