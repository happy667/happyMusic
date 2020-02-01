<template>
  <div class="recommend-container ">
    <!-- loading -->
    <van-loading v-if="this.banners.length === 0 || this.recommendSongSheet.length === 0 || this.recommendNewSong.length===0 || this.recommendNewSongSheet.length===0"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <template v-if="this.banners.length !== 0 && this.recommendSongSheet.length !== 0 && this.recommendNewSong.length!==0 && this.recommendNewSongSheet.length!==0">
      <van-pull-refresh v-model="isLoading"
                        success-text="已显示最新内容"
                        pulling-text="获取最新内容"
                        @refresh="onRefresh">
        <!-- 轮播图区域 -->
        <recommend-swiper :banners="banners"></recommend-swiper>

        <!-- 推荐新音乐 -->
        <song-swiper :recommendNewSong="recommendNewSong"
                     @select="handleSelect">
          <template>
            <song-sheet-title title="新歌推送"></song-sheet-title>
          </template>
        </song-swiper>
        <!-- 推荐歌单区域 -->
        <song-sheet-list :list="recommendSongSheet">
          <template>
            <song-sheet-title :isShowLoadMore="true"
                              path='/SongSheetSquare'
                              title="推荐歌单"></song-sheet-title>
          </template>
        </song-sheet-list>

        <!-- 新碟上线 -->
        <song-sheet-swiper :recommendNewSongSheet="recommendNewSongSheet">
          <template>
            <song-sheet-title title="新碟上线"></song-sheet-title>
          </template>
        </song-sheet-swiper>
      </van-pull-refresh>
    </template>
  </div>
</template>
<script>
import recommendSwiper from './RecommendSwiper'
import SongSheetList from '@/components/home/songSheet/SongSheetList'
import SongSwiper from '@/components/home/song/SongSwiper'
import SongSheetSwiper from '@/components/home/songSheet/songSheetSwiper/SongSheetSwiper'
import SongSheetTitle from '@/components/common/Title'
import recommendApi from '@/api/recommend.js'
import 'common/js/utils.js'
import {
  ERR_OK
} from '@/api/config.js'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      banners: [], // 轮播图数据
      recommendSongSheet: [], // 推荐歌单列表
      isLoading: false
    }
  },
  computed: {
    ...mapState(['recommendNewSong', 'recommendNewSongSheet']),
    ...mapGetters(['currentSong'])
  },
  methods: {
    ...mapMutations(['setPlayerFullScreen']),
    ...mapActions(['getLoginUser', 'getRecommendSongSheet', 'getRecommendNewSong', 'getRecommendNewSongSheet']),
    // 获取轮播图数据
    async getBanner () {
      const { data: res } = await recommendApi.getBanner()
      if (res.code === ERR_OK) { // 成功获取轮播图数据
        this.banners = res.banners
      }
    },

    // 刷新获取最新表单内容和轮播图数据
    onRefresh () {
      setTimeout(async () => {
        this.isLoading = false
        this.$nextTick(() => {
          this.getBanner()
        })
        this.getRecommendSongSheet(6).then((res) => {
          this.recommendSongSheet = res
        })
        this.getRecommendNewSong()
        this.getRecommendNewSongSheet()
      }, 500)
    },
    handleSelect (item, index) {
      // 判断点击的是否是当前播放的歌曲
      if (this.currentSong.id === item.id) {
        this.setPlayerFullScreen(true)
        return
      }
      // 引入vue原型上的utils
      this.utils.playMusic(item, this.recommendNewSong, index)
    }
  },
  mounted () {
    // 获取登录状态
    // this.getLoginUser()
    // 获取轮播图数据
    this.getBanner()
    // 获取推荐歌单
    this.getRecommendSongSheet(6).then((res) => {
      this.recommendSongSheet = res
    })
    // 获取最新音乐
    this.getRecommendNewSong()
    // 获取新碟上线
    this.getRecommendNewSongSheet()
  },

  components: {
    recommendSwiper,
    SongSheetList,
    SongSheetTitle,
    SongSwiper,
    SongSheetSwiper
  }
}

</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.recommend-container {
  width: 100%;
}
</style>
