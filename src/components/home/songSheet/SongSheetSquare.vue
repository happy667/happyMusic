<template>
  <div class="song-sheet-square-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar :title="$route.meta.title"
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
                @change="handleChange"
                title-active-color="#FD4979"
                color="#FD4979"
                animated
                sticky
                swipeable>
        <van-tab title="推荐">
          <div class="recommend-list">
            <swiper-list :list="swiperList"></swiper-list>
            <song-sheet-list :list="newRecommendSongSheet"></song-sheet-list>
          </div>
        </van-tab>
        <van-tab v-for="(item,index) in songSheetCagetory"
                 :key="item.id"
                 :title="item.playlistTag.name">

          <div class="song-sheet-cagetory-list">
            <van-loading v-if="!songSheetCagetoryList[index+1]"
                         size="24px"
                         color="#FD4979"
                         class="load"
                         vertical>加载中...</van-loading>
            <song-sheet-list v-else
                             :list="songSheetCagetoryList[index+1]"></song-sheet-list>
          </div>
        </van-tab>
      </van-tabs>
    </template>
  </div>
</template>
<script>
import SongSheetList from './SongSheetList'
import SwiperList from './SongSheetSquare/SongSheetSquareSwiper'
import recommendApi from '@/api/recommend.js'
import {
  ERR_OK
} from '@/api/config.js'
export default {
  data () {
    return {
      currentIndex: 0, // 当前索引
      recommendSongSheet: [], // 推荐歌单列表
      songSheetCagetory: [], // 歌单分类
      songSheetCagetoryList: {}// 歌单分类列表
    }
  },
  computed: {
    swiperList () {
      return this.recommendSongSheet.slice(0, 3)
    },
    newRecommendSongSheet () {
      return this.recommendSongSheet.slice(3)
    }
  },
  methods: {
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    },
    // 获取歌单分类
    async getSongSheetCatList () {
      const {
        data: res
      } = await recommendApi.getSongSheetCatList()
      if (res.code === ERR_OK) { // 成功获取歌单分类
        this.songSheetCagetory = res.tags
      }
    },
    // 根据参数获取歌单
    async getSongSheet (tag) {
      const {
        data: res
      } = await recommendApi.getSongSheet(tag)
      if (res.code === ERR_OK) { // 成功获取歌单数据
        return res
      }
    },
    // 获取推荐歌单
    async getRecommendSongSheet () {
      const {
        data: res
      } = await recommendApi.getRecommendSongSheet()
      if (res.code === ERR_OK) { // 成功获取推荐歌单
        this.recommendSongSheet = res.result
      }
    },
    handleChange (name, title) {
      if (!this.songSheetCagetoryList[name]) { // 说明还没有该分类的歌单
        this.getSongSheet(title).then(res => {
          this.$set(this.songSheetCagetoryList, name, res.playlists)
        })
      }
    }
  },
  components: {
    SwiperList,
    SongSheetList
  },
  mounted () {
    // 获取分类列表
    this.getSongSheetCatList()
    // 获取推荐列表
    this.getRecommendSongSheet()
  }

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.song-sheet-square-container>>>.song-sheet-cagetory-list {
  min-height: calc(100vh - (1.22667rem + 1.18rem + 0.5rem));
}

.song-sheet-square-container {
  width: 100%;
  min-height: 100vh;
  background: $color-common-background;

  .recommend-list>>>.songs-sheet-list-container {
    width: 100%;
    padding-top: 0.5rem;
    box-sizing: border-box;
  }

  .song-sheet-cagetory-list {
    padding-top: 0.5rem;
  }
}
</style>