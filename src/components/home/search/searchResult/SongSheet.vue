<template>
  <div class="search-songSheet-container">
    <!-- loading -->
    <loading :loading="pageLoading" />
    <template v-if="songSheet.songSheetList.length!==0">
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="handlePullingUp">
        <song-sheet-list :list="songSheet.songSheetList"></song-sheet-list>
      </van-list>
    </template>
    <template v-if="songSheet.songSheetCount===0">
      <no-result text="暂无相关歌单"
                 image="search"></no-result>
    </template>
  </div>
</template>
<script>
import SongSheetList from '@/components/home/songSheet/SongSheetList'
import NoResult from '@/components/common/NoResult'
import searchApi from '@/api/search.js'
import { ERR_OK } from '@/api/config.js'
import {
  searchType
} from '@/assets/common/js/config.js'
import { mapState } from 'vuex'
export default {
  name: 'searchResultSongSheet',
  data () {
    return {
      songSheet: {
        songSheetCount: -1,
        songSheetList: [],
        isNull: false
      },
      loading: false,
      finished: false
    }
  },
  computed: {
    ...mapState(['searchKeywords', 'searchCurrentIndex']),
    pageLoading () {
      return this.songSheet.songSheetList.length === 0 && !this.songSheet.isNull
    }
  },
  mounted () {
    if (this.searchKeywords.trim().length === 0) {
      this.songSheet.isNull = true
      return
    }
    this.getSearchSongSheet()
  },
  methods: {
    // 查询歌单
    async getSearchSongSheet () {
      // 显示加载logo
      this.loading = true
      // 设置偏移量=歌单列表长度
      let offset = this.songSheet.songSheetList.length
      const { data: res } = await searchApi.getSearchResult(this.searchKeywords, searchType.songSheet, offset, 12)
      if (res.code === ERR_OK) {
        // 没有查询到数据

        if (!res.result.playlists || res.result.playlistCount === 0) {
          if (this.songSheet.songSheetCount === -1) {
            this.songSheet.songSheetCount = 0
          }
          this.songSheet.isNull = true
          return
        }
        if (this.songSheet.songSheetCount === -1) {
          this.songSheet.songSheetCount = res.result.playlistCount
        }

        // 将每次查询的歌单追加到songSheet.songSheetList 中
        // 因为可能存在重复数据，所以需要去重处理
        let list = this.songSheet.songSheetList.concat(res.result.playlists)
        const map = new Map()
        list = list.filter(item => !map.has(item.id) && map.set(item.id, 1))
        this.songSheet.songSheetList = list
        // 关闭加载logo
        this.loading = false
      }
    },
    // 上拉加载更多歌单
    handlePullingUp () {
      // 加载时判断当前滚动的页面是否为该页面，因为其他页面在上拉加载时会干扰该页面
      if (this.searchCurrentIndex === 4) {
        if (this.songSheet.isNull) { // 没有结果了
          this.finished = true
          return
        }
        setTimeout(async () => {
          if (this.songSheet.songSheetList.length >= this.songSheet.songSheetCount) {
            this.finished = true
          } else {
            await this.getSearchSongSheet()
          }
          this.loading = false
        }, 500)
      } else {
        this.loading = false
      }
    }
  },

  components: {
    SongSheetList,
    NoResult
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.search-songSheet-container {
  padding-top: 0.25rem;
  box-sizing: border-box;

  .songSheet-list-null {
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    color: $color-common-b;
    font-size: $font-size-smaller;
    text-align: center;
  }
}
</style>