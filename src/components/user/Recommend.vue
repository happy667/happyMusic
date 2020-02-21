<template>
  <div class="play-ranking-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar :title="$route.meta.title"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>
    <van-tabs title-active-color="#FD4979"
              color="#FD4979"
              animated
              v-model="index"
              @change="handleChange"
              swipeable>
      <van-tab title="推荐歌曲">
        <song-list :list="recommendSongList"
                   :loading="songLoading" />
      </van-tab>
      <van-tab title="推荐歌单">
        <!-- loading -->
        <van-loading v-if="songSheetloading"
                     size="24px"
                     color="#FD4979"
                     vertical>加载中...</van-loading>
        <song-sheet-list :list="recommendSongSheet"></song-sheet-list>
      </van-tab>
    </van-tabs>

  </div>
</template>
<script>
import SongSheetList from '@/components/home/songSheet/SongSheetList'
import SongList from '@/components/home/singer/singerInfo/SingerSong'
import Singer from '@/assets/common/js/singer.js'
import Song from '@/assets/common/js/song.js'
import userApi from '@/api/user.js'
import {
  ERR_OK
} from '@/api/config.js'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'userRecommend',
  data () {
    return {
      recommendSongList: null, // 推荐歌曲
      recommendSongSheet: null, // 推荐歌单
      songLoading: false,
      songSheetloading: false
    }
  },
  computed: {
    ...mapState(['userRecommendIndex', 'user']),
    index: {
      get () {
        return this.userRecommendIndex
      },
      set (index) {
        this.setUserRecommendIndex(index)
      }
    }
  },
  watch: {
    user () {
      if (this.user) {
        this.handleChange(this.index)
      }
    }
  },
  methods: {
    ...mapMutations(['setUserRecommendIndex']),
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    },
    // 获取推荐歌曲
    async getRecommendSong () {
      this.songLoading = true
      const {
        data: res
      } = await userApi.getUserRecommendSong()
      if (res.code === ERR_OK) {
        let songList = []
        res.recommend.forEach((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
          let singers = item.artists.map(item => item.name).join('/')
          let singersList = []
          // 处理歌手
          item.artists.forEach(item => {
            singersList.push(new Singer({
              id: item.id,
              name: item.name
            }))
          })
          songList.push(new Song({ id: item.id, name: item.name, singers, singersList, picUrl: item.album.picUrl }))
        })
        this.recommendSongList = songList
        this.songLoading = false
      }
    },
    // 获取推荐歌单
    async getRecommendSongSheet () {
      this.songSheetloading = true
      const {
        data: res
      } = await userApi.getUserRecommendSongSheet()
      if (res.code === ERR_OK) { // 成功获取推荐歌单
        this.recommendSongSheet = res.recommend
        this.songSheetloading = false
      }
    },
    handleChange (index) {
      if (this.user) {
        if (index === 0) { // 推荐歌曲
          if (!this.recommendSongList) {
            this.getRecommendSong()
          }
        } else {
          if (!this.recommendSongSheet) {
            this.getRecommendSongSheet()
          }
        }
      }
    }
  },
  mounted () {
    if (this.user) {
      this.handleChange(this.index)
    }
  },
  components: {
    SongList,
    SongSheetList
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.play-ranking-container>>>.song-list-container, .play-ranking-container>>>.songs-sheet-list-container {
  padding-top: 0.3rem;
  min-height: calc(100vh - 1.22667rem - 1.22667rem);
}

.play-ranking-container {
  width: 100%;
  min-height: 100vh;
  background-color: $color-common-background;
}
</style>