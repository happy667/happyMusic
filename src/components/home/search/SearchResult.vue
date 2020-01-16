<template>
  <div class="search-result-container">
    <!-- 标签页 -->
    <van-tabs v-model="currentIndex"
              @change="handleChange"
              title-active-color="#FD4979"
              color="#FD4979"
              animated
              swipeable>
      <!-- 单曲页 -->
      <van-tab title="单曲">
        <template v-if="searchResult&&searchResult.song">
          <song-list :songsList="searchResult.song.songList"></song-list>
        </template>
        <template v-else>
          <van-loading size="24px"
                       color="#FD4979"
                       class="load"
                       vertical>加载中...</van-loading>
        </template>
      </van-tab>
      <!-- 歌手页 -->
      <van-tab title="歌手">
        <template v-if="searchResult&&searchResult.singer">
          <ul class="singer-list">
            <li class="singer-list-item"
                v-for="item in searchResult.singer.singerList"
                :key="item.id">
              <singer-item :singer="item"></singer-item>
            </li>
          </ul>
        </template>
        <template v-else>
          <van-loading size="24px"
                       color="#FD4979"
                       class="load"
                       vertical>加载中...</van-loading>
        </template>
      </van-tab>
      <!-- 歌单页 -->
      <van-tab title="歌单">
        <template v-if="searchResult&&searchResult.songSheet">
          <div class="song-sheet-list">
            <song-sheet-list :list="searchResult.songSheet.songSheetList"></song-sheet-list>
          </div>
        </template>
        <template v-else>
          <van-loading size="24px"
                       color="#FD4979"
                       class="load"
                       vertical>加载中...</van-loading>
        </template>
      </van-tab>
      <!-- mv页 -->
      <van-tab title="MV">
        <template v-if="searchResult&&searchResult.mv">
          <div class="mv-list">
            <mv-list :list="searchResult.mv.mvList"></mv-list>
          </div>
        </template>
        <template v-else>
          <van-loading size="24px"
                       color="#FD4979"
                       class="load"
                       vertical>加载中...</van-loading>
        </template>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import SongList from '@/components/home/song/SongList'
import SingerItem from '@/components/home/singer/SingerItem'
import SongSheetList from '@/components/home/songSheet/SongSheetList'
import MvList from '@/components/common/mv/MvList'
import Singer from '@/assets/common/js/singer.js'
import searchApi from '@/api/search.js'
import { ERR_OK } from '@/api/config.js'
import { mapActions } from 'vuex'
export default {
  props: {
    keywords: String
  },
  data () {
    return {
      currentIndex: 0, // 当前索引
      searchResult: {}, // 搜索结果
      searchInfo: {// 搜索信息
        keywords: '', // 搜索默认关键词
        offset: 0, // 偏移量
        limit: 20, // 限制
        type: 1// 搜索类型
      }
    }
  },
  mounted () {
    if (!this.keywords) {
      this.$router.push('/search/searchPage')
    } else {
      this.searchInfo.keywords = this.keywords
      this.getSearchInfo()
    }
  },
  methods: {
    ...mapActions(['getVideoUrl', 'getSingerAvatar']),
    async getSearchInfo () {
      const { data: res } = await searchApi.getSearchResult(this.searchInfo)
      if (res.code === ERR_OK) {
        console.log(res)
        switch (this.searchInfo.type) {
          case 1:// 单曲
            this.$set(this.searchResult, 'song', { songCount: res.result.songCount, songList: res.result.songs })
            break
          case 100:// 歌手
            let singerList = []
            res.result.artists.forEach(item => {
              singerList.push(new Singer({
                id: item.id,
                name: item.name,
                avatar: item.img1v1Url,
                aliaName: item.alias.join(' / '),
                picUrl: item.picUrl
              }))
            })
            this.$set(this.searchResult, 'singer', { artistCount: res.result.artistCount, singerList: singerList })
            break
          case 1000:// 歌单
            this.$set(this.searchResult, 'songSheet', { playlistCount: res.result.playlistCount, songSheetList: res.result.playlists })
            break
          case 1004:// mv
            // 还需要获取头像和播放地址
            let videoList = res.result.mvs
            // 获取视频url
            videoList = await this.getVideoUrl(videoList)
            // 获取歌手头像
            videoList = await this.getSingerAvatar(videoList)
            this.$set(this.searchResult, 'mv', { mvCount: res.result.mvCount, mvList: videoList })
            break
        }
      }
    },
    handleChange () {
      let type = 1// 默认单曲
      switch (this.currentIndex) {
        case 0:// 单曲
          type = 1
          if (this.searchResult.song) return
          break
        case 1:// 歌手
          type = 100
          if (this.searchResult.singer) return
          break
        case 2:// 歌单
          type = 1000
          if (this.searchResult.songSheet) return
          break
        case 3:// mv
          type = 1004
          if (this.searchResult.mv) return
          break
      }
      this.searchInfo.type = type
      this.getSearchInfo()
    }
  },
  components: {
    SongList,
    SingerItem,
    SongSheetList,
    MvList
  }
}
</script>
<style lang="stylus">
.van-tabs {
  height: 100%;

  .van-tabs__content {
    height: 100%;
  }
}

.search-result-container {
  width: 100%;
  min-height: calc(100vh - (1.8rem + 1.22667rem));

  .songs-list-containter {
    .songs-list-item-containter {
      margin-bottom: 0;
      box-shadow: none;
    }
  }

  .songsSheet-list {
    padding: 0.25rem 0;

    .songsSheet-list-item {
      box-shadow: 0 0 0.2rem rgba(0, 0, 0, 0.1) !important;
    }
  }

  .mv-list {
    padding: 0.25rem;
  }

  .singer-list {
    width: 100%;

    .singer-list-item {
      padding: 0 0.2rem;
    }
  }
}
</style>