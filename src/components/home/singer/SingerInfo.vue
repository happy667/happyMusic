<template>
  <div class="singer-info-container"
       @touchstart="handleTouchStart"
       @touchmove="handleTouchMove"
       @touchend="handleTouchEnd">
    <!-- 返回 -->
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar :title="$route.meta.title"
                   ref="navBar"
                   left-arrow
                   :z-index="99"
                   @click-left="routerBack" />
    </van-sticky>

    <!-- 歌手简介 -->
    <singer-synopsis :singer="singer"
                     @hidePosition="handleHidePosition" />
    <!--歌手信息-->
    <section class="content">
      <van-tabs title-active-color="#FD4979"
                color="#FD4979"
                animated
                v-model="currentIndex"
                @change="handleTabsChange"
                swipeable>
        <!-- 歌手单曲 -->
        <van-tab title="歌曲">
          <singer-song :list="singerSong"
                       ref="singerSong"
                       :loading="loading" />
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
      <!-- 定位 -->
      <position v-show="isShowPosition"
                @click="handlePosition"></position>
    </section>
  </div>
</template>
<script>
import SingerSynopsis from './singerInfo/SingerSynopsis'
import SingerSong from './singerInfo/SingerSong'
import SingerAlbum from './singerInfo/SingerAlbum'
import SingerDetail from './singerInfo/SingerDetail'
import Position from '@/components/common/Position'
import singerApi from '@/api/singer.js'
import userApi from '@/api/user.js'
import Song from '@/assets/common/js/song.js'
import Singer from '@/assets/common/js/singer.js'
import {
  ERR_OK
} from '@/api/config.js'
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  name: 'singerInfo',
  props: {
    id: String
  },
  data () {
    return {
      singerDesc: {},
      singerSong: [], // 歌手单曲
      singerAlbum: [], // 歌手专辑
      singerDetail: null, // 歌手详情
      singerAlbumFinished: false, // 是否加载完歌手专辑
      loading: false,
      accountId: null,
      showPosition: false
    }
  },
  watch: {
    accountId (newId) {
      if (newId) {
        // 获取歌手用户详情
        this.getUserDetail(newId)
      }
    }
  },
  mounted () {
    // 根据歌手id获取歌手单曲
    this.handleTabsChange(this.currentIndex)
  },
  computed: {
    ...mapState(['singerCurrentIndex', 'singer', 'currentPlayIndex', 'isPlayerClick']),
    ...mapGetters(['currentSong']),
    currentIndex: {
      get () {
        return this.singerCurrentIndex
      },
      set (index) {
        this.setSingerCurrentIndex(index)
      }
    },
    // 是否显示定位
    isShowPosition () {
      // 判断当前歌曲列表是否有正在播放的歌曲（-1表示没有，currentIndex表示当前tab切换页是否在歌曲列表页）
      let index = this.$utils.findIndex(this.singerSong, this.currentSong)
      return this.showPosition && this.currentIndex === 0 && index !== -1
    }
  },
  methods: {
    ...mapMutations(['setSingerCurrentIndex', 'setSinger', 'setPlayerFullScreen', 'setIsPlayerClick']),

    routerBack () {
      if (this.isPlayerClick) {
        this.setPlayerFullScreen(true)
      }
      this.$utils.routerBack()
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
          if (!this.singerDetail) this.getSingerDetail(this.id)
          break
      }
    },
    // 获取歌手单曲
    async getSingerSong (id) {
      this.loading = true
      const { data: res } = await singerApi.getSingerSong(id)
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
        this.setSingerInfo(res.artist)
        if (res.artist.accountId) {
          this.accountId = res.artist.accountId
        }
        this.singerSong = songList
        this.loading = false
      }
    },
    async getSingerAlbum (id) {
      // 获取歌手专辑
      const offset = this.singerAlbum.length
      const { data: res } = await singerApi.getSingerAlbum(id, offset)
      if (res.code === ERR_OK) { // 成功获取歌手单曲
        this.singerAlbum = this.singerAlbum.concat(res.hotAlbums)
        this.singerAlbumFinished = !res.more
      }
    },
    // 获取歌手详情
    async getSingerDetail (id) {
      const { data: res } = await singerApi.getSingerDetail(id)
      if (res.code === ERR_OK) { // 成功 获取歌手详情
        this.singerDetail = {
          briefDesc: res.briefDesc,
          introduction: res.introduction,
          topicData: res.topicData
        }
      }
    },
    // 获取歌手用户详情
    async getUserDetail (id) {
      const { data: res } = await userApi.getUserDetail(id)
      if (res.code === ERR_OK) { // 成功 获取歌手详情
        let followeds = res.profile.followeds
        let singer = this.singer
        singer.followeds = followeds
      }
    },
    // 设置歌手
    setSingerInfo (singer) {
      let newSinger = new Singer({
        id: singer.id,
        name: singer.name,
        avatar: singer.img1v1Url,
        picUrl: singer.picUrl,
        followed: singer.followed
      })
      this.setSinger(newSinger)
    },
    // 上拉加载
    handlePullingUp () {
      setTimeout(async () => {
        await this.getSingerAlbum(this.id)
      }, 500)
    },
    handlePosition () {
      // 说明有歌曲在播放
      if (this.currentSong) {
        let listNode = this.$refs.singerSong.$refs.songList.$refs.list
        let song = this.currentSong
        let otherHeight = this.$refs.navBar.offsetHeight
        this.$utils.positionSong({ listNode, list: this.singerSong, song, otherHeight })
        this.$toast('已定位到当前歌曲')
      }
    },
    handleTouchStart () {
      if (this.currentIndex === 0) {
        clearTimeout(this.timer)
      }
    },
    handleTouchMove () {
      this.showPosition = true
    },
    handleTouchEnd () {
      this.timer = setTimeout(() => {
        this.showPosition = false
      }, 5000)
    },
    // 隐藏定位
    handleHidePosition () {
      this.showPosition = false
    }
  },
  components: {
    SingerSynopsis,
    SingerSong,
    SingerAlbum,
    SingerDetail,
    Position

  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-info-container>>>.van-tabs__wrap {
  margin-bottom: 0.4rem;
}

.singer-info-container>>>.van-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.singer-info-container>>>.van-tabs__content {
  flex: 1;
}

.singer-info-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $color-common-background;

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>