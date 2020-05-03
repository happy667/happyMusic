<template>
  <div class="search-comprehensive-container">
    <!-- loading -->
    <loading :loading="loading" />
    <template v-if="!loading&&result">
      <component v-for="(item,index) in order"
                 :is="item"
                 :key="index"
                 :song="result.song"
                 :singer="result.singer"
                 :album="result.album"
                 :simQuery="result.simQuery"
                 :songSheet="result.songSheet"
                 :video="result.video"
                 @setIndex="setCurrentIndex"
                 @closeList="$emit('closeList')"></component>
      <!-- 歌曲 -->
      <!-- <search-song :song="result.song"
                   @closeList="$emit('closeList')"
                   @setIndex="setCurrentIndex" /> -->
      <!-- 歌手 -->
      <!-- <search-singer :singer="result.singer"
                     @setIndex="setCurrentIndex" /> -->
      <!-- 相关搜索 -->
      <!-- <search-sim-query :simQuery="result.simQuery" /> -->

      <!-- 专辑 -->
      <!-- <search-album :album="result.album"
                    @setIndex="setCurrentIndex" /> -->
      <!-- 歌单 -->
      <!-- <search-song-sheet :songSheet="result.songSheet"
                         @setIndex="setCurrentIndex" /> -->
    </template>
    <template v-if="isNull">
      <no-result text="暂无搜索结果"
                 image="search"></no-result>
    </template>
  </div>
</template>
<script>
import {
  SEARCH_TYPE
  ,
  VIDEO_TYPE
} from '@/assets/common/js/config.js'
import { ERR_OK } from '@/api/config.js'
import Song from '@/assets/common/js/song.js'
import Album from '@/assets/common/js/album.js'
import Singer from '@/assets/common/js/singer.js'
import Video from '@/assets/common/js/video.js'

import NoResult from '@/components/common/NoResult'
import SearchSong from './comprehensive/SearchSong'
import SearchSinger from './comprehensive/SearchSinger'
import SearchSimQuery from './comprehensive/SearchSimQuery'
import SearchAlbum from './comprehensive/SearchAlbum'
import SearchSongSheet from './comprehensive/SearchSongSheet'
import SearchVideo from './comprehensive/SearchVideo'
import searchApi from '@/api/search.js'

import { mapState, mapMutations } from 'vuex'
export default {
  name: 'searchResultComprehensive',
  data () {
    return {
      result: null,
      loading: true,
      isNull: false,
      order: [],
      includeComponents: ['song', 'playList', 'album', 'artist', 'sim_query', 'video']
    }
  },
  computed: {
    ...mapState(['searchKeywords'])
  },
  mounted () {
    this.getSearchAll()
  },
  methods: {
    ...mapMutations(['setSearchCurrentIndex', 'setSingerCurrentIndex', 'setPlayerFullScreen', 'setSelectSearchWord']),
    // 查询综合结果
    async getSearchAll () {
      // 显示加载logo
      this.loading = true
      const { data: res } = await searchApi.getSearchResult(this.searchKeywords, SEARCH_TYPE.all)
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
        // 处理相关搜索结果
        result.simQuery = this.handleSimQuery(res.result.sim_query)
        // 处理视频结果
        result.video = this.handleVideo(res.result.video)
        // 处理排序结果
        console.log(res.result.order)
        this.order = this.handleOrder(res.result.order)
        console.log(this.order)
        this.result = result
        // 关闭加载logo
        this.loading = false
      }
    },
    // 处理单曲结果
    handleSong (song) {
      if (!song) return null
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
        songList.push(new Song({ id: item.id, name: item.name, picUrl: item.al.picUrl, st: item.privilege.st, singers, singersList, mv: item.mv }))
      })
      return songObj
    },
    // 处理歌手结果
    handleSinger (singer) {
      if (!singer) return null
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
          picUrl: item.picUrl,
          mvSize: item.mvSize,
          albumSize: item.albumSize,
          followed: item.followed
        }))
      })
      return singerObj
    },
    // 处理专辑结果
    handleAlbum (album) {
      if (!album) return null
      // 用于存放处理后的专辑列表
      let albumList = []
      // 存放专辑搜索结果信息
      let albumObj = {
        more: album.more,
        moreText: album.moreText,
        albumList
      }
      album.albums.forEach(item => {
        let album = new Album({
          id: item.id,
          name: item.name,
          picUrl: item.picUrl,
          singerName: item.artist.name,
          publishTime: item.publishTime
        })
        albumList.push(album)
      })

      return albumObj
    },
    // 处理歌单结果
    handleSongSheet (playList) {
      if (!playList) return null
      // 存放歌单搜索结果信息
      let songSheetObj = {
        more: playList.more,
        moreText: playList.moreText,
        songSheetList: playList.playLists
      }
      return songSheetObj
    },
    // 处理相关搜索结果
    handleSimQuery (simQuery) {
      console.log(simQuery)
      if (!simQuery) return null
      // 存放歌单搜索结果信息
      let queryList = simQuery.sim_querys.map(item => item.keyword)
      return queryList
    },
    // 处理视频结果
    handleVideo (video) {
      if (!video) return null
      // 用于存放处理后的视频列表
      let videoList = []
      // 存放歌单搜索结果信息
      let videoObj = {
        more: video.more,
        moreText: video.moreText,
        videoList
      }
      // 过滤一遍视频,只需要mv类型视频
      video.videos.filter(item => item.type === VIDEO_TYPE.mv).forEach(item => {
        let video = new Video({
          id: item.vid,
          coverUrl: item.coverUrl,
          name: item.title,
          playCount: item.playTime,
          type: item.type,
          duration: item.durationms,
          creatorName: item.creator.map(item => item.userName).join('/')
        })
        videoList.push(video)
      })

      return videoObj
    },
    // 处理排序结果
    handleOrder (order) {
      if (!order) return null
      let filterOrder = order.filter(item => this.includeComponents.includes(item))
      let songIndex = filterOrder.findIndex(item => item === 'song')
      let playListIndex = filterOrder.findIndex(item => item === 'playList')
      let albumIndex = filterOrder.findIndex(item => item === 'album')
      let artistIndex = filterOrder.findIndex(item => item === 'artist')
      let simQueryIndex = filterOrder.findIndex(item => item === 'sim_query')
      let videoIndex = filterOrder.findIndex(item => item === 'video')
      if (songIndex !== -1) {
        filterOrder[songIndex] = 'SearchSong'
      }
      if (playListIndex !== -1) {
        filterOrder[playListIndex] = 'SearchSongSheet'
      }
      if (albumIndex !== -1) {
        filterOrder[albumIndex] = 'SearchAlbum'
      }
      if (artistIndex !== -1) {
        filterOrder[artistIndex] = 'SearchSinger'
      }
      if (simQueryIndex !== -1) {
        filterOrder[simQueryIndex] = 'SearchSimQuery'
      }
      if (videoIndex !== -1) {
        filterOrder[videoIndex] = 'SearchVideo'
      }
      return filterOrder
    },

    setCurrentIndex (index) {
      document.documentElement.scrollTop = 0
      this.setSearchCurrentIndex(index)
    }

  },

  components: {
    SearchSinger,
    NoResult,
    SearchSong,
    SearchSimQuery,
    SearchAlbum,
    SearchSongSheet,
    SearchVideo
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.search-comprehensive-container>>>.album-container {
  padding: 0.25rem 0.4rem;
}

.search-comprehensive-container>>>.video-list-container {
  padding: 0 0.4rem;
}

.search-comprehensive-container>>>.title-container {
  padding: 0 0.4rem;
}

.search-comprehensive-container>>>.search-list-container .list {
  padding: 0.15rem 0.4rem;
}

.search-comprehensive-container>>>.search {
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
}

.search-comprehensive-container {
  padding-top: 0.25rem;
}
</style>