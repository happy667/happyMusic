<template>
  <div class="search-mv-container">
    <!-- loading -->
    <loading :loading="pageLoading" />
    <template v-if="mv.mvList.length!==0">
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="handlePullingUp">
        <div class="mv-list">
          <mv-list @select="goToVideoInfo"
                   :list="mv.mvList"></mv-list>
        </div>
      </van-list>
    </template>
    <template v-if="mv.mvCount===0">
      <no-result text="暂无相关MV"
                 image="search"></no-result>
    </template>
  </div>
</template>
<script>
import MvList from '@/components/common/video/VideoList'
import NoResult from '@/components/common/NoResult'
import searchApi from '@/api/search.js'
import Video from '@/assets/common/js/video.js'
import { ERR_OK } from '@/api/config.js'
import { mapState } from 'vuex'
import {
  SEARCH_TYPE
} from '@/assets/common/js/config.js'
export default {
  name: 'searchResultMV',
  data () {
    return {
      mv: {
        mvCount: -1,
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
    },
    pageLoading () {
      return this.mv.mvList.length === 0 && !this.mv.isNull
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
    // 查询MV
    async getSearchMV () {
      // 显示加载logo
      this.loading = true
      // 设置偏移量=mv列表长度
      let offset = this.mv.mvList.length
      const { data: res } = await searchApi.getSearchResult(this.searchKeywords, SEARCH_TYPE.mv, offset, 8)
      if (res.code === ERR_OK) {
        // 没有查询到数据
        if (!res.result.mvs || res.result.mvCount === 0) {
          if (this.mv.mvCount === -1) {
            this.mv.mvCount = 0
          }

          this.mv.isNull = true
          return
        }
        // 保存查询数量
        if (this.mv.mvCount === -1) {
          this.mv.mvCount = res.result.mvCount
        }
        // 用于保存处理后的视频列表
        let videoList = []
        res.result.mvs.forEach(item => {
          let video = new Video({
            id: item.id,
            coverUrl: item.cover,
            name: item.name,
            playCount: item.playCount,
            duration: item.duration,
            creatorName: item.artists.map(item => item.name).join('/')
          })
          videoList.push(video)
        })

        let list = this.mv.mvList.concat(videoList)
        // 将每次查询的mv追加到mv.mvList中
        this.mv.mvList = list
        // 关闭加载logo
        this.loading = false
      }
    },
    // 上拉加载更多mv
    handlePullingUp () {
      // 加载时判断当前滚动的页面是否为该页面，因为其他页面在上拉加载时会干扰该页面
      if (this.searchCurrentIndex === 5) {
        if (this.mv.isNull) { // 没有结果了
          this.finished = true
          return
        }
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
    },
    goToVideoInfo (mv) {
      this.$router.push(`/videoInfo/${mv.id}`)
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

.search-mv-container {
  padding: 0.25rem 0.4rem 0;
  box-sizing: border-box;
}
</style>