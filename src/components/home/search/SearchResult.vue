<template>
  <div class="search-result-container" ref="container">
    <!-- 标签页 -->
    <van-tabs v-model="currentIndex" title-active-color="#FD4979" color="#FD4979" animated swipeable
      swipe-threshold="6">
      <!-- 综合页 -->
      <van-tab title="综合">
        <comprehensive @closeList="closeSearchList"></comprehensive>
      </van-tab>
      <!-- 单曲页 -->
      <van-tab title="单曲">
        <song @closeList="closeSearchList" />
      </van-tab>
      <!-- 歌手页 -->
      <van-tab title="歌手">
        <singer />
      </van-tab>
      <!-- 专辑 -->
      <van-tab title="专辑">
        <album />
      </van-tab>
      <!-- 歌单页 -->
      <van-tab title="歌单">
        <songSheet />
      </van-tab>
      <!-- 视频页 -->
      <van-tab title="视频">
        <Video />
      </van-tab>

    </van-tabs>
  </div>
</template>
<script>
  import Singer from './searchResult/Singer'
  import Comprehensive from './searchResult/Comprehensive'
  import Song from './searchResult/Song'
  import SongSheet from './searchResult/SongSheet'
  import Video from './searchResult/Video'
  import Album from './searchResult/Album'
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import {
    playlistMixin
  } from '@/assets/common/js/mixin.js'
  export default {
    name: 'searchResult',
    mixins: [playlistMixin],
    computed: {
      ...mapState(['searchKeywords', 'searchCurrentIndex', 'showSearchList']),
      currentIndex: {
        get() {
          return this.searchCurrentIndex
        },
        set(index) {
          this.setSearchCurrentIndex(index)
        }
      }
    },
    methods: {
      ...mapMutations(['setSearchCurrentIndex', 'setShowSearchList']),
      // 关闭搜索列表
      closeSearchList() {
        if (this.showSearchList) {
          this.setShowSearchList(false)
        }
      },
      handlePlaylist(playList) {
        // 适配播放器与页面底部距离
        const bottom = playList.length > 0 ? '1.5rem' : ''
        this.$nextTick(() => {
          this.$refs.container.style.paddingBottom = bottom
        })
      }
    },
    components: {
      Comprehensive,
      Song,
      Singer,
      SongSheet,
      Album,
      Video
    }
  }
</script>
<style lang="stylus" scoped>
  .search-result-container>>>.van-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .search-result-container>>>.van-tabs__content {
    flex: 1;
  }

  .search-result-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
</style>