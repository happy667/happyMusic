<template>
  <div class="my-like-container"
       @touchstart="handleTouchStart"
       @touchmove="handleTouchMove"
       @touchend="handleTouchEnd">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar :title="$route.meta.title"
                   ref="navBar"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>
    <song-list @noLike="handleNoLike"
               ref="songList"
               :list="songList"
               :loading="loading" />
    <!-- 定位 -->
    <position v-show="isShowPosition"
              @click="handlePosition"></position>
  </div>
</template>
<script>
import Position from '@/components/common/Position'
import SongList from '@/components/home/singer/singerInfo/SingerSong'
import Singer from '@/assets/common/js/singer.js'
import Song from '@/assets/common/js/song.js'
import songApi from '@/api/song.js'
import {
  ERR_OK
} from '@/api/config.js'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  name: 'myLike',
  data () {
    return {
      songList: null, // 歌曲列表
      loading: false,
      showPosition: false
    }
  },
  computed: {
    ...mapState(['user', 'userLikeList']),
    ...mapGetters(['currentSong']),
    // 是否显示定位
    isShowPosition () {
      if (!this.songList) return
      // 判断当前歌曲列表是否有正在播放的歌曲（-1表示没有)
      let index = this.utils.findIndex(this.songList, this.currentSong)
      return this.showPosition && index !== -1
    }
  },
  watch: {
    userLikeList () {
      if (this.user) {
        this.getSongDetail()
      }
    }
  },
  methods: {
    ...mapActions(['getUserLikeList']),
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    },
    handleNoLike (song) {
      // 移除歌曲
      this.utils.removeItem(this.songList, song)
    },
    // 获取歌曲详情
    async getSongDetail () {
      this.loading = true
      if (this.userLikeList.length === 0) {
        this.songList = []
        this.loading = false
        return
      }
      let ids = this.userLikeList.join(',')
      const {
        data: res
      } = await songApi.getSongDetail(ids)
      if (res.code === ERR_OK) {
        let songList = []
        res.songs.forEach((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
          let singers = item.ar.map(item => item.name).join('/')
          let singersList = []
          // 处理歌手
          item.ar.forEach(item => {
            singersList.push(new Singer({
              id: item.id,
              name: item.name
            }))
          })
          let song = new Song({ id: item.id, name: item.name, singers, singersList, picUrl: item.al.picUrl })
          songList.push(song)
        })
        this.songList = songList
        this.loading = false
      }
    },
    // 选择歌手
    selectItem (item) {
      this.$router.push(`/singerInfo/${item.id}`)
    },
    handlePosition () {
      // 说明有歌曲在播放
      if (this.currentSong) {
        let listNode = this.$refs.songList.$refs.songList.$refs.list
        let song = this.currentSong
        let otherHeight = this.$refs.navBar.offsetHeight
        let list = this.songList
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
  mounted () {
    if (this.user) {
      this.getUserLikeList(this.user.userId)
    }
  },
  components: {
    SongList,
    Position
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.my-like-container>>>.singer-song-container {
  height: calc(100vh - 1.22667rem);
}

.my-like-container>>>.singer-song-container {
  padding-top: 0.3rem;
}

.my-like-container {
  width: 100%;
  min-height: 100vh;
  background-color: $color-common-background;
}
</style>