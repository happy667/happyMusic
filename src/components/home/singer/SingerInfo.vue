<template>
  <div class="singer-info-container">
    <!-- 返回 -->
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar title="歌手信息"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>
    <!-- 歌手简介 -->
    <singer-synopsis :singer="singer" />
    <!--歌手信息-->
    <div class="singer-info">
      <van-tabs title-active-color="#FD4979"
                color="#FD4979"
                animated
                v-model="currentIndex"
                @change="handleTabsChange"
                swipeable>
        <!-- 歌手单曲 -->
        <van-tab title="歌曲">
          <singer-song :singerSong="singerSong" />
        </van-tab>
        <!-- 歌手专辑 -->
        <van-tab title="专辑">
          <singer-album :singerAlbum="singerAlbum"
                        @pullingUp="handlePullingUp"
                        :finished="singerAlbumFinished" />
        </van-tab>
        <!-- 歌手详情 -->
        <van-tab title="详情">
          <singer-detail :singerDetail="singerDetail" />
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import SingerSynopsis from './singerInfo/SingerSynopsis'
import SingerSong from './singerInfo/SingerSong'
import SingerAlbum from './singerInfo/SingerAlbum'
import SingerDetail from './singerInfo/SingerDetail'
import SingerApi from '@/api/singer.js'
import Song from '@/assets/common/js/song.js'
import Singer from '@/assets/common/js/singer.js'
import {
  ERR_OK
} from '@/api/config.js'
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    id: String
  },
  data () {
    return {
      singerDesc: {},
      singerSong: [], // 歌手单曲
      singerAlbum: [], // 歌手专辑
      singerDetail: {}, // 歌手详情
      singerAlbumFinished: false // 是否加载完歌手专辑
    }
  },

  created () {
    // 根据歌手id获取歌手单曲
    this.handleTabsChange(this.currentIndex)
    this.setSingerCurrentIndex(0)
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.id) {
        vm.$router.push('/home')
      }
    })
  },
  computed: {
    ...mapState(['singer', 'singerCurrentIndex']),
    currentIndex: {
      get () {
        return this.singerCurrentIndex
      },
      set (index) {
        this.setSingerCurrentIndex(index)
      }
    }
  },
  methods: {
    ...mapMutations(['setSingerCurrentIndex', 'setSinger']),
    routerBack () {
      this.$router.push('/home')
    },
    handleTabsChange (name) {
      switch (name) {
        case 0:// 歌手单曲
          if (this.singerSong.length === 0) this.getSingerSong(this.id)
          break
        case 1:// 歌手专辑
          if (this.singerAlbum.length === 0) this.getSingerAlbum(this.id)
          break
        case 2: // 歌手详情
          if (Object.keys(this.singerDetail).length === 0) this.getSingerDetail(this.id)
          break
      }
    },
    async getSingerSong (id) {
      // 获取歌手单曲
      const { data: res } = await SingerApi.getSingerSong(id)
      if (res.code === ERR_OK) { // 成功获取歌手单曲
        let songList = []
        res.hotSongs.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
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
        console.log(songList)
        let singer = new Singer({
          id: res.artist.id,
          name: res.artist.name,
          avatar: res.artist.img1v1Url,
          aliaName: res.artist.alias[0],
          picUrl: res.artist.picUrl
        })
        // 设置歌手
        this.setSinger(singer)
        this.singerSong = songList
      }
    },
    async getSingerAlbum (id) {
      // 获取歌手专辑
      const offset = this.singerAlbum.length
      const { data: res } = await SingerApi.getSingerAlbum(id, offset)
      if (res.code === ERR_OK) { // 成功获取歌手单曲
        this.singerAlbum = this.singerAlbum.concat(res.hotAlbums)

        this.singerAlbumFinished = !res.more
        console.log(this.singerAlbumFinished)
      }
    },
    async getSingerDetail (id) {
      // 获取歌手详情
      const { data: res } = await SingerApi.getSingerDetail(id)
      if (res.code === ERR_OK) { // 成功 获取歌手详情
        this.singerDetail = {
          briefDesc: res.briefDesc,
          introduction: res.introduction,
          topicData: res.topicData
        }
        console.log(this.singerDetail)
      }
    },
    // 上拉加载
    handlePullingUp () {
      setTimeout(async () => {
        await this.getSingerAlbum(this.id)
      }, 500)
    }

  },

  components: {
    SingerSynopsis,
    SingerSong,
    SingerAlbum,
    SingerDetail
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-info-container>>>.van-loading {
  // 减去头部标题高度、歌手图片高度、标签页高度
  height: calc(100vh - (1.22667rem + 6rem + 1.18rem + 0.4rem));
}

.singer-info-container {
  width: 100%;
  min-height: 100vh;
  background-color: $color-common-background;
}
</style>