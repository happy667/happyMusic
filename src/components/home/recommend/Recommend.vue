<template>
  <scroll ref="recommend_scroll">
    <div class="recommend-container "
         ref="container">
      <!-- loading -->
      <!-- loading -->
      <loading :loading="load" />
      <template v-if="!load">

        <!-- 轮播图区域 -->
        <recommend-swiper :banners="banners"></recommend-swiper>

        <!-- 推荐新音乐 -->
        <song-swiper :recommendNewSong="recommendNewSong"
                     v-if="this.recommendNewSong.length > 0 "
                     @select="selectSong">
          <template>
            <Title title="新歌推送"></Title>
          </template>
        </song-swiper>
        <!--个性化区域-->
        <personalization v-if="this.recommendNewSong.length > 0 ">
          <template>
            <Title title="个性化定制"
                   styleInfo="margin-bottom:0.2rem"></Title>
          </template>
        </personalization>
        <!-- 推荐歌单区域 -->
        <song-sheet-list @select="selectSongSheet"
                         :list="recommendSongSheet"
                         v-if="this.recommendSongSheet.length > 0 ">
          <template>
            <Title path='/SongSheetSquare'
                   loadMore
                   styleInfo="margin-bottom:0.2rem"
                   title="推荐歌单"></Title>
          </template>
        </song-sheet-list>

        <!-- 新碟上线 -->
        <album-swiper :list="recommendNewAlbum"
                      v-if="this.recommendNewAlbum.length > 0 ">
          <template>
            <Title title="新碟上线"></Title>
          </template>
        </album-swiper>
        <!-- loading -->
        <loading :loading="loadMore"
                 height="3rem" />
      </template>

    </div>
  </scroll>
</template>
<script>
import Scroll from '@/components/common/Scroll'
import recommendSwiper from './RecommendSwiper'
import SongSheetList from '@/components/home/songSheet/SongSheetList'
import SongSwiper from '@/components/home/song/SongSwiper'
import AlbumSwiper from '@/components/common/miniSwiper/MiniSwiper'
import Title from '@/components/common/Title'
import Personalization from '@/components/home/personalization/Personalization'
import recommendApi from '@/api/recommend.js'
import Song from '@/assets/common/js/song.js'
import Album from '@/assets/common/js/album.js'
import Singer from '@/assets/common/js/singer.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  mapGetters,
  mapMutations
} from 'vuex'
export default {
  data () {
    return {
      banners: [], // 轮播图数据
      recommendSongSheet: [], // 推荐页歌单列表
      recommendNewSong: [], // 推荐新音乐
      recommendNewAlbum: [], // 新碟
      isLoading: false,
      loadMore: false
    }
  },
  computed: {
    ...mapGetters(['currentSong']),
    load () {
      console.dir(this)
      return this.banners.length === 0
    }
  },
  methods: {
    ...mapMutations(['setPlayerFullScreen', 'setRank']),
    // 获取轮播图数据
    async getBanner () {
      const {
        data: res
      } = await recommendApi.getBanner()
      if (res.code === ERR_OK) { // 成功获取轮播图数据
        this.banners = res.banners
      }
    },
    // 选择歌曲
    selectSong (item, index) {
      // 比较两首歌曲
      let result = this.$utils.compareSong(this.currentSong, item)
      if (!result) {
        // 引入vue原型上的utils
        this.$utils.playMusic(item, this.recommendNewSong, index)
      }
    },
    // 选择歌单
    selectSongSheet (item) {
      this.setRank(false) // 不需要排行
      this.$router.push(`/songSheetDisc/${item.id}`)
    },
    // 获取推荐歌单
    async getRecommendSongSheet (limit) {
      this.loadMore = true;
      const {
        data: res
      } = await recommendApi.getRecommendSongSheet(limit)
      if (res.code === ERR_OK) { // 成功获取推荐歌单
        this.recommendSongSheet = res.result
        this.$nextTick(() => {
          this.loadMore = false;
        })

      }
    },
    // 获取推荐新音乐
    async getRecommendNewSong () {
      this.loadMore = true;
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
            album: new Album({
              id: item.song.album.id,
              name: item.song.album.name,
              picUrl: item.song.album.picUrl
            }),
            mv: item.song.mvid,
            singersList

          }))
        })
        this.recommendNewSong = songList
        this.$nextTick(() => {
          this.loadMore = false;
        })
      }
    },
    // 获取推荐新碟
    async getRecommendNewAlbum () {
      this.loadMore = true;
      const {
        data: res
      } = await recommendApi.getRecommendNewAlbum()
      if (res.code === ERR_OK) { // 成功获取推荐新碟
        this.recommendNewAlbum = res.albums
        this.loadMore = false;
      }
    },
    // 刷新
    refresh () {
      this.$refs.recommend_scroll.refresh()
    }

  },
  async mounted () {
    // 获取轮播图数据
    await this.getBanner()
    // 获取最新音乐
    await this.getRecommendNewSong()
    // 获取推荐歌单
    await this.getRecommendSongSheet(6)
    // 获取新碟上线
    await this.getRecommendNewAlbum()


  },
  components: {
    recommendSwiper,
    SongSheetList,
    SongSwiper,
    AlbumSwiper,
    Title,
    Scroll,
    Personalization
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.recommend-container>>>.title-container {
  padding: 0 0.4rem;
}

.recommend-container>>>.song-sheet-list-item:nth-last-child(-n+2) {
  margin-bottom: 0.4rem;
}

.recommend-container {
  position: absolute;
  width: 100%;
}
</style>