<template>
  <div class="recommend-container">
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
        <scroll ref="songList_scroll">
          <song-list ref="songList_container"
                     :list="recommendSongList"
                     :loading="songLoading" />
        </scroll>

      </van-tab>
      <van-tab title="推荐歌单">
        <scroll ref="songSheet_scroll">
          <div class="container"
               ref="songSheet_container">
            <!-- loading -->
            <loading :loading="songSheetloading" />
            <song-sheet-list :list="recommendSongSheet"></song-sheet-list>
          </div>
        </scroll>
      </van-tab>
    </van-tabs>

  </div>
</template>
<script>
import Scroll from '@/components/common/Scroll'
import SongSheetList from '@/components/home/songSheet/SongSheetList'
import SongList from '@/components/home/singer/singerInfo/SingerSong'
import Singer from '@/assets/common/js/singer.js'
import Song from '@/assets/common/js/song.js'
import userApi from '@/api/user.js'
import {
  ERR_OK
} from '@/api/config.js'
import { mapState, mapMutations } from 'vuex'
import { playlistMixin } from '@/assets/common/js/mixin.js'
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
  mixins: [playlistMixin],
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
      this.$utils.routerBack()
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
      this.handlePlaylist(this.playList)
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
    },
    handlePlaylist (playList) {
      // 适配播放器与页面底部距离
      const bottom = playList.length > 0 ? '1.6rem' : ''
      this.$nextTick(() => {
        console.log(this.index)
        switch (this.index) {
          case 0:
            this.$refs.songList_container.$el.style.paddingBottom = bottom
            this.$refs.songList_scroll.refresh()
            break
          case 1:
            this.$refs.songSheet_container.style.paddingBottom = bottom
            this.$refs.songSheet_scroll.refresh()
            break
        }
      })
    }
  },
  mounted () {
    if (this.user) {
      this.handleChange(this.index)
    }
  },
  components: {
    SongList,
    SongSheetList,
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.recommend-container >>> .scroll {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.recommend-container>>>.song-list-container, .recommend-container>>>.songs-sheet-list-container {
  padding-top: 0.3rem;
}

.recommend-container>>>.van-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.recommend-container>>>.van-tabs__content {
  position: relative;
  flex: 1;
}

.recommend-container>>>.van-tabs__content .van-tabs__track, .recommend-container>>>.van-tabs__content .van-tab__pane {
  position: absolute;
  top: 0;
  bottom: 0;
}

.recommend-container {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $color-common-background;
}
</style>