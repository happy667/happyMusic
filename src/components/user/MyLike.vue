<template>
  <div class="my-like-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar title="我的最爱"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>
    <song-list :list="songList"
               :loading="loading" />
  </div>
</template>
<script>
import SongList from '@/components/home/singer/singerInfo/SingerSong'
import Singer from '@/assets/common/js/singer.js'
import Song from '@/assets/common/js/song.js'
import songApi from '@/api/song.js'
import {
  ERR_OK
} from '@/api/config.js'
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      songList: null, // 歌曲列表
      loading: false
    }
  },
  computed: {
    ...mapState(['user', 'userLikeList', 'removeLikeSong'])
  },
  watch: {
    removeLikeSong (newSong) {
      if (!newSong.isLike) { // 从我喜欢列表中移除该歌曲
        // 移除歌曲
        this.utils.removeItem(this.userLikeList, newSong)
        this.removeSong(newSong)
      }
    },
    userLikeList () {
      this.getSongDetail()
    }
  },
  methods: {
    ...mapActions(['getUserLikeList']),
    // 返回上一个路由
    routerBack () {
      this.$router.back()
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
          songList.push(new Song({ id: item.id, name: item.name, singers, singersList, picUrl: item.al.picUrl }))
        })
        this.songList = songList
        this.loading = false
      }
    },
    // 选择歌手
    selectItem (item) {
      this.$router.push(`/singerInfo/${item.id}`)
    }
  },
  async mounted () {
    if (this.user) {
      await this.getUserLikeList(this.user.userId)
    }
  },
  components: {
    SongList
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