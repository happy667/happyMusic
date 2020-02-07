<template>
  <div class="recommend-container ">
    <!-- loading -->
    <van-loading v-if="this.banners.length === 0 || this.recommendSongSheet.length === 0 || this.recommendNewSong.length===0 || this.recommendNewSongSheet.length===0"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <template v-if="this.banners.length !== 0 && this.recommendSongSheet.length !== 0 && this.recommendNewSong.length!==0 && this.recommendNewSongSheet.length!==0">

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
import Song from '@/assets/common/js/song.js'
import Singer from '@/assets/common/js/singer.js'

import 'common/js/utils.js'
import {
  ERR_OK
} from '@/api/config.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      banners: [], // 轮播图数据
      recommendSongSheet: [], // 推荐页歌单列表
      recommendNewSong: [], // 推荐新音乐
      recommendNewSongSheet: [], // 新碟
      isLoading: false
    }
  },
  computed: {
    ...mapGetters(['currentSong'])
  },
  methods: {
    ...mapMutations(['setPlayerFullScreen']),
    // 获取轮播图数据
    async getBanner () {
      const { data: res } = await recommendApi.getBanner()
      if (res.code === ERR_OK) { // 成功获取轮播图数据
        this.banners = res.banners
      }
    },

    handleSelect (item, index) {
      // 判断点击的是否是当前播放的歌曲
      if (this.currentSong.id === item.id) {
        this.setPlayerFullScreen(true)
        return
      }
      // 引入vue原型上的utils
      this.utils.playMusic(item, this.recommendNewSong, index)
    },
    // 获取推荐歌单
    async getRecommendSongSheet (limit) {
      const {
        data: res
      } = await recommendApi.getRecommendSongSheet(limit)
      if (res.code === ERR_OK) { // 成功获取推荐歌单
        this.recommendSongSheet = res.result
      }
    },
    // 获取推荐新音乐
    async getRecommendNewSong () {
      const {
        data: res
      } = await recommendApi.getRecommendNewSong()
      if (res.code === ERR_OK) { // 成功获取推荐新音乐
        let songList = []

        res.result.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
          let singers = item.song.artists.map(item => item.name).join('/')
          let singersList = []
          // 处理歌手
          item.song.artists.forEach(item => {
            singersList.push(new Singer({
              id: item.id,
              name: item.name,
              avatar: item.img1v1Url,
              picUrl: item.picUrl
            }))
          })
          songList.push(new Song({
            id: item.id,
            name: item.name,
            singers,
            picUrl: item.picUrl,
            singersList
          }))
        })
        this.recommendNewSong = songList
      }
    },
    // 获取推荐新碟
    async getRecommendNewSongSheet (context, params) {
      const {
        data: res
      } = await recommendApi.getRecommendNewSongSheet(params)
      if (res.code === ERR_OK) { // 成功获取推荐新碟
        this.recommendNewSongSheet = res.albums
      }
    }

  },
  mounted () {
    // 获取轮播图数据
    this.getBanner()
    // 获取推荐歌单
    this.getRecommendSongSheet(6)
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
