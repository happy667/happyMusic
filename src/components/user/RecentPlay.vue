<template>
  <div class="recent-play-container"
       ref="container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar :title="$route.meta.title"
                   ref="navBar"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>

    <!-- 标签页 -->
    <van-tabs title-active-color="#FD4979"
              color="#FD4979"
              animated
              swipeable
              swipe-threshold="6">
      <!-- 单曲页 -->
      <van-tab :title="songTitle">
        <song @songCount="handleSongCount" />
      </van-tab>
      <!-- 专辑 -->
      <van-tab :title="albumTitle">
        <album @albumCount="handleAlbumCount" />
      </van-tab>
      <!-- 歌单页 -->
      <van-tab :title="songSheetTitle">
        <songSheet @songSheetCount="handleSongSheetCount"  />
      </van-tab>
      <!-- 视频页 -->
      <van-tab :title="videoTitle">
        <Video @videoCount="handleVideoCount"/>
      </van-tab>

    </van-tabs>
  </div>
</template>
<script>
import Song from './recentPlay/Song'
import SongSheet from './recentPlay/SongSheet'
import Video from './recentPlay/Video'
import Album from './recentPlay/Album'
import {
  playlistMixin
} from '@/assets/common/js/mixin.js'
export default {
  name: 'recentPlay',
  mixins: [playlistMixin],
  data () {
    return {
      songList: [],
      songTitle: '单曲',
      albumTitle: '专辑',
      songSheetTitle: '歌单',
      videoTitle: '视频',
    }
  },
  methods: {
    handlePlaylist (playList) {
      // 适配播放器与页面底部距离
      const bottom = playList.length > 0 ? '1.5rem' : ''
      console.log(bottom)
      this.$nextTick(() => {
        this.$refs.container.style.paddingBottom = bottom
      })
    },
    // 返回上一个路由
    routerBack () {
      this.$utils.routerBack()
    },
    handleSongCount (Count) {
      this.songTitle = `单曲 ${Count}`
    },
    handleAlbumCount (Count) {
      this.albumTitle = `专辑 ${Count}`
    },
    handleSongSheetCount (Count) {
      this.songSheetTitle = `歌单 ${Count}`
    },
    handleVideoCount (Count) {
      this.videoTitle = `视频 ${Count}`
    }

  },
  components: {
    Song,
    SongSheet,
    Album,
    Video
  }
}
</script>
<style lang="stylus" scoped>
.recent-play-container>>>.van-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.recent-play-container>>>.van-tabs__content {
  flex: 1;
}

.recent-play-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>