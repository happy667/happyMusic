<template>
  <div class="search-album-container">
    <!-- loading -->
    <loading :loading="pageLoading" />
    <template v-if="album.albumList.length!==0">
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="handlePullingUp">
        <div class="album-list">
          <album-list :list="album.albumList"
                      @select="selectItem"></album-list>
        </div>
      </van-list>
    </template>
    <template v-if="album.albumCount===0">
      <no-result text="暂无相关专辑"
                 image="search"></no-result>
    </template>
  </div>
</template>
<script>
import AlbumList from '@/components/common/album/AlbumList'
import NoResult from '@/components/common/NoResult'
import searchApi from '@/api/search.js'
import { ERR_OK } from '@/api/config.js'
import { mapState } from 'vuex'
import {
  searchType
} from '@/assets/common/js/config.js'
export default {
  name: 'searchResultMV',
  data () {
    return {
      album: {
        albumCount: -1,
        albumList: [],
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
      return this.album.albumList.length === 0 && !this.album.isNull
    }
  },
  mounted () {
    if (this.searchKeywords.trim().length === 0) {
      this.album.isNull = true
      return
    }
    this.getSearchSAlbum()
  },
  methods: {
    // 查询专辑
    async getSearchSAlbum () {
      // 显示加载logo
      this.loading = true
      // 设置偏移量=album列表长度
      let offset = this.album.albumList.length
      const { data: res } = await searchApi.getSearchResult(this.searchKeywords, searchType.album, offset, 12)
      if (res.code === ERR_OK) {
        // 没有查询到数据
        if (!res.result.albums || res.result.albumCount === 0) {
          this.album.albumCount = 0
          this.album.isNull = true
          return
        }
        // 保存查询数量
        if (this.album.albumCount === -1) {
          this.album.albumCount = res.result.albumCount
        }
        let list = this.album.albumList.concat(res.result.albums)
        // 将每次查询的list追加到album.albumList中
        this.album.albumList = list
        // 关闭加载logo
        this.loading = false
      }
    },
    // 上拉加载更多专辑
    handlePullingUp () {
      // 加载时判断当前滚动的页面是否为该页面，因为其他页面在上拉加载时会干扰该页面
      if (this.searchCurrentIndex === 3) {
        if (this.album.isNull) { // 没有结果了
          this.finished = true
          return
        }
        setTimeout(async () => {
          if (this.album.albumList.length >= this.album.albumCount) {
            this.finished = true
          } else {
            await this.getSearchSAlbum()
          }
          this.loading = false
        }, 500)
      } else {
        this.loading = false
      }
    },
    selectItem (item) {
      this.$router.push(`/singerAlbum/${item.id}`)
    }
  },

  components: {
    NoResult,
    AlbumList
  }
}
</script>