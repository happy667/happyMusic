<template>
  <div class="play-ranking-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar title="听歌排行"
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
import userApi from '@/api/user.js'
import {
  ERR_OK
} from '@/api/config.js'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      songList: null, // 歌曲列表
      loading: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  provide () {
    return {
      showPlayCount: true
    }
  },
  watch: {
    user () {
      this.getUserPlayRecord(this.user.userId)
    }
  },
  methods: {
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    },
    async getUserPlayRecord (id) {
      this.loading = true
      const {
        data: res
      } = await userApi.getUserPlayRecord(id)
      if (res.code === ERR_OK) {
        let songList = []
        res.weekData.forEach((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
          let singers = item.song.ar.map(item => item.name).join('/')
          let singersList = []
          // 处理歌手
          item.song.ar.forEach(item => {
            singersList.push(new Singer({
              id: item.id,
              name: item.name
            }))
          })
          songList.push(new Song({ id: item.song.id, name: item.song.name, singers, singersList, picUrl: item.song.al.picUrl, playCount: item.playCount }))
        })
        this.songList = songList
        this.loading = false
      }
    }
  },
  mounted () {
    if (this.user) {
      this.getUserPlayRecord(this.user.userId)
    }
  },
  components: {
    SongList
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.play-ranking-container>>>.singer-song-container {
  padding-top: 0.3rem;
}

.play-ranking-container {
  width: 100%;
  min-height: 100vh;
  background-color: $color-common-background;
}
</style>