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
    <!--歌手信息-->
    <section class="content">
      <scroll ref="singerInfo_scroll"
              @scroll="scroll"
              :listenScroll="listenScroll"
              :pullUp="pullUp"
              @pullingUpLoad="handlePullingUp"
              :probeType="probeType">
        <div class="container"
             ref="container">
          <!-- 歌手简介 -->
          <singer-synopsis :singer="singer"
                           @toggle="handleToggleShowImage" />

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
              <singer-album :singerAlbum="singerAlbum" />
              <!-- loading -->
              <loading :loading="loadMoreAlbum"
                       height="2rem" />
            </van-tab>
            <!-- 歌手mv -->
            <van-tab title="MV">
              <singer-mv :mvList="singerMV" />
              <!-- loading -->
              <loading :loading="loadMoreMV"
                       height="2rem" />
            </van-tab>
            <!-- 歌手详情 -->
            <van-tab title="关于">
              <singer-detail ref="singerDetail"
                             :goToIntroduce="goToIntroduce"
                             :simSingerList="simSingerList"
                             :singerDetail="singerDetail"
                             @selectSimSinger="selectSimSinger" />
            </van-tab>
          </van-tabs>
        </div>

        <!-- 定位 -->
        <position v-show="isShowPosition"
                  @click="handlePosition"></position>
      </scroll>
      <!-- 遮罩层 -->
      <template v-if="singer">
        <overlay :showImage="showImage"
                 :imgUrl="singer.picUrl"
                 @toggle="handleToggleShowImage">
        </overlay>
      </template>
    </section>
  </div>
</template>
<script>
import SingerMv from './singerInfo/SingerMV'
import SingerSynopsis from './singerInfo/SingerSynopsis'
import SingerSong from './singerInfo/SingerSong'
import SingerAlbum from './singerInfo/SingerAlbum'
import SingerDetail from './singerInfo/SingerDetail'
import Position from '@/components/common/Position'
import singerApi from '@/api/singer.js'
import userApi from '@/api/user.js'
import Song from '@/assets/common/js/song.js'
import Singer from '@/assets/common/js/singer.js'
import Album from '@/assets/common/js/album.js'
import overlay from '@/components/common/OverlayImage'
import {
  ERR_OK
} from '@/api/config.js'
import { mapState, mapMutations, mapGetters } from 'vuex'
import Scroll from '@/components/common/Scroll'
import { playlistMixin } from '@/assets/common/js/mixin.js'
export default {
  name: 'singerInfo',
  props: {
    id: String
  },
  mixins: [playlistMixin],
  data () {
    return {
      singerDesc: {},
      simSingerList: [], // 相似
      singerSong: [], // 歌手单曲
      singerAlbum: null, // 歌手专辑
      singerMV: null, // 歌手MV
      singerDetail: null, // 歌手详情
      singerAlbumFinished: false, // 歌手专辑是否加载完成
      singerMVFinished: false, // 歌手mv是否加载完成
      loading: false,
      accountId: null,
      showPosition: false,
      scrollY: 0,
      loadMoreAlbum: false,
      loadMoreMV: false,
      showImage: false
    }
  },
  created () {
    this.listenScroll = true// 可以监听页面滚动
    this.scrollEnd = true// 可以监听页面停止滚动
    this.probeType = 3// 可以监听缓冲时的滑动位置
    this.pullUp = true
  },
  watch: {
    accountId (newId) {
      if (newId) {
        // 获取歌手用户详情
        this.getUserDetail(newId)
      }
    },
    loadMoreAlbum () {
      this.$nextTick(() => {
        this.refresh()
      })
    },
    loadMoreMV () {
      this.$nextTick(() => {
        this.refresh()
      })
    }
  },
  mounted () {
    // 根据歌手id获取歌手单曲
    this.handleTabsChange(this.currentIndex)
    console.log(123)
  },
  computed: {
    ...mapState(['user', 'singerCurrentIndex', 'singer', 'currentPlayIndex', 'isPlayerClick', 'hideMiniPlayer']),
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
    ...mapMutations(['setSingerCurrentIndex', 'setSinger', 'setPlayerFullScreen', 'setIsPlayerClick', 'setHideMiniPlayer', 'setAddNoCacheComponents']),
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
          if (!this.singerAlbum) this.getSingerAlbum(this.id)
          break
        case 2:// 歌手MV
          if (!this.singerMV) this.getSingerMV(this.id)
          break
        case 3: // 歌手详情
          if (!this.singerDetail) {
            this.getSingerDetail(this.id)
          }
          if (this.simSingerList.length === 0 && this.user) {
            this.getSimilarSinger(this.id)
          }

          break
      }
    },
    // 获取歌手单曲
    async getSingerSong (id) {
      try {
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
            songList.push(new Song({
              id: item.id,
              name: item.alia.length > 0 ? `${item.name} (${item.alia.join('/')})` : item.name,
              singers,
              singersList,
              picUrl: item.al.picUrl,
              st: item.privilege.st,
              mv: item.mv,
              album: new Album({ id: item.al.id, name: item.al.name, picUrl: item.al.picUrl })
            }))
          })
          this.setSingerInfo(res.artist)
          if (res.artist.accountId) {
            this.accountId = res.artist.accountId
          }
          this.singerSong = songList
          this.loading = false
        }
      } catch (e) {
        this.$router.replace('/')
      }
    },
    // 获取歌手专辑
    async getSingerAlbum (id) {
      // 获取歌手专辑
      const offset = this.singerAlbum ? this.singerAlbum.length : 0
      const { data: res } = await singerApi.getSingerAlbum(id, offset)
      if (res.code === ERR_OK) { // 成功获取歌手单曲
        let albumList = []
        res.hotAlbums.forEach(item => {
          let album = new Album({
            id: item.id,
            name: item.alias.length > 0 ? `${item.name} (${item.alias.join('/')})` : item.name,
            picUrl: item.picUrl,
            singerName: item.artist.name,
            size: item.size,
            publishTime: item.publishTime
          })
          albumList.push(album)
        })

        if (this.singerAlbum) {
          this.singerAlbum = this.singerAlbum.concat(albumList)
        } else if (res.hotAlbums.length !== 0) {
          this.singerAlbum = []
          this.singerAlbum = this.singerAlbum.concat(albumList)
        } else {
          this.singerAlbum = []
        }

        this.singerAlbumFinished = !res.more
        this.loadMoreAlbum = false
      }
    },
    // 获取歌手mv
    async getSingerMV (id) {
      // 获取歌手专辑
      const offset = this.singerMV ? this.singerMV.length : 0
      // 获取歌手mv
      const { data: res } = await singerApi.getSingerMV(id, offset)
      if (res.code === ERR_OK) { // 成功获取歌手MV
        let mvs = res.mvs
        if (this.singerMV) {
          this.singerMV = this.singerMV.concat(mvs)
        } else if (mvs.length !== 0) {
          this.singerMV = []
          this.singerMV = this.singerMV.concat(mvs)
        } else {
          this.singerMV = []
        }

        this.singerMVFinished = !res.hasMore
        this.loadMoreMV = false
      }
    },

    // 获取歌手详情
    async getSingerDetail (id) {
      const { data: res } = await singerApi.getSingerDetail(id)
      if (res.code === ERR_OK) { // 成功 获取歌手详情
        this.singerDetail = {
          singerId: this.id,
          briefDesc: res.briefDesc,
          introduction: res.introduction,
          topicData: res.topicData
        }
      }
    },
    // 获取相似歌手
    async getSimilarSinger (id) {
      const { data: res } = await singerApi.getSimilarSinger(id)
      if (res.code === ERR_OK) { // 成功 获取歌手详情
        let singerList = []
        // 处理歌手
        res.artists.forEach(item => {
          singerList.push(new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliaName: item.alias.join(' / '),
            picUrl: item.picUrl,
            mvSize: item.mvSize,
            albumSize: item.albumSize,
            followed: item.followed
          }))
        })
        this.simSingerList = singerList
        this.$nextTick(() => {
          this.refresh()
        })
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
      switch (this.currentIndex) {
        case 1:
          this.handleLoadMoreAlbum()
          break
        case 2:
          this.handleLoadMoreMV()
          break
      }
    },
    // 处理加载更多专辑
    handleLoadMoreAlbum () {
      if (this.singerAlbumFinished) { // 加载完成
        return
      }
      if (this.loadMoreAlbum) { // 如果请求未完成就不继续请求数据
        return
      }
      clearTimeout(this.loadTimerAlbum)
      this.loadMoreAlbum = true
      this.loadTimerAlbum = setTimeout(async () => {
        await this.getSingerAlbum(this.id)
        this.$nextTick(() => {
          this.$refs.singerInfo_scroll.finishPullUp()
        })
      }, 300)
    },
    // 处理加载更多mv
    handleLoadMoreMV () {
      if (this.singerMVFinished) { // 加载完成
        return
      }
      if (this.loadMoreMV) { // 如果请求未完成就不继续请求数据
        return
      }
      clearTimeout(this.loadTimerAlbum)
      this.loadMoreMV = true
      this.loadTimerMV = setTimeout(async () => {
        await this.getSingerMV(this.id)
        this.$nextTick(() => {
          this.$refs.singerInfo_scroll.finishPullUp()
        })
      }, 300)
    },
    // 处理定位
    handlePosition () {
      // 说明有歌曲在播放
      if (this.currentSong) {
        // 获取当前歌曲索引
        let index = this.singerSong.findIndex(item => item.id === this.currentSong.id)
        let element = this.$refs.singerSong.$refs.songList.$refs.listGroup[index]
        this.$refs.singerInfo_scroll.scrollToElement(element, 0)
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
    },
    goToIntroduce () {
      this.$router.push(`/singerIntroduce/${this.id}`)
    },
    handlePlaylist (playList) {
      // 适配播放器与页面底部距离
      const bottom = playList.length > 0 ? '1.6rem' : ''
      this.$nextTick(() => {
        this.$refs.container.style.paddingBottom = bottom
        this.refresh()
      })
    },
    // 页面滚动
    scroll (pos) {
      this.scrollY = pos.y
    },
    refresh () {
      this.$refs.singerInfo_scroll.refresh()
    },
    // 显示隐藏图片
    handleToggleShowImage () {
      this.showImage = !this.showImage
      this.handleHidePosition()
      if (this.currentPlayIndex !== -1) {
        this.setHideMiniPlayer(!this.hideMiniPlayer)
      }
    },
    // 选择相似歌手
    selectSimSinger (item) {
      this.setSingerCurrentIndex(0)
      this.setAddNoCacheComponents('singerInfo')
      this.$router.push(`/singerInfo/${item.id}`)
    }
  },
  components: {
    SingerSynopsis,
    SingerSong,
    SingerAlbum,
    SingerDetail,
    Position,
    Scroll,
    overlay,
    SingerMv
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-info-container >>> .scroll {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

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
  display: flex;
  flex-direction: column;
}

.singer-info-container>>>.van-tabs__track {
  flex: 1;
}

.singer-info-container {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $color-common-background;

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;

    .container {
      position: absolute;
      width: 100%;
      min-height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>