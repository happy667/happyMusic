<template>
  <div class="mv-container">
    <template v-if="mv.mvList.length===0&&!mv.isNull">
      <van-loading size="24px"
                   color="#FD4979"
                   vertical>加载中...</van-loading>
    </template>
    <template v-if="mv.mvList.length!==0">
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="handlePullingUp">
        <div class="mv-list">
          <mv-list :list="mv.mvList"></mv-list>
        </div>
      </van-list>
    </template>
    <template v-if="mv.isNull">
      <no-result text="暂无相关MV"></no-result>
    </template>
</div>
</template>
<script>
import MvList from '@/components/common/mv/MvList'
import NoResult from '@/components/common/NoResult'
import searchApi from '@/api/search.js'
import { ERR_OK } from '@/api/config.js'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      mv: {
        mvCount: 0,
        mvList: [],
        isNull: false
      },
      loading: false,
      finished: false
    }
  },
  computed: {
    ...mapState(['searchKeywords', 'searchCurrentIndex']),
    listenChange () {
      const { searchKeywords, searchCurrentIndex } = this
      return { searchKeywords, searchCurrentIndex }
    }
  },
  mounted () {
    if (this.searchKeywords.trim().length === 0) {
      this.mv.isNull = true
      return
    }
    this.getSearchMV()
  },
  methods: {
    ...mapActions(['getVideoUrl', 'getSingerAvatar']),
    // 查询MV
    async getSearchMV () {
      // 显示加载logo
      this.loading = true
      // 设置偏移量=mv列表长度
      let offset = this.mv.mvList.length
      const { data: res } = await searchApi.getSearchResult(this.searchKeywords, 1004, offset, 8)
      if (res.code === ERR_OK) {
        // 没有查询到数据
        if (res.result.mvCount === 0 || !res.result.mvs) {
          this.mv.isNull = true
          return
        }
        // 还需要获取头像和播放地址
        let videoList = res.result.mvs
        // 获取视频url
        videoList = await this.getVideoUrl(videoList)
        // 获取歌手头像
        videoList = await this.getSingerAvatar(videoList)
        if (this.mv.mvCount === 0) {
          this.mv.mvCount = res.result.mvCount
        }
        // 因为可能存在重复数据，所以需要去重处理
        let list = this.mv.mvList.concat(videoList)
        const map = new Map()
        list = list.filter(item => !map.has(item.id) && map.set(item.id, 1))
        // 将每次查询的mv追加到mv.mvList中
        this.mv.mvList = list
        // 关闭加载logo
        this.loading = false
      }
    },
    // 上拉加载更多mv
    handlePullingUp () {
      // 加载时判断当前滚动的页面是否为该页面，因为其他页面在上拉加载时会干扰该页面
      if (this.searchCurrentIndex === 3) {
        setTimeout(async () => {
          if (this.mv.mvList.length >= this.mv.mvCount) {
            this.finished = true
          } else {
            await this.getSearchMV()
          }
          this.loading = false
        }, 500)
      } else {
        this.loading = false
      }
    }
  },

  components: {
    MvList,
    NoResult
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.mv-container {
  padding: 0.25rem 0.4rem 0;
  min-height: calc(100vh - (1.8rem + 1.22667rem + 1.18rem)) !important;
  box-sizing: border-box;
}
</style>