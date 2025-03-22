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
                 :songSheet="result.songSheet"
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
  SEARCH_TYPE,
  VIDEO_TYPE
} from '@/assets/common/js/config.js'
import {
  ERR_OK
} from '@/api/config.js'
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
import singerApi from '@/api/singer.js'

import {
  mapState,
  mapMutations
} from 'vuex'
export default {
  name: 'searchResultComprehensive',
  data () {
    return {
      result: null,
      loading: true,
      isNull: false,
      order: [],
      includeComponents: ['songs', 'playlists', 'albums', 'artists']
    }
  },
  computed: {
    ...mapState(['searchKeywords'])
  },
  mounted () {
    this.getSearchComprehensive();
    this.loading = true
  },
  methods: {
    ...mapMutations(['setSearchCurrentIndex', 'setSingerCurrentIndex', 'setPlayerFullScreen', 'setSelectSearchWord']),
    // 查询综合结果
    async getSearchComprehensive () {
      // 显示加载logo
      this.loading = true
      const {
        data: res
      } = await searchApi.getSearchComprehensive(this.searchKeywords)
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
        result.song = await this.handleSong(res.result.songs)
        // 处理歌手结果
        result.singer = this.handleSinger(res.result.artists)
        // 处理专辑结果
        result.album = this.handleAlbum(res.result.albums)
        // 处理歌单结果
        result.songSheet = this.handleSongSheet(res.result.playlists)

        // 处理视频结果
        //result.video = this.handleVideo(res.result.video)
        // 处理排序结果
        console.log(res.result.order)
        this.order = this.handleOrder(res.result.order)
        console.log(this.order)
        this.result = result
        console.log(this.result)
        // 关闭加载logo
        this.loading = false

      }
    },
    // 处理单曲结果
    async handleSong (song) {
      if (!song) return { more: false, moreText: '', songList: [] }; // 返回一个默认对象

      // 用于存放处理后的歌曲列表
      const songList = [];

      // 并行处理每首歌曲
      const songPromises = song.map(async (item) => {
        // 处理歌手信息
        const singers = item.artists.map((artist) => artist.name).join('/');
        const singersList = item.artists.map(
          (artist) =>
            new Singer({
              id: artist.id,
              name: artist.name
            })
        );

        return new Song({
          id: item.id,
          name: item.name,
          picUrl: item.album.picUrl,
          singers,
          singersList,
          mv: item.album.mvid,
          album: new Album({
            id: item.album.id,
            name: item.album.name,
            picUrl: item.album.picUrl,
          }),
          isOriginal: !item.originSongSimpleData && (item.originCoverType === 0 || item.originCoverType === 1) ? 1 : 0,
        });
      });

      // 等待所有歌曲处理完成
      const results = await Promise.all(songPromises);

      // 过滤掉 null 值（请求失败的歌曲）
      results.forEach((song) => {
        if (song) {
          songList.push(song);
        }
      });

      // 返回处理后的歌曲对象
      return {
        more: song.more,
        moreText: song.moreText,
        songList,
      };
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
      singer.forEach(item => {
        singerList.push(new Singer({
          id: item.id,
          name: item.name,
          avatar: item.img1v1Url,
          aliaName: item.alias.join(' / '),
          picUrl: item.picUrl,
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
      album.forEach(async item => {
        let album = new Album({
          id: item.id,
          name: item.name,
          picUrl: item.picUrl,
          singerName: item.artist.name,
          publishTime: item.publishTime
        })
        albumList.push(album) //先加入到数组中，先渲染，在获取图片
        if (!album.picUrl) { //没有图片就根据专辑id查询专辑详情获取图片（接口未返回）
          const {
            data: res
          } = await singerApi.getAlbumInfo(album.id)
          if (res.code === ERR_OK) {
            album.picUrl = res.album.picUrl
          }
        }
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
        songSheetList: playList
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
      let includeComponents = this.includeComponents
      // 过滤包含的组件
      let filterOrder = order.filter(item => includeComponents.includes(item))
      // 获取索引
      let songIndex = filterOrder.findIndex(item => item === includeComponents[0])
      let playListIndex = filterOrder.findIndex(item => item === includeComponents[1])
      let albumIndex = filterOrder.findIndex(item => item === includeComponents[2])
      let artistIndex = filterOrder.findIndex(item => item === includeComponents[3])
      let simQueryIndex = filterOrder.findIndex(item => item === 'sim_query')
      let videoIndex = filterOrder.findIndex(item => item === 'video')
      // 根据索引重命名（因为后台数据与组件定义名称不一致）
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