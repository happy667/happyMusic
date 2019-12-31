<template>
  <div class="recommend-container ">
    <van-pull-refresh v-model="isLoading"
                      success-text="已显示最新内容"
                      pulling-text="获取最新内容"
                      @refresh="onRefresh">
      <!-- 轮播图区域 -->
      <recommend-swiper :banners="banners"></recommend-swiper>
      <!-- loading -->
      <van-loading v-show="this.banners.length === 0 || this.recommendSongSheet.length === 0 || this.recommendNewSong.length===0 || this.recommendNewSongSheet.length===0"
                   size="24px"
                   color="#FD4979"
                   vertical>加载中...</van-loading>
      <!-- 推荐新音乐 -->
      <!-- 歌曲轮播 -->
      <song-swiper v-show="recommendNewSong.length!==0"
                   :recommendNewSong="recommendNewSong">
        <template>
          <song-sheet-title title="新歌推送"></song-sheet-title>
        </template>
      </song-swiper>
      <!-- 推荐歌单区域 -->
      <song-sheet-list title="推荐歌单"
                       :recommendList="recommendSongSheet"></song-sheet-list>

      <!-- 新碟上线 -->
      <song-sheet-swiper v-show="recommendNewSongSheet.length!==0"
                         :recommendNewSongSheet="recommendNewSongSheet">
        <template>
          <song-sheet-title title="新碟上线"></song-sheet-title>
        </template>
      </song-sheet-swiper>
    </van-pull-refresh>
  </div>
</template>
<script>
import recommendSwiper from './RecommendSwiper'
import SongSheetList from '@/components/home/songSheet/SongSheetList'
import SongSwiper from '@/components/home/song/SongSwiper'
import SongSheetSwiper from '@/components/home/songSheet/songSheetSwiper/SongSheetSwiper'
import SongSheetTitle from '@/components/common/Title'
import recommendApi from '@/api/recommend.js'

import {
  ERR_OK
} from '@/api/config.js'
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  data () {
    return {
      banners: [], // 轮播图数据
      isLoading: false
    }
  },
  computed: {
    ...mapState(['recommendSongSheet', 'recommendNewSong', 'recommendNewSongSheet'])
  },
  methods: {
    ...mapActions(['getSongSheet', 'getRecommendSongSheet', 'getRecommendNewSong', 'getRecommendNewSongSheet']),
    ...mapMutations(['clearSongSheet']),
    // 获取轮播图数据
    async getBanner () {
      const { data: res } = await recommendApi.getBanner()
      if (res.code === ERR_OK) { // 成功获取轮播图数据
        this.banners = res.banners
      }
    },
    // 获取多个歌单内容
    getSongSheets () {

      // 每次获取最新数据先清空原先数据，防止歌单列表一直push,vue的key值重复
      // this.$nextTick(() => {
      //   this.clearSongSheet()
      // })
      // this.$nextTick(() => {
      //   this.getSongSheet({ tag: '流行', limit: 6 })
      // })
      // this.$nextTick(() => {
      //   this.getSongSheet({ tag: '华语', limit: 6 })
      // })
      // this.$nextTick(() => {
      //   this.getSongSheet({ tag: '欧美', limit: 6 })
      // })
      // this.$nextTick(() => {
      //   this.getSongSheet({ tag: '摇滚', limit: 6 })
      // })
      // this.$nextTick(() => {
      //   this.getSongSheet({ tag: '古风', limit: 6 })
      // })
      // this.$nextTick(() => {
      //   this.getSongSheet({ tag: '轻音乐', limit: 6 })
      // })
      // this.$nextTick(() => {
      //   this.getSongSheet({ tag: 'ACG', limit: 6 })
      // })
    },
    // 刷新获取最新表单内容和轮播图数据
    onRefresh () {
      setTimeout(() => {
        this.isLoading = false
        this.$nextTick(() => {
          this.getBanner()
        })
        this.getRecommendSongSheet()
        this.getRecommendNewSong()
        this.getRecommendNewSongSheet()
      }, 500)
    }
  },
  mounted () {
    // 获取轮播图数据
    this.getBanner()
    // 获取推荐歌单
    this.getRecommendSongSheet()
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
