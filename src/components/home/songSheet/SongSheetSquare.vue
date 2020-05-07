<template>
  <div class="song-sheet-square-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar :title="$route.meta.title"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>

    <!-- loading -->
    <loading :loading="loading" />
    <!-- 歌单分类 -->
    <template v-if="!loading">
      <section>
        <scroll ref="song_sheet_square_scroll">
          <div class="container"
               ref="container">
            <van-tabs v-model="currentIndex"
                      @change="handleChange"
                      title-active-color="#FD4979"
                      color="#FD4979"
                      animated
                      swipe-threshold="6"
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
                  <van-loading v-if="loading||!songSheetCagetoryList[index+1]"
                               size="24px"
                               color="#FD4979"
                               class="load"
                               vertical>加载中...</van-loading>
                  <song-sheet-list v-else
                                   :list="songSheetCagetoryList[index+1]"></song-sheet-list>
                </div>
              </van-tab>
            </van-tabs>
          </div>
        </scroll>
      </section>

    </template>
  </div>
</template>
<script>
import Scroll from '@/components/common/Scroll'
import SongSheetList from './SongSheetList'
import SwiperList from './SongSheetSquare/SongSheetSquareSwiper'
import recommendApi from '@/api/recommend.js'
import {
  ERR_OK
} from '@/api/config.js'
import { playlistMixin } from '@/assets/common/js/mixin.js'
export default {
  data () {
    return {
      currentIndex: 0, // 当前索引
      recommendSongSheet: [], // 推荐歌单列表
      songSheetCagetory: [], // 歌单分类
      songSheetCagetoryList: {}, // 歌单分类列表
      loading: true
    }
  },
  name: 'songSheetSquare',
  mixins: [playlistMixin],
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
      this.$utils.routerBack()
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
      this.loading = true
      const {
        data: res
      } = await recommendApi.getRecommendSongSheet()
      if (res.code === ERR_OK) { // 成功获取推荐歌单
        this.recommendSongSheet = res.result
        this.loading = false
        this.handlePlaylist(this.playList)
      }
    },
    handleChange (name, title) {
      if (!this.songSheetCagetoryList[name]) { // 说明还没有该分类的歌单
        this.getSongSheet(title).then(res => {
          this.$set(this.songSheetCagetoryList, name, res.playlists)
        })
      }
    },
    handlePlaylist (playList) {
      if (!this.loading) {
        // 适配播放器与页面底部距离
        const bottom = playList.length > 0 ? '1.6rem' : ''
        this.$nextTick(() => {
          this.$refs.container.style.paddingBottom = bottom
          this.refresh()
        })
      }
    },
    refresh () {
      this.$nextTick(() => {
        this.$refs.song_sheet_square_scroll.refresh()
      })
    }

  },
  components: {
    SwiperList,
    SongSheetList,
    Scroll
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

.song-sheet-square-container>>> .scroll {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.song-sheet-square-container>>>.container {
  position: absolute;
  width: 100%;
  min-height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.song-sheet-square-container>>>.van-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.song-sheet-square-container>>>.van-tabs__content {
  flex: 1;
}

.song-sheet-square-container {
  position: fixed;
  width: 100%;
  height: 100%;
  background: $color-common-background;
  display: flex;
  flex-direction: column;

  section {
    position: relative;
    flex: 1;

    .recommend-list>>>.songs-sheet-list-container {
      width: 100%;
      padding-top: 0.5rem;
      box-sizing: border-box;
    }

    .song-sheet-cagetory-list {
      padding-top: 0.5rem;
    }
  }
}
</style>