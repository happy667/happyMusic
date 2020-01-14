<template>
  <div class="search-result-container">
    <!-- 标签页 -->
    <van-tabs v-model="currentIndex"
              title-active-color="#FD4979"
              color="#FD4979"
              animated
              swipeable>
      <!-- 单曲页 -->
      <van-tab title="单曲">
        <songs-list></songs-list>
      </van-tab>
      <!-- 歌手页 -->
      <van-tab title="歌手">
        <singer-list></singer-list>
      </van-tab>
      <!-- 歌单页 -->
      <van-tab title="歌单">
        <song-sheet-small></song-sheet-small>
      </van-tab>
      <!-- mv页 -->
      <van-tab title="MV">
        <mv-list></mv-list>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import SongsList from '@/components/home/song/SongList'
import singerList from '@/components/home/singer/SingerList'
import SongSheetSmall from '@/components/home/songSheet/SongSheetSmall'
import MvList from '@/components/common/mv/MvList'
export default {
  data () {
    return {
      currentIndex: 0// 当前索引
    }
  },
  components: {
    SongsList,
    singerList,
    SongSheetSmall,
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
  height: 100%;

  .songs-list-containter {
    .songs-list-item-containter {
      margin-bottom: 0;
      box-shadow: none;
    }
  }

  .songsSheet-list {
    .songsSheet-list-item {
      box-shadow: 0 0 0.2rem rgba(0, 0, 0, 0.1) !important;
    }
  }
}
</style>