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
    <singer-synopsis />
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
import {
  ERR_OK
} from '@/api/config.js'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
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
        this.singerSong = res.hotSongs
        console.log(this.singerSong)
      }
    },
    async getSingerAlbum (id) {
      // 获取歌手专辑
      const { data: res2 } = await SingerApi.getSingerAlbum(id)
      if (res2.code === ERR_OK) { // 成功获取歌手单曲
        this.singerAlbum = res2.hotAlbums
        console.log(this.singerAlbum)
      }
    },
    async getSingerDetail (id) {
      // 获取歌手详情
      const { data: res3 } = await SingerApi.getSingerDetail(id)
      if (res3.code === ERR_OK) { // 成功 获取歌手详情
        this.singerDetail = {
          briefDesc: res3.briefDesc,
          introduction: res3.introduction,
          topicData: res3.topicData
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
.singer-info-container>>>.van-loading {
  // 减去头部标题高度、歌手图片高度、标签页高度、播放器高度
  height: calc(100vh - (1.22667rem + 6rem + 1.18rem + 1.8rem));
}

.singer-info-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 1.8rem;
  background: $color-common-background;
}
</style>