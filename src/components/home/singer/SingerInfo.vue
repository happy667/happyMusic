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
    <singer-synopsis :singer="singerDesc" />
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
          <singer-album :singerAlbum="singerAlbum" />
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
  data () {
    return {
      singerDesc: {},
      singerSong: [], // 歌手单曲
      singerAlbum: [], // 歌手专辑
      singerDetail: {} // 歌手详情
    }
  },

  created () {
    // 根据歌手id获取歌手单曲
    this.handleTabsChange(this.currentIndex)
  },
  beforeRouteEnter: (to, from, next) => {
    next(vm => {
      if (!vm.singer.id) {
        vm.$router.push('/home')
      }
    })
  },
  methods: {
    ...mapMutations(['setSingerCurrentIndex']),
    routerBack () {
      this.$router.back()
    },
    handleTabsChange (name) {
      switch (name) {
        case 0:// 歌手单曲
          if (this.singerSong.length === 0) this.getSingerSong(this.singer.id)
          break
        case 1:// 歌手专辑
          if (this.singerAlbum.length === 0) this.getSingerAlbum(this.singer.id)
          break
        case 2: // 歌手详情
          if (Object.keys(this.singerDetail).length === 0) this.getSingerDetail(this.singer.id)
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
          let singersId = item.ar.map(item => item.id).join(',')
          songList.push(new Song({ id: item.id, name: item.name, singers, singersId, picUrl: item.al.picUrl }))
        })
        let singer = new Singer({
          id: res.artist.id,
          name: res.artist.name,
          avatar: res.artist.img1v1Url,
          aliaName: res.artist.alias[0],
          picUrl: res.artist.picUrl
        })
        this.singerDesc = singer
        this.singerSong = songList
      }
    },
    async getSingerAlbum (id) {
      // 获取歌手专辑
      const { data: res } = await SingerApi.getSingerAlbum(id)
      if (res.code === ERR_OK) { // 成功获取歌手单曲
        this.singerAlbum = res.hotAlbums
        console.log(this.singerAlbum)
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
    }

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
  height: calc(100vh - (1.22667rem + 6rem + 1.18rem));
}

.singer-info-container {
  width: 100%;
  height: 100%;
}
</style>