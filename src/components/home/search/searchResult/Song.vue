<template>
  <div class="search-song-container">
    <!-- loading -->
    <loading :loading="pageLoading" />
    <template v-if="song.songList.length!==0">
      <van-list v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="handlePullingUp">
        <song-list @select="selectSong"
                   ref="songList"
                   :songsList="song.songList"></song-list>
      </van-list>
    </template>
    <template v-if="song.songCount===0">
      <no-result text="暂无相关歌曲"
                 image="search"></no-result>
    </template>
  </div>
</template>
<script>
import SongList from '@/components/home/song/SongList'
import NoResult from '@/components/common/NoResult'
import searchApi from '@/api/search.js'
import { ERR_OK } from '@/api/config.js'
import {
  SEARCH_TYPE
} from '@/assets/common/js/config.js'
import { mapState, mapGetters, mapMutations } from 'vuex'
import Song from '@/assets/common/js/song.js'
import Singer from '@/assets/common/js/singer.js'
import songApi from '@/api/song.js'

export default {
  name: 'searchResultSong',
  data () {
    return {
      song: {
        songCount: -1,
        songList: [],
        isNull: false
      },
      loading: false,
      finished: false
    }
  },
  computed: {
    ...mapState(['searchKeywords', 'searchCurrentIndex']),
    ...mapGetters(['currentSong']),
    pageLoading () {
      return this.song.songList.length === 0 && !this.song.isNull
    }
  },
  mounted () {
    if (this.searchKeywords.trim().length === 0) {
      this.song.isNull = true
      return
    }
    this.getSearchSong()
  },
  methods: {
    ...mapMutations(['setPlayerFullScreen']),
    // 查询单曲
    async getSearchSong () {
      // 显示加载logo
      this.loading = true
      // 设置偏移量=歌曲列表长度
      let offset = this.song.songList.length
      const { data: res } = await searchApi.getSearchResult(this.searchKeywords, SEARCH_TYPE.song, offset, 20)
      if (res.code === ERR_OK) {
        console.log(res)
        // 没有查询到数据
        if (!res.result.songs || res.result.songCount === 0) {
          if (this.song.songCount === -1) {
            this.song.songCount = 0
          }

          this.song.isNull = true
          return
        }
        // 保存查询数量
        console.log(this.song.songCount)
        if (this.song.songCount === -1) {
          this.song.songCount = res.result.songCount
        }
        // 将每次查询的歌曲追加到song.songList中
        let songList = []
        res.result.songs.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
          let singers = item.artists.map(item => item.name).join('/')
          let singersList = []
          // 处理歌手
          item.artists.forEach(item => {
            singersList.push(new Singer({
              id: item.id,
              name: item.name,
              avatar: item.img1v1Url,
              picUrl: item.picUrl
            }))
          })
          songList.push(new Song({ id: item.id, name: item.name, singers, singersList, mv: item.mvid }))
        })
        // 将每次查询的歌曲追加到song.songList中
        // 因为可能存在重复数据，所以需要去重处理
        let list = this.song.songList.concat(songList)
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
      if (this.searchCurrentIndex === 1) {
        if (this.song.isNull) { // 没有结果了
          this.finished = true
          return
        }
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
    },
    // 选择歌曲
    async selectSong (item, index) {
      this.$emit('closeList')
      // 比较两首歌曲
      let result = this.$utils.compareSong(this.currentSong, item)
      if (!result) {
        // 获取歌曲详情
        const {
          data: res
        } = await songApi.getSongDetail(item.id)
        if (res.code === ERR_OK) {
          item.picUrl = res.songs[0].al.picUrl
          console.log(index)
          // 引入vue原型上的utils
          this.$utils.playMusic(item)
        }
      }
    }
  },

  components: {
    SongList,
    NoResult
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.search-song-container {
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