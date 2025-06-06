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
          <!-- 歌手背景图片 -->
          <singer-image :imageUrl="backgroundUrl"
                        @toggle="handleClickSingerBackground" />

          <van-tabs title-active-color="#FD4979"
                    ref="vanTab"
                    color="#FD4979"
                    animated
                    v-model="currentIndex"
                    @change="handleTabsChange"
                    swipeable>
            <!-- 歌手单曲 -->
            <van-tab title="歌曲">
              <singer-song :list="singerSong?singerSong:[]"
                           ref="singerSong"
                           :loading="loading" />
            </van-tab>
            <!-- 歌手专辑 -->
            <van-tab :title="albumTitle">
              <singer-album :singerAlbum="singerAlbum" />
              <!-- loading -->
              <loading :loading="loadMoreAlbum"
                       height="2rem" />
            </van-tab>
            <!-- 歌手mv -->
            <van-tab :title="mvTitle">
              <singer-mv :mvList="singerMV" />
              <!-- loading -->
              <loading :loading="loadMoreMV"
                       height="2rem" />
            </van-tab>
            <!-- 歌手描述 -->
            <van-tab title="关于">
              <singer-desc ref="singerDesc"
                           :goToIntroduce="goToIntroduce"
                           :simSingerList="simSingerList?simSingerList:[]"
                           :singerDesc="singerDesc"
                           @selectSimSinger="selectSimSinger" />
              <loading :loading="loadSimSinger"
                       height="2rem" />
            </van-tab>
          </van-tabs>
          <div class="singer-card-container">
            <div class="singer-card">
              <div class="content">
                <!-- 歌手头像 -->
                <div class="singer-avatar"
                     @click="handleClickSingerAvatar"
                     :style="loadAvatarStyle">
                  <my-image v-if="this.singerDetail"
                            :src="this.singerDetail.artist.avatar"
                            size="big" />
                </div>
                <van-skeleton :row="4"
                              :loading="!this.singerDetail"
                              row-width="100%">
                  <template v-if="this.singerDetail">
                    <!-- 歌手名称 -->
                    <div class="singer-name"
                         :style="singerNameStyle">
                      {{singer.name}}
                    </div>
                    <!-- 粉丝数量 -->
                    <p class="follows"
                       v-if="singer">{{singer.followCount|convertCount}}粉丝</p>
                    <div class="singer-desc"
                         v-if="this.singerDetail.identify">
                      {{this.singerDetail.identify.imageDesc}}
                    </div>
                    <!-- 收藏 -->
                    <div class="follow">
                      <follow @clickFollow="handleClickFollow"
                              :followed="singer.followed"
                              :followText="singer.followDay"></follow>
                    </div>
                  </template>
                </van-skeleton>
              </div>
            </div>
          </div>
        </div>

        <!-- 定位 -->
        <position v-show="isShowPosition"
                  @click="handlePosition"></position>
      </scroll>
      <!-- 遮罩层 -->
      <template v-if="this.singerDetail">
        <overlay :showImage="showImage"
                 :imgUrl="overlayUrl"
                 @toggle="handleToggleShowImage">
        </overlay>
      </template>
    </section>
  </div>
</template>
<script>
import MyImage from '@/components/common/img/Image'
import SingerMv from './singerInfo/SingerMV'
import SingerImage from './singerInfo/SingerImage'
import SingerSong from './singerInfo/SingerSong'
import SingerAlbum from './singerInfo/SingerAlbum'
import SingerDesc from './singerInfo/SingerDesc'
import Position from '@/components/common/Position'
import Follow from '@/components/common/Follow'
import singerApi from '@/api/singer.js'
import userApi from '@/api/user.js'
import Song from '@/assets/common/js/song.js'
import Singer from '@/assets/common/js/singer.js'
import Album from '@/assets/common/js/album.js'
import overlay from '@/components/common/OverlayImage'
import {
  ERR_OK
} from '@/api/config.js'
import 'common/js/convert.js'
import {
  mapState,
  mapMutations,
  mapGetters
} from 'vuex'
import Scroll from '@/components/common/Scroll'
import {
  playlistMixin
} from '@/assets/common/js/mixin.js'
export default {
  name: 'singerInfo',
  props: {
    id: String
  },
  mixins: [playlistMixin],
  data () {
    return {
      singerDesc: null, //歌手描述
      simSingerList: null, // 相似
      singerSong: null, // 歌手单曲
      singerAlbum: null, // 歌手专辑
      singerMV: null, // 歌手MV
      singerDetail: null, // 歌手详情
      singerAlbumFinished: false, // 歌手专辑是否加载完成
      singerMVFinished: false, // 歌手mv是否加载完成
      loading: true,
      showPosition: false,
      scrollY: 0,
      loadMoreAlbum: false,
      loadMoreMV: false,
      loadSimSinger: false,
      showImage: false,
      overlayUrl: ""
    }
  },
  created () {
    this.listenScroll = true // 可以监听页面滚动
    this.scrollEnd = true // 可以监听页面停止滚动
    this.probeType = 3 // 可以监听缓冲时的滑动位置
    this.pullUp = true
  },
  watch: {
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
  async mounted () {
    if (this.singer) {
      this.singer.picUrl = '';
    }
    // 获取歌手详情
    await this.getSingerDetail(this.id);
    // 根据歌手id获取歌手单曲
    this.handleTabsChange(this.currentIndex)
  },

  computed: {
    ...mapState(['user', 'singerCurrentIndex', 'playerFullScreen', 'singer', 'currentPlayIndex', 'isPlayerClick', 'hideMiniPlayer']),
    ...mapGetters(['currentSong']),
    currentIndex: {
      get () {
        return this.singerCurrentIndex
      },
      set (index) {
        this.setSingerCurrentIndex(index)
      }
    },
    followCount () {
      return this.singer.followCount ? this.singer.followCount : 0
    },
    // 是否显示定位
    isShowPosition () {
      if (!this.singerSong) return
      // 判断当前歌曲列表是否有正在播放的歌曲（-1表示没有，currentIndex表示当前tab切换页是否在歌曲列表页）
      let index = this.$utils.findIndex(this.singerSong, this.currentSong)
      return this.showPosition && this.currentIndex === 0 && index !== -1
    },
    backgroundUrl () {
      if (!this.singerDetail) {
        return
      }
      return this.singerDetail.user ? this.singerDetail.user.backgroundUrl : this.singerDetail.artist.cover
    },
    singerNameStyle () {
      if (!this.singerDetail) {
        return
      }
      return this.singerDetail.artist ? "margin-top:0.6rem" : "margin-top:0"
    },
    albumTitle () {
      return this.singerDetail ? '专辑 ' + this.singerDetail.artist.albumSize : "专辑"
    },
    mvTitle () {
      return this.singerDetail ? 'MV ' + this.singerDetail.artist.mvSize : "MV"
    },
    loadAvatarStyle () {
      return !this.singerDetail ? "background:#fff" : ''
    },
  },
  methods: {
    ...mapMutations(['setSingerCurrentIndex', 'setSinger', 'setPlayerFullScreen', 'setIsPlayerClick', 'setHideMiniPlayer', 'setAddNoCacheComponents']),
    routerBack () {
      if (!this.playerFullScreen && this.isPlayerClick) {
        this.setPlayerFullScreen(true)
      }
      this.$utils.routerBack()
    },
    handleVanTab () {
      // 适配tab栏与歌手名片距离
      let top = "";
      if (this.singerDetail.identify) {
        top = "3.8rem"
      } else {
        top = "3.1rem"
      }
      this.$nextTick(() => {
        this.$refs.vanTab.$el.style.marginTop = top
      })
    },
    async handleTabsChange (name) {
      switch (name) {
        case 0: // 歌手单曲
          if (!this.singerSong) this.getSingerSong(this.id)
          break
        case 1: // 歌手专辑
          if (!this.singerAlbum) this.getSingerAlbum(this.id)
          break
        case 2: // 歌手MV
          if (!this.singerMV) this.getSingerMV(this.id)
          break
        case 3: // 歌手描述
          if (!this.singerDesc) {
            await this.getSingerDesc(this.id)
          }
          if (!this.simSingerList && this.user) {
            this.getSimilarSinger(this.id)
          }
          break
      }
    },
    // 获取歌手单曲
    async getSingerSong (id) {
      try {
        this.loading = true;

        const { data: res } = await singerApi.getSingerSong(id);
        if (res.code !== ERR_OK) {
          throw new Error('获取歌手单曲失败');
        }

        // 处理每首歌曲
        const songList = await Promise.all(
          res.hotSongs.map(async (item) => {
            // 处理歌手信息
            const singers = item.ar.map((artist) => artist.name).join('/');
            const singersList = item.ar.map(
              (artist) =>
                new Singer({
                  id: artist.id,
                  name: artist.name,
                })
            );

            // 返回歌曲对象
            return new Song({
              id: item.id,
              name: item.tns ? `${item.name} (${item.tns[0]})` : item.name,
              singers,
              singersList,
              mv: item.mv,
              album: new Album({
                id: item.al.id,
                name: item.al.name,
                picUrl: item.al.picUrl,
              }),
            });
          })
        );
        // 更新歌手单曲列表
        this.singerSong = songList;
      } catch (error) {
        console.error('获取歌手单曲失败:', error.message);
        this.$router.replace('/');
      } finally {
        // 关闭加载logo
        this.loading = false;
      }
    },
    async getSingerDetail (id) {
      const {
        data: res
      } = await singerApi.getSingerDetail(id)
      if (res.code === ERR_OK) { // 成功获取歌手详情
        this.setSingerInfo(res.data.artist)
        // 获取歌手关注详情
        await this.getSingerFollow(this.id)
        this.singerDetail = res.data
        this.handleVanTab();
      }
    },
    // 获取歌手专辑
    async getSingerAlbum (id) {
      // 获取歌手专辑
      const offset = this.singerAlbum ? this.singerAlbum.length : 0
      const {
        data: res
      } = await singerApi.getSingerAlbum(id, offset)
      if (res.code === ERR_OK) { // 成功获取歌手单曲
        let albumList = []
        res.hotAlbums.forEach(item => {
          let album = new Album({
            id: item.id,
            name: item.alias.length > 0 ? `${item.name}(${item.alias.join('/')})` : item.name,
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
      const {
        data: res
      } = await singerApi.getSingerMV(id, offset)
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

    // 获取歌手描述
    async getSingerDesc (id) {
      const {
        data: res
      } = await singerApi.getSingerDesc(id)
      if (res.code === ERR_OK) { // 成功 获取歌手详情
        this.singerDesc = {
          singerId: this.id,
          briefDesc: res.briefDesc,
          introduction: res.introduction,
          topicData: res.topicData
        }
      }
    },
    // 获取相似歌手
    async getSimilarSinger (id) {
      this.loadSimSinger = true;
      const {
        data: res
      } = await singerApi.getSimilarSinger(id)
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
        this.loadSimSinger = false;
        this.refresh()
      }
    },

    // 获取歌手关注
    async getSingerFollow (id) {
      const {
        data: res
      } = await singerApi.getSingerFollow(id)
      if (res.code === ERR_OK) { // 成功 获取
        let singer = this.singer
        singer.followCount = res.data.fansCnt
        singer.followed = res.data.isFollow
        singer.followDay = res.data.followDay
        this.setSingerInfo(singer)
      }
    },
    // 设置歌手
    setSingerInfo (singer) {
      let newSinger = new Singer({
        id: singer.id,
        name: singer.name,
        avatar: singer.avatarUrl,
        picUrl: singer.backgroundUrl,
        followed: singer.followed,
        followCount: singer.followCount,
        followDay: singer.followDay
      })
      this.setSinger(newSinger)
    },
    // 上拉加载
    handlePullingUp () {
      if (this.loading) return
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
      const bottom = playList.length > 0 ? '1.5rem' : ''
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
    //点击背景图片头像
    handleClickSingerBackground () {
      if (this.singerDetail.artist) {
        this.overlayUrl = this.singerDetail.user ? this.singerDetail.user.backgroundUrl : this.singerDetail.artist.cover
        this.handleToggleShowImage()
      }
    },
    //点击歌手头像
    handleClickSingerAvatar () {
      if (this.singerDetail.user) {
        this.overlayUrl = this.singerDetail.user.avatarUrl
        this.handleToggleShowImage()
      }
    },
    // 选择相似歌手
    selectSimSinger (item) {
      this.setSingerCurrentIndex(0)
      this.setAddNoCacheComponents('singerInfo')
      this.$router.push(`/singerInfo/${item.id}`)
    },
    // 选中收藏歌手
    handleClickFollow () {
      if (this.user) { // 说明已经登录
        this.follow() // 收藏/取消收藏歌手
      } else { // 弹窗提示去登录
        this.$utils.alertLogin(this.$router.currentRoute.fullPath)
      }
    },
    // 收藏/取消收藏歌手
    follow () {
      let singer = this.singer
      let follow = !singer.followed
      follow = follow ? 1 : 0 // 1代表收藏，0代表不收藏
      if (!follow) {
        this.$utils.alertConfirm({
          message: '确定取消关注该歌手',
          confirmButtonText: '确定'
        }).then(() => {
          userApi.updateFollowSinger(singer.id, follow).then(res => {
            if (res.data.code === ERR_OK) {
              this.$set(singer, 'followed', false)
              this.$toast('已取消关注')
            } else {
              this.$toast(res.data.message)
            }
          }).catch(err => {
            this.$toast(err.data.message)
          })
        }).catch(() => { })
      } else {
        userApi.updateFollowSinger(singer.id, follow).then(res => {
          if (res.data.code === ERR_OK) {
            this.$set(singer, 'followed', true)
            this.$set(singer, 'followDay', '已关注1天')
            this.$toast('关注成功')
          } else {
            this.$toast(res.data.message)
          }
        }).catch(err => {
          this.$toast(err.data.message)
        })
      }
    }

  },
  components: {
    SingerImage,
    SingerSong,
    SingerAlbum,
    SingerDesc,
    Position,
    Scroll,
    overlay,
    SingerMv,
    Follow,
    MyImage
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-info-container>>>.scroll {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.singer-info-container>>>.van-skeleton {
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.singer-info-container>>>.van-skeleton__row {
  margin: 0 auto;
}

.singer-info-container>>>.van-skeleton__avatar {
  margin: 0 0 0.2rem 0;
}

.van-skeleton__avatar+.van-skeleton__content {
  padding: 0;
}

.singer-info-container>>>.van-skeleton__row:nth-child(1) {
  width: 60% !important;
  margin: 0.8rem auto 0.3rem;
  height: 0.6rem;
}

.singer-info-container>>>.van-skeleton__row:nth-child(2) {
  width: 35% !important;
  margin: 0 auto 0.35rem;
  height: 0.5rem;
}

.singer-info-container>>>.van-skeleton__row:nth-child(3) {
  margin: 0 auto 0.2rem;
  height: 0.5rem;
}

.singer-info-container>>>.van-skeleton__row:nth-child(4) {
  height: 0.8rem;
  background-color: transparent;
}

.singer-info-container>>>.van-tabs__wrap {
  margin-bottom: 0.25rem;
}

.singer-info-container>>>.van-tabs {
  margin-top: 3.8rem;
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

.singer-info-container>>>.album-list-container {
  .list {
    .item:first-child {
      .album-container {
        padding-top: 0;
      }
    }

    .item:last-child {
      margin-bottom: 0.15rem;
    }
  }
}

.singer-info-container {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $color-common-background;

  >.content {
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

      .singer-card-container {
        width: 100%;
        position: absolute;
        top: 6.7rem;
        padding: 0 0.4rem;
        transform: translateY(-1rem);
        box-sizing: border-box;

        .singer-card {
          padding: 0.3rem 0.4rem;
          height: 100%;
          background-color: rgb(255, 255, 255);
          text-align: center;
          box-sizing: border-box;
          border-radius: 0.3rem;
          box-shadow: 0 0.12rem 0.2rem rgba(0 0 0 5%);

          .content {
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;

            .singer-avatar {
              position: absolute;
              width: 1.6rem;
              height: 1.6rem;
              top: -0.3rem;
              left: 50%;
              transform: translate(-50%, -50%);
              display: flex;
              justify-content: center;
              border-radius: 50%;
            }

            .singer-name {
              font-weight: bold;
              font-size: $font-size-small;
              height: 1rem;
              line-height: 1rem;
              no-wrap();
            }

            .singer-desc {
              margin-bottom: 0.3rem;
              no-wrap();
            }

            .follow {
              display: flex;
              justify-content: center;
            }

            .follows {
              margin-bottom: 0.3rem;
            }

            .follows, .singer-desc {
              color: $color-common-b2;
              height: 0.5rem;
              line-height: 0.5rem;
              font-size: $font-size-smaller-x;
            }
          }
        }
      }
    }
  }
}
</style>