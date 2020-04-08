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
      <van-tab title="最近一周">
        <song-list :list="weekendSongList"
                   :loading="loading"
                   noResult="暂无听歌记录" />
      </van-tab>
      <van-tab title="所有时间">
        <song-list :list="allSongList"
                   :loading="loading"
                   noResult="暂无听歌记录" />
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
  name: 'playRanking',
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
    user () {
      this.handleChange(this.index)
    }
  },
  methods: {
    // 返回上一个路由
    routerBack () {
      this.$utils.routerBack()
    },
    async getUserPlayRecord (id, type) {
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
        this.loading = false
        return songList
      }
    },
    async handleChange (name) {
      if (this.user) {
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
    }
  },
  mounted () {
    this.handleChange(this.index)
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
}

.play-ranking-container>>>.van-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.play-ranking-container>>>.van-tabs__content {
  flex: 1;
}

.play-ranking-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $color-common-background;
}
</style>