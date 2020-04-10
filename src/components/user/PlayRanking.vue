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
        <scroll ref="songList_weekend_scroll">
          <song-list ref="songList_weekend_container"
                     :list="weekendSongList"
                     :loading="loading"
                     noResult="暂无听歌记录" />
        </scroll>
      </van-tab>
      <van-tab title="所有时间">
        <scroll ref="songList_all_scroll">
          <song-list ref="songList_all_container"
                     :list="allSongList"
                     :loading="loading"
                     noResult="暂无听歌记录" />
        </scroll>
      </van-tab>
    </van-tabs>

  </div>
</template>
<script>
import Scroll from '@/components/common/Scroll'
import SongList from '@/components/home/singer/singerInfo/SingerSong'
import Singer from '@/assets/common/js/singer.js'
import Song from '@/assets/common/js/song.js'
import userApi from '@/api/user.js'
import {
  ERR_OK
} from '@/api/config.js'
import { mapState } from 'vuex'
import { playlistMixin } from '@/assets/common/js/mixin.js'
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
  mixins: [playlistMixin],
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
      this.handlePlaylist(this.playList)
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
    },
    handlePlaylist (playList) {
      // 适配播放器与页面底部距离
      const bottom = playList.length > 0 ? '1.6rem' : ''
      this.$nextTick(() => {
        switch (this.index) {
          case 0:
            this.$refs.songList_weekend_container.$el.style.paddingBottom = bottom
            this.$refs.songList_weekend_scroll.refresh()
            break
          case 1:
            this.$refs.songList_all_container.$el.style.paddingBottom = bottom
            this.$refs.songList_all_scroll.refresh()
            break
        }
      })
    }
  },
  mounted () {
    this.handleChange(this.index)
  },
  components: {
    SongList,
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.play-ranking-container >>> .scroll {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.play-ranking-container>>>.song-list-container {
  padding-top: 0.3rem;
}

.play-ranking-container>>>.van-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.play-ranking-container>>>.van-tabs__content {
  position: relative;
  flex: 1;
}

.play-ranking-container>>>.van-tabs__content .van-tabs__track, .play-ranking-container>>>.van-tabs__content .van-tab__pane {
  position: absolute;
  top: 0;
  bottom: 0;
}

.play-ranking-container {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $color-common-background;
}
</style>