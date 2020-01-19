<template>
  <div class="song-container">
    <template v-if="song.songList.length===0&&!song.isNull">
      <van-loading size="24px"
                   color="#FD4979"
                   vertical>加载中...</van-loading>
    </template>
    <template v-if="song.songList.length!==0">
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="handlePullingUp">
        <song-list :songsList="song.songList"></song-list>
      </van-list>
    </template>
    <template v-if="song.isNull">
      <div class="song-list-null">
        暂无相关歌曲
      </div>
    </template>
  </div>
</template>
<script>
import SongList from '@/components/home/song/SongList'
import searchApi from '@/api/search.js'
import { ERR_OK } from '@/api/config.js'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      song: {
        songCount: 0,
        songList: [],
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
      this.song.isNull = true
      return
    }
    this.getSearchSong()
  },
  methods: {
    // 查询单曲
    async getSearchSong () {
      // 显示加载logo
      this.loading = true
      // 设置偏移量=歌曲列表长度
      let offset = this.song.songList.length
      const { data: res } = await searchApi.getSearchResult(this.searchKeywords, 1, offset, 20)
      if (res.code === ERR_OK) {
        // 没有查询到数据
        if (res.result.songCount === 0 || !res.result.songs) {
          this.song.isNull = true
          return
        }
        if (this.song.songCount === 0) {
          this.song.songCount = res.result.songCount
        }
        // 将每次查询的歌曲追加到song.songList中
        // 因为可能存在重复数据，所以需要去重处理
        let list = this.song.songList.concat(res.result.songs)
        const map = new Map()
        list = list.filter(item => !map.has(item.id) && map.set(item.id, 1))
        this.song.songList = list
        // 关闭加载logo
        this.loading = false
      }
    },
    // 上拉加载更多单曲
    handlePullingUp () {
      // 加载时判断当前滚动的页面是否为该页面，因为其他页面在上拉加载时会干扰该页面
      if (this.searchCurrentIndex === 0) {
        setTimeout(async () => {
          if (this.song.songList.length >= this.song.songCount) {
            this.finished = true
          } else {
            await this.getSearchSong()
          }
          this.loading = false
        }, 500)
      } else {
        this.loading = false
      }
    }
  },

  components: {
    SongList
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.song-container {
  min-height: calc(100vh - (1.8rem + 1.22667rem + 1.18rem)) !important;
  box-sizing: border-box;

  .song-list-null {
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    color: $color-common-b;
    font-size: $font-size-smaller;
    text-align: center;
  }
}
</style>