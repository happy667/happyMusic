<template>
  <div class="play-ranking-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar title="听歌排行"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>
    <van-tabs title-active-color="#FD4979"
              color="#FD4979"
              animated
              v-model="index"
              @change="handleChange"
              swipeable>
      <van-tab title="最近一周">
        <song-list :list="weekendSongList"
                   :loading="loading" />
      </van-tab>
      <van-tab title="所有时间">
        <song-list :list="allSongList"
                   :loading="loading" />
      </van-tab>
    </van-tabs>

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
      weekendSongList: null, // 最近一周
      allSongList: null, // 所有时间
      loading: false,
      index: 0
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
    async user () {
      if (this.index === 0) {
        this.weekendSongList = await this.getUserPlayRecord(this.user.userId, 1)
      } else {
        this.allSongList = await this.getUserPlayRecord(this.user.userId, 0)
      }
    }
  },
  methods: {
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    },
    async getUserPlayRecord (id, type) {
      console.log(type)
      this.loading = true
      const {
        data: res
      } = await userApi.getUserPlayRecord(id, type)
      let data = type === 0 ? 'allData' : 'weekData'
      if (res.code === ERR_OK) {
        let songList = []
        console.log(data)
        res[data].forEach((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
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
        console.log(songList)
        this.loading = false
        return songList
      }
    },
    async handleChange (name) {
      if (name === 0) { // 获取一周听歌排行
        if (!this.weekendSongList) {
          this.weekendSongList = await this.getUserPlayRecord(this.user.userId, 1)
        }
      } else {
        if (!this.allSongList) {
          this.allSongList = await this.getUserPlayRecord(this.user.userId, 0)
        }
      }
    }
  },
  async mounted () {
    if (this.user) {
      if (this.index === 0) {
        this.weekendSongList = await this.getUserPlayRecord(this.user.userId, 1)
      } else {
        this.allSongList = await this.getUserPlayRecord(this.user.userId, 0)
      }
    }
  },
  components: {
    SongList
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.play-ranking-container>>>.song-list-container {
  padding-top: 0.3rem;
  min-height: calc(100vh - 1.22667rem - 1.22667rem);
}

.play-ranking-container {
  width: 100%;
  min-height: 100vh;
  background-color: $color-common-background;
}
</style>