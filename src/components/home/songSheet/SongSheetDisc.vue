<template>
  <div class="song-sheet-desc-container"
       @touchstart="handleTouchStart"
       @touchmove="handleTouchMove"
       @touchend="handleTouchEnd">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar title="歌单列表"
                   ref="navBar"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>

    <!-- 歌单图片 -->
    <div class="songs-img">
      <template v-if="songSheetDisc.picUrl">
        <img :src="songSheetDisc.picUrl">
      </template>
      <!-- 收藏 -->
      <div class="follow"
           v-show="songSheetDisc.picUrl">
        <follow @clickFollow="handleClickFollow"
                :followed="followed"></follow>
      </div>
    </div>
    <!-- loading -->
    <van-loading v-show="!songSheetDisc.songs"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <!-- 歌单描述 -->
    <section v-if="songSheetDisc.songs">
      <div class="songs-desc">
        <div class="songs-title">{{songSheetDisc.name}}</div>
        <div class="songs-nt">
          <div class="songs-num">{{songSheetDisc.songs.length}}首</div>
          <div class="songs-time"
               v-if="songSheetDisc.songs.length!==0">{{songSheetDisc.trackUpdateTime|convertDate}}</div>
        </div>

        <!-- 播放按钮 -->
        <div class="playBtn"
             @click="playAll(songSheetDisc.songs[0],0)">
          <i class="iconfont icon-bofang"></i>
        </div>
      </div>
      <!-- 歌曲列表 -->
      <songs-list :songsList="songSheetDisc.songs"
                  ref="songList"
                  :showImage="true"
                  @select="handleSelect"></songs-list>
      <no-result v-if="songSheetDisc.songs.length===0"
                 text="暂无相关资源"></no-result>
    </section>
    <!-- 定位 -->
    <position v-show="isShowPosition"
              @click="handlePosition"></position>
  </div>
</template>
<script>
import 'common/js/convert.js'
import recommendApi from '@/api/recommend.js'
import userApi from '@/api/user.js'
import {
  ERR_OK
} from '@/api/config.js'
import Song from '@/assets/common/js/song.js'
import Singer from '@/assets/common/js/singer.js'
import SongsList from '@/components/home/song/SongList'
import SongSheetDetail from '@/assets/common/js/songSheetDetail.js'
import NoResult from '@/components/common/NoResult'
import Follow from '@/components/common/Follow'
import Position from '@/components/common/Position'
import { mapMutations, mapGetters, mapActions, mapState } from 'vuex'
export default {
  props: {
    id: String
  },
  data () {
    return {
      songSheetDisc: {},
      followed: false,
      showPosition: false
    }
  },
  mounted () {
    this.getSongSheetById(this.id)
    // 获取用户收藏的歌单
    if (this.user) {
      this.getUserSongSheet(this.user.userId)
    }
  },
  watch: {
    user () {
      if (this.user) {
        this.getUserSongSheet(this.user.userId)
      }
    }
  },
  destroyed () {
    if (this.rank) {
      this.setRank(false)
    }
  },
  computed: {
    ...mapState(['user', 'rank']),
    ...mapGetters(['currentSong']),
    // 是否显示定位
    isShowPosition () {
      if (!this.songSheetDisc.songs) return
      // 判断当前歌曲列表是否有正在播放的歌曲（-1表示没有)
      let index = this.utils.findIndex(this.songSheetDisc.songs, this.currentSong)
      return this.showPosition && index !== -1
    }
  },
  methods: {
    ...mapMutations(['setPlayerFullScreen', 'setRank']),
    ...mapActions(['setSelectPlay']),
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    },
    // 根据id获取歌单列表
    async getSongSheetById (id) {
      const {
        data: res
      } = await recommendApi.getSongSheetById(id)
      if (res.code === ERR_OK) {
        let songList = []
        res.playlist.tracks.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
          let singerName = item.ar.map(item => item.name).join('/')
          let singersList = []
          // 处理歌手
          item.ar.forEach(item => {
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
            singers: singerName,
            singersList,
            picUrl: item.al.picUrl
          }))
        })
        this.songSheetDisc = new SongSheetDetail({
          id: res.playlist.id,
          picUrl: res.playlist.coverImgUrl || res.playlist.backgroundCoverUrl,
          songs: songList,
          name: res.playlist.name,
          trackUpdateTime: res.playlist.trackUpdateTime
        })
      }
    },
    // 选择歌曲
    handleSelect (item, index) {
      // 判断点击的是否是当前播放的歌曲
      if (this.currentSong.id === item.id) {
        this.setPlayerFullScreen(true)
        return
      }
      // 引入vue原型上的utils
      this.utils.playMusic(item, this.songSheetDisc.songs, index)
    },
    // 获取用户收藏的歌单
    async  getUserSongSheet (id) {
      const {
        data: res
      } = await userApi.getUserSongSheet(id)
      if (res.code === ERR_OK) {
        let list = res.playlist
        let id = parseInt(this.id)// 转换成字符串类型
        let item = list.find(item => item.id === id)
        this.followed = !!item
      }
    },
    // 播放所有
    playAll (item, index) {
      // 判断点击的是否是当前播放的歌曲
      if (this.currentSong.id === item.id) {
        this.setPlayerFullScreen(true)
        return
      }
      // 引入vue原型上的utils
      this.utils.playMusic(item, this.songSheetDisc.songs, index)
    },
    // 收藏歌单
    handleClickFollow () {
      if (this.user) { // 说明已经登录
        this.follow()
      } else {
        this.utils.alertLogin(this.$router.currentRoute.fullPath)
      }
    },

    follow () {
      let follow = !this.followed
      follow = follow ? 1 : 0// 1代表收藏，0代表不收藏
      if (follow) { // 收藏
        userApi.updateFollowSongSheet(this.id, follow).then(res => {
          if (res.data.code === ERR_OK) {
            this.followed = true
          }
        }).catch(err => {
          this.$toast(err.data.message)
        })
      } else {
        this.utils.alertConfirm({ message: '确定不再收藏该歌单', confirmButtonText: '不再收藏' }).then(async () => {
          userApi.updateFollowSongSheet(this.id, follow).then(res => {
            if (res.data.code === ERR_OK) {
              this.followed = false
              this.$toast('已不再收藏')
            }
          }).catch(err => {
            this.$toast(err.data.message)
          })
        }).catch(() => { })
      }
    },
    handlePosition () {
      // 说明有歌曲在播放
      if (this.currentSong) {
        let listNode = this.$refs.songList.$refs.list
        let song = this.currentSong
        let otherHeight = this.$refs.navBar.offsetHeight
        let list = this.songSheetDisc.songs
        this.utils.positionSong({ listNode, list, song, otherHeight })
        this.$toast('已定位到当前歌曲')
      }
    },
    handleTouchStart () {
      clearTimeout(this.timer)
    },
    handleTouchMove () {
      this.showPosition = true
    },
    handleTouchEnd () {
      this.timer = setTimeout(() => {
        this.showPosition = false
      }, 5000)
    }
  },
  components: {
    SongsList,
    NoResult,
    Follow,
    Position
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.song-sheet-desc-container>>>.van-loading {
  /* 减去标题栏、图片高度 */
  height: calc(100vh - (100vw + 1.22667rem));
  background: $color-common-background;
}

.song-sheet-desc-container {
  background: $color-common-background;
  min-height: 100vh;

  .songs-img {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
    background: #e4e4e4;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .follow {
      position: absolute;
      bottom: 0.5rem;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  section {
    .songs-desc {
      padding: 0.4rem;
      position: relative;

      .songs-title {
        max-width: 7rem;
        line-height: 0.8rem;
        font-weight: 500;
        font-size: $font-size-small;
        margin-bottom: 0.4rem;
        no-wrap2();
      }

      .songs-nt {
        display: flex;
        justify-content: space-between;
        color: $color-common-b;

        .songs-num {
          font-size: $font-size-smaller;
        }

        .songs-time {
          font-size: $font-size-smaller-x;
        }
      }

      .playBtn {
        position: absolute;
        right: 0.6rem;
        top: 0;
        margin-top: -0.8rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: red;
        background: linear-gradient(to bottom right, #f48faa, #f57f9e);
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        box-shadow: 0 0.01rem 0.3rem #f48faa;

        i {
          color: #fff;
          font-size: 0.8rem;
        }
      }
    }
  }
}
</style>