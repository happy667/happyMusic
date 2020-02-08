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
        <song-list @select="handleSelect"
                   :songsList="song.songList"></song-list>
      </van-list>
    </template>
    <template v-if="song.isNull">
      <no-result text="暂无相关歌曲"></no-result>
    </template>
  </div>
</template>
<script>
import 'common/js/utils.js'
import SongList from '@/components/home/song/SongList'
import NoResult from '@/components/common/NoResult'
import searchApi from '@/api/search.js'
import { ERR_OK } from '@/api/config.js'
import { mapState, mapGetters, mapMutations } from 'vuex'
import Song from '@/assets/common/js/song.js'
import Singer from '@/assets/common/js/singer.js'
import songApi from '@/api/song.js'
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
    ...mapState(['searchKeywords', 'searchCurrentIndex']),
    ...mapGetters(['currentSong'])
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
          songList.push(new Song({ id: item.id, name: item.name, singers, singersList }))
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
    },
    // 选择歌曲
    async handleSelect (item, index) {
      this.$emit('closeList')
      // 判断点击的是否是当前播放的歌曲
      if (this.currentSong.id === item.id) {
        this.setPlayerFullScreen(true)
        return
      }
      // 获取歌曲详情
      const {
        data: res
      } = await songApi.getSongDetail(item.id)
      if (res.code === ERR_OK) {
        item.picUrl = res.songs[0].al.picUrl
        console.log(index)
        // 引入vue原型上的utils
        this.utils.playMusic(item)
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