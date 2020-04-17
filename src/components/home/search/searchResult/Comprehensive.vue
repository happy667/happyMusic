<template>
  <div class="search-comprehensive-container">
    <!-- loading -->
    <loading :loading="loading" />
    <template v-if="!loading&&result">
      <!-- 歌曲 -->
      <div class="search">
        <div class="search-song">
          <song-list @select="selectSong"
                     :songsList="result.song.songList">
            <template>
              <div class="header">
                <Title title="单曲"></Title>
                <play-all :length="result.song.songList.length"
                          @play="handlePlayAll(result.song.songList[0],result.song.songList)"></play-all>
              </div>
            </template>
          </song-list>
          <div class="more"
               @click="setCurrentIndex(1)">
            <div class="text">
              {{result.song.moreText}}
            </div>
            <div class="icon">
              <van-icon name="arrow" />
            </div>

          </div>
        </div>
      </div>
      <!-- 歌手 -->
      <div class="search">
        <div class="search-singer">
          <Title title="歌手"></Title>
          <ul class="singer-list">
            <li class="singer-list-item"
                v-for="item in result.singer.singerList"
                :key="item.id">
              <singer-item :singer="item"
                           @select="selectSinger"></singer-item>
            </li>
          </ul>
          <div class="more"
               @click="setCurrentIndex(2)">
            <div class="text">
              {{result.singer.moreText}}
            </div>
            <div class="icon">
              <van-icon name="arrow" />
            </div>

          </div>
        </div>
      </div>
      <!-- 专辑 -->
      <div class="search">
        <div class="search-album">
          <album-list :list="result.album.albumList"
                      @select="selectAlbum">
            <template>
              <Title title="专辑"></Title>
            </template>
          </album-list>
          <div class="more"
               @click="setCurrentIndex(3)">
            <div class="text">
              {{result.album.moreText}}
            </div>
            <div class="icon">
              <van-icon name="arrow" />
            </div>

          </div>
        </div>
      </div>
      <!-- 歌单 -->
      <div class="search">
        <div class="search-songSheet">
          <song-sheet-list @select="selectSongSheet"
                           :list="result.songSheet.songSheetList">
            <template>
              <Title title="歌单"></Title>
            </template>
          </song-sheet-list>
          <div class="more"
               @click="setCurrentIndex(4)">
            <div class="text">
              {{result.songSheet.moreText}}
            </div>
            <div class="icon">
              <van-icon name="arrow" />
            </div>

          </div>
        </div>
      </div>
    </template>
    <template v-if="isNull">
      <no-result text="暂无搜索结果"
                 image="search"></no-result>
    </template>
  </div>
</template>
<script>
import {
  searchType
} from '@/assets/common/js/config.js'
import { ERR_OK } from '@/api/config.js'
import Song from '@/assets/common/js/song.js'
import PlayAll from '@/components/common/PlayAll'
import Singer from '@/assets/common/js/singer.js'
import searchApi from '@/api/search.js'
import SongList from '@/components/home/song/SongList'
import AlbumList from '@/components/common/album/AlbumList'
import SingerItem from '@/components/home/singer/SingerItem'
import SongSheetList from '@/components/home/songSheet/SongSheetList'
import Title from '@/components/common/Title'
import NoResult from '@/components/common/NoResult'
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'searchResultComprehensive',
  data () {
    return {
      result: null,
      loading: true,
      isNull: false
    }
  },
  computed: {
    ...mapState(['searchKeywords']),
    ...mapGetters(['currentSong'])
  },
  mounted () {
    this.getSearchAll()
  },
  methods: {
    ...mapMutations(['setSearchCurrentIndex', 'setIsAdvance', 'setSingerCurrentIndex', 'setRank']),
    // 查询综合结果
    async getSearchAll () {
      // 显示加载logo
      this.loading = true
      const { data: res } = await searchApi.getSearchResult(this.searchKeywords, searchType.all)
      if (res.code === ERR_OK) {
        // 未查询到结果
        if (Object.keys(res.result).length === 0) {
          this.isNull = true
          // 关闭加载logo
          this.loading = false
          return
        }
        // 存放所有搜索的结果
        let result = {}
        // 处理单曲结果
        result.song = this.handleSong(res.result.song)
        // 处理歌手结果
        result.singer = this.handleSinger(res.result.artist)
        // 处理专辑结果
        result.album = this.handleAlbum(res.result.album)
        // 处理歌单结果
        result.songSheet = this.handleSongSheet(res.result.playList)
        this.result = result
        // 关闭加载logo
        this.loading = false
      }
    },
    // 处理单曲结果
    handleSong (song) {
      // 用于存放处理后的歌曲列表
      let songList = []
      // 存放歌曲搜索结果信息
      let songObj = {
        more: song.more,
        moreText: song.moreText,
        songList
      }
      song.songs.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
        let singers = item.ar.map(item => item.name).join('/')
        let singersList = []
        // 处理歌手
        item.ar.forEach(item => {
          singersList.push(new Singer({
            id: item.id,
            name: item.name
          }))
        })
        songList.push(new Song({ id: item.id, name: item.name, picUrl: item.al.picUrl, st: item.privilege.st, singers, singersList }))
      })
      return songObj
    },
    // 处理歌手结果
    handleSinger (singer) {
      // 用于存放处理后的歌手列表
      let singerList = []
      // 存放歌手搜索结果信息
      let singerObj = {
        more: singer.more,
        moreText: singer.moreText,
        singerList
      }
      singer.artists.forEach(item => {
        singerList.push(new Singer({
          id: item.id,
          name: item.name,
          avatar: item.img1v1Url,
          aliaName: item.alias.join(' / '),
          picUrl: item.picUrl
        }))
      })
      return singerObj
    },
    // 处理专辑结果
    handleAlbum (album) {
      // 存放专辑搜索结果信息
      let albumObj = {
        more: album.more,
        moreText: album.moreText,
        albumList: album.albums
      }
      return albumObj
    },
    // 处理歌单结果
    handleSongSheet (playList) {
      // 存放歌单搜索结果信息
      let songSheetObj = {
        more: playList.more,
        moreText: playList.moreText,
        songSheetList: playList.playLists
      }
      return songSheetObj
    },
    // 播放全部歌曲
    handlePlayAll (item, list) {
      let result = this.$utils.compareSong(this.currentSong, item)
      if (!result) {
        // 引入vue原型上的utils
        this.$utils.playAllSong(list)
      }
    },
    // 选择歌曲播放
    async selectSong (item, index) {
      this.$emit('closeList')
      // 比较两首歌曲
      let result = this.$utils.compareSong(this.currentSong, item)
      if (!result) {
        // 引入vue原型上的utils
        this.$utils.playMusic(item)
      }
    },
    // 选择歌手
    selectSinger (item) {
      // 设置为前进页面
      this.setIsAdvance(true)
      this.setSingerCurrentIndex(0)
      this.$router.push(`/singerInfo/${item.id}`)
    },
    // 选择专辑
    selectAlbum (item) {
      // 设置为前进页面
      this.setIsAdvance(true)
      this.$router.push(`/singerAlbum/${item.id}`)
    },
    // 选择歌单
    selectSongSheet (item) {
      this.setRank(false)// 不需要排行
      this.$router.push(`/songSheetDisc/${item.id}`)
    },
    setCurrentIndex (index) {
      document.documentElement.scrollTop = 0
      this.setSearchCurrentIndex(index)
    }
  },

  components: {
    PlayAll,
    Title,
    SongList,
    SingerItem,
    AlbumList,
    SongSheetList,
    NoResult
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.search-comprehensive-container>>>.play-all-container {
  padding-left: 0;
  padding-right: 0.4rem;
  height: 1.1rem;
  line-height: 1.1rem;
}

.search-comprehensive-container {
  padding-top: 0.25rem;

  .search {
    .more {
      margin-bottom: 0.5rem;
      display: flex;
      text-align: center;
      justify-content: center;

      .text {
        height: 1.1rem;
        line-height: 1.1rem;
        color: #868e94;
        font-size: $font-size-smaller-x;
      }

      .icon {
        display: flex;
        align-items: center;
      }
    }

    .search-song {
      .header {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>