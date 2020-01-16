<template>
  <div class="song-sheet-square-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar title="歌单广场"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>
    <van-loading v-if="this.songSheetCagetory.length===0&&this.recommendSongSheet.length===0"
                 size="24px"
                 color="#FD4979"
                 class="load"
                 vertical>加载中...</van-loading>
    <!-- 歌单分类 -->
    <template v-if="this.songSheetCagetory.length!==0&&this.recommendSongSheet.length!==0">
      <van-tabs v-model="currentIndex"
                title-active-color="#FD4979"
                color="#FD4979"
                animated
                sticky
                swipeable>
        <van-tab title="推荐">
          <div class="recommend-list">
            <swiper-list :list="swiperList"></swiper-list>
            <song-sheet-list :list="songSheetList"></song-sheet-list>
          </div>
        </van-tab>
        <van-tab v-for="item in songSheetCagetory"
                 :key="item.id"
                 :title="item.playlistTag.name">
          <div class="song-sheet-cagetory-list">
            <song-sheet-list :list="songSheetList"
                             :title="item.playlistTag.name"></song-sheet-list>
          </div>
        </van-tab>
      </van-tabs>
    </template>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import SongSheetList from './SongSheetList'
import SwiperList from './SongSheetSquare/SongSheetSquareSwiper'
export default {
  data () {
    return {
      currentIndex: 0, // 当前索引
      recommendSongSheet: []// 推荐歌单列表
    }
  },
  computed: {
    ...mapState(['songSheetCagetory']),
    swiperList () {
      return this.recommendSongSheet.slice(0, 3)
    },
    songSheetList () {
      return this.recommendSongSheet.slice(3)
    }
  },
  methods: {
    ...mapActions(['getSongSheetCatList', 'getRecommendSongSheet']),

    // 返回上一个路由
    routerBack () {
      this.$router.back()
    }
  },
  components: {
    SwiperList,
    SongSheetList
  },
  mounted () {
    this.$nextTick(() => {
      // 获取分类列表
      this.getSongSheetCatList()
      // 获取推荐列表
      this.getRecommendSongSheet().then((res) => {
        this.recommendSongSheet = res
      })
    })
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.song-sheet-square-container>>>.load {
  height: calc(100vh - 1.22667rem);
}

.song-sheet-square-container>>>.song-sheet-cagetory-list {
  min-height: calc(100vh - 1.22667rem);
}

.song-sheet-square-container {
  width: 100%;
  height: 100%;
  background: #fff;

  .recommend-list>>>.songs-sheet-list-container {
    width: 100%;
    padding: 0.5rem 0;
    box-sizing: border-box;
  }

  .song-sheet-cagetory-list {
    padding: 0.5rem 0;
  }
}
</style>