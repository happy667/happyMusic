<template>
  <div class="album-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar :title="$route.meta.title" left-arrow @click-left="routerBack" />
    </van-sticky>
    <!-- 专辑头部 -->
    <div class="album-header" :style="loadBgStyle">
      <section class="album-info" v-if="albumObj.album">
        <div class="container">
          <div class="left-img" @click="openOverlay">
            <div class="album-image">
              <div class="image">
                <img v-lazy="albumObj.album.picUrl" class="animated fadeIn" :key="albumObj.album.picUrl" />
              </div>
              <div class="digital-album"></div>
              <div class="public-time">{{albumObj.album.publishTime|convertDate}}</div>
            </div>

          </div>
          <div class="right-info">
            <div class="album-name">{{albumObj.album.name}}</div>
            <div class="album-singer" @click="selectSingers">歌手:{{albumObj.album.singers}}

            </div>
            <div class="func">
              <div class="func-item" @click="handleClickFollow">
                <div class="icon" :class="followCls">
                  <van-icon :name="followIcon" />
                </div>
                {{followText}}
              </div>
              <div class="func-item" @click="goToAlbumComment">
                <div class="icon">
                  <van-icon name="more-o" />
                </div>
                <div class="num">{{albumObj.commentCount|convertCount}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 背景 -->
        <div class="bg" v-lazy:background-image="albumObj.album.blurPicUrl" v-if="albumObj.album.blurPicUrl"></div>
      </section>
    </div>

    <section>
      <scroll ref="album_scroll">
        <div class="container" ref="container">
          <!-- 专辑简介 -->
          <div class="album-desc" @click="openOverlay">
            <section class="content">
              <van-skeleton title :row="2" title-width="30%" :loading="!albumObj.album" row-width="100%">
                <p>简介:</p>
                <p v-if="albumObj.album" v-html="albumObj.album.description"></p>
              </van-skeleton>
            </section>
          </div>
          <template v-if="albumObj.album">
            <!-- 歌曲列表 -->
            <div class="play-list" v-if="albumObj.songs&&albumObj.songs.length!==0">
              <div class="play">
                <play-all :length="albumObj.songs.length" @play="playAllSong(albumObj.songs)"></play-all>
                <!-- 歌曲列表 -->
                <songs-list :songsList="albumObj.songs" showIndex @select="selectSong"></songs-list>

              </div>

            </div>
          </template>
          <!-- loading -->
          <loading :loading="!albumObj.songs"></loading>
        </div>
      </scroll>
    </section>

    <no-result v-if="albumObj.songs&&albumObj.songs.length===0" text="暂无相关资源"></no-result>
    <!-- 上拉提示框 -->
    <template v-if="albumObj.album&&albumObj.album.singerList.length!==0">
      <singer-popup :list="albumObj.album.singerList" :showPopup="showSingerPopup" @closePopup="showSingerPopup=false"
        @finishedLoadImage="handleFinished" @clickListItem="clickListItem" :isLoadImage="isLoadImage"></singer-popup>
    </template>
    <!-- 遮罩层 -->
    <van-overlay :show="showOverlay" v-if="albumObj.album" class="overlay-container">
      <div class="container" @click="closeOverlay" @touchmove.stop>
        <div class="top">
          <div class="image-container">
            <div class="image">
              <img v-lazy="albumObj.album.picUrl" class="animated fadeIn">
            </div>
          </div>

          <p class="title">{{albumObj.album.name}}</p>
        </div>
        <div class="bottom">
          <article class="description">
            <p class="company">发行公司: {{albumObj.album.company}}</p>
            <p class="subType">专辑类别: {{albumObj.album.subType}}</p>
            <div class="content" v-html="albumObj.album.description"></div>
          </article>
        </div>

      </div>
      <!-- 背景 -->
      <div class="bg" v-lazy:background-image="albumObj.album.blurPicUrl" v-if="albumObj.album.blurPicUrl">
      </div>
      <div class="close" @click="closeOverlay">
        <div class="icon">
          <i class="iconfont icon-cha"></i>
        </div>
      </div>
    </van-overlay>
  </div>
</template>
<script>
  import 'common/js/convert.js'
  import Scroll from '@/components/common/Scroll'
  import SongsList from '@/components/home/song/SongList'
  import singerApi from '@/api/singer.js'
  import userApi from '@/api/user.js'
  import Song from '@/assets/common/js/song.js'
  import Album from '@/assets/common/js/album.js'
  import Singer from '@/assets/common/js/singer.js'
  import AlbumDetail from '@/assets/common/js/albumDetail.js'
  import NoResult from '@/components/common/NoResult'
  import PlayAll from '@/components/common/PlayAll'
  import SingerPopup from '@/components/common/SingerPopup'
  import {
    ERR_OK
  } from '@/api/config.js'
  import {
    mapMutations,
    mapGetters,
    mapState
  } from 'vuex'
  import {
    playlistMixin
  } from '@/assets/common/js/mixin.js'

  export default {
    name: 'singerAlbum',
    props: {
      id: String
    },
    mixins: [playlistMixin],
    data() {
      return {
        albumObj: {}, // 专辑对象
        showSingerPopup: false, // 显示歌手弹出层
        followed: false,
        showOverlay: false // 是否显示遮罩层
      }
    },
    computed: {
      ...mapState(['user']),
      ...mapGetters(['currentSong']),
      followIcon() {
        return this.followed ? 'like' : 'like-o'
      },
      followCls() {
        return this.followed ? 'followed' : ''
      },
      followText() {
        return this.followed ? '已收藏' : '收藏'
      },
      loadBgStyle() {
        return !this.albumObj.songs ? "background:#f2f3f5" : ''

      },
      // 是否要加载图片
      isLoadImage: {
        get() {
          return this.$store.state.isLoadAlbumInfoImage
        },
        set(val) {
          this.$store.commit('setIsLoadAlbumInfoImage', val)
        }
      }
    },
    watch: {
      showSingerPopup() {
        if (this.showSingerPopup) {
          this.setHideMiniPlayer(true)
        } else {
          this.setHideMiniPlayer(false)
        }
      }
    },
    mounted() {
      // 获取专辑详情
      this.getAlbumInfo(this.id)
      // 获取用户收藏的专辑
      if (this.user) {
        this.getUserAlbum()
      }
      this.isLoadImage = true
    },
    methods: {
      ...mapMutations(['setSingerCurrentIndex', 'setHideMiniPlayer']),
      routerBack() {
        this.$route.meta.isBack = true
        this.$utils.routerBack()
      },
      handlePlaylist(playList) {
        // 适配播放器与页面底部距离
        const bottom = playList.length > 0 ? '1.5rem' : ''
        this.$nextTick(() => {
          if (this.$refs.container) {
            this.$refs.container.style.paddingBottom = bottom
            this.$refs.album_scroll.refresh()
          }
        })
      },
      // 选择歌曲
      selectSong(item, index) {
        // 比较两首歌曲
        let result = this.$utils.compareSong(this.currentSong, item)
        if (!result) {
          // 引入vue原型上的utils
          this.$utils.playMusic(item, this.albumObj.songs, index)
        }
      },
      // 比较两首歌曲
      playAllSong(list) {
        // 引入vue原型上的utils
        this.$utils.playAllSong(list)
      },

      // 获取专辑详情
      async getAlbumInfo(id) {
        try {
          const {
            data: res
          } = await singerApi.getAlbumInfo(id)
          if (res.code === ERR_OK) {
            let songList = []
            res.songs.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
              let singers = item.ar.map(item => item.name).join('/')
              // 处理歌手
              let singersList = this.handleSingerList(item.ar)
              songList.push(new Song({
                id: item.id,
                name: item.alia.length > 0 ? `${item.name} (${item.alia.join('/')})` : item.name,
                singers,
                singersList,
                picUrl: item.al.picUrl,
                st: item.privilege.st,
                mv: item.mv,
                album: new Album({
                  id: item.al.id,
                  name: item.al.name,
                  picUrl: item.al.picUrl
                })
              }))
            })

            // 处理专辑歌手名称
            let singers = res.album.artists.map(item => item.name).join('/')
            // 处理歌手
            let singerList = this.handleSingerList(res.album.artists)
            let album = new AlbumDetail({
              id: res.album.id,
              name: res.album.alias.length > 0 ? `${res.album.name} (${res.album.alias.join('/')})` : res.album.name,
              subType: res.album.subType,
              company: res.album.company,
              publishTime: res.album.publishTime,
              picUrl: res.album.picUrl,
              blurPicUrl: res.album.blurPicUrl,
              description: res.album.description,
              singers,
              singerList
            })
            console.log(album)
            this.$set(this.albumObj, 'songs', songList)
            this.$set(this.albumObj, 'commentCount', res.album.info.commentCount)
            this.$set(this.albumObj, 'album', album)

            // 适配页面底部
            this.handlePlaylist(this.playList)
          }
        } catch (e) {
          this.$router.replace('/')
        }
      },
      // 获取用户收藏专辑
      async getUserAlbum() {
        const {
          data: res
        } = await userApi.getUserAlbum()
        if (res.code === ERR_OK) {
          console.log(res)
          let list = res.data
          let id = parseInt(this.id) // 转换成整数类型
          let item = list.find(item => item.id === id)
          this.followed = !!item
        }
      },

      handleClickFollow() {
        if (this.user) { // 说明已经登录
          this.follow() // 收藏/取消收藏专辑
        } else { // 弹窗提示去登录
          this.$utils.alertLogin(this.$router.currentRoute.fullPath)
        }
      },
      // 收藏/取消收藏专辑
      follow() {
        let follow = !this.followed
        follow = follow ? 1 : 0 // 1代表收藏，0代表不收藏
        if (follow) { // 收藏
          userApi.updateFollowAlbum(this.id, follow).then(res => {
            if (res.data.code === ERR_OK) {
              this.followed = true
              this.$toast('收藏成功')
            }
          }).catch(err => {
            this.$toast(err.data.message)
          })
        } else {
          this.$utils.alertConfirm({
            message: '确定不再收藏该专辑',
            confirmButtonText: '不再收藏'
          }).then(async () => {
            userApi.updateFollowAlbum(this.id, follow).then(res => {
              if (res.data.code === ERR_OK) {
                this.followed = false
                this.$toast('已不再收藏')
              }
            }).catch(err => {
              this.$toast(err.data.message)
            })
          }).catch(() => { })
        }
      },
      // 处理歌手列表
      handleSingerList(list) {
        let newList = []
        list.forEach(item => {
          newList.push(new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            picUrl: item.picUrl
          }))
        })
        return newList
      },
      // 跳转到专辑评论列表
      goToAlbumComment() {
        this.$route.meta.isBack = false
        this.$router.push(`/albumComment/${this.id}`)
      },
      // 打开遮罩层
      openOverlay() {
        if (!this.albumObj.album) return
        this.showOverlay = true
        this.setHideMiniPlayer(true)
        // 不让页面滚动
        document.body.style.overflow = 'hidden'
      },
      // 关闭遮罩层
      closeOverlay() {
        this.showOverlay = false
        this.setHideMiniPlayer(false)
        document.body.style.overflow = ''
      },
      // 选择歌手
      selectSingers() {
        let list = this.albumObj.album.singerList
        if (list.length === 1) { // 只有一个歌手直接跳转到歌手页面
          this.setSingerCurrentIndex(0)
          this.$router.push(`/singerInfo/${list[0].id}`)
        } else {
          this.showSingerPopup = true
        }
      },
      // 选择列表中歌手
      clickListItem() {
        this.showSingerPopup = false
      },
      // 数据获取完成
      handleFinished() {
        this.isLoadImage = false
      }
    },
    components: {
      SongsList,
      NoResult,
      SingerPopup,
      Scroll,
      PlayAll
    }
  }
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable';

  .album-container>>>.list-box {
    position: relative;
    flex: 1;
  }

  .album-container>>>.scroll {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .album-container>>>.van-skeleton {
    padding: 0;
  }

  .album-container>>>.van-skeleton__row {
    margin: 0.2rem 0;
    width: 100% !important;
    height: 0.4rem;
    line-height: 0.4rem;
  }

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background-color: #161824;
    width: 100%;
    height: 100%;
    transition: background-image 0.6s;
    background: no-repeat 50% / cover;
    transform-origin: center center;
    filter: blur(20px);
    transform: scale(1.5);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, .35);
    }
  }

  .album-container {
    position: fixed;
    width: 100%;
    height: 100%;
    background: $color-common-background;
    display: flex;
    flex-direction: column;

    .album-header {
      position: relative;
      padding-bottom: 4rem;
      overflow: hidden;

      .album-info {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0.9rem 0.4rem 0.5rem;
        box-sizing: border-box;

        .container {
          display: flex;

          .left-img {
            position: relative;
            margin-right: 0.5rem;

            .album-image {
              position: relative;
              width: 2.5rem;
              height: 2.5rem;
              border-radius: 0.2rem;

              .image {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: 3;
                background: $color-common-b;
                border-radius: 0.2rem;

                img {
                  display: block;
                  width: 100%;
                  height: 100%;
                  border-radius: 0.2rem;
                }
              }

              .digital-album {
                position: absolute;
                top: -17%;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000;
                border-radius: 50%;
                z-index: 2;
              }

              .public-time {
                position: absolute;
                bottom: 0;
                right: 0;
                color: #fff;
                font-size: 0.28rem;
                line-height: 0.5rem;
                border-radius: 0.2rem 0 0.2rem 0;
                z-index: 3;
                padding: 0.07rem 0.15rem;
                font-size: $font-size-mini-x;
                background-color: rgba(0, 0, 0, .45);
              }
            }
          }

          .right-info {
            display: flex;
            width: 100%;
            flex-direction: column;
            justify-content: space-evenly;
            color: #fff;
            font-size: $font-size-smaller-x;
            no-wrap();

            .album-name {
              height: 0.6rem;
              line-height: 0.6rem;
              font-size: $font-size-smaller;
              font-weight: bold;
              no-wrap();
            }

            .album-singer {
              margin: 0.1rem 0;
              height: 0.6rem;
              line-height: 0.6rem;
              no-wrap();

              a {
                color: #fff;
              }
            }

            .func {
              display: flex;

              .func-item {
                display: flex;
                align-items: center;
                margin-right: 0.5rem;

                &:last-child {
                  margin-right: 0;
                }

                .icon {
                  margin-right: 0.05rem;

                  &.followed {
                    color: $color-common;
                  }
                }
              }

              .icon,
              .iconfont {
                font-size: 0.65rem;
              }
            }
          }
        }
      }
    }

    section {
      position: relative;
      flex: 1;

      .container {
        .album-desc {
          padding: 0.3rem 0.4rem 0 0.4rem;

          .content {
            no-wrap3();
            line-height: 0.5rem;
            color: $color-common-b2;
            font-size: $font-size-smaller-x;
          }
        }

        .play-list {
          padding-top: 0.3rem;
        }
      }
    }

    .overlay-container {
      top: 0;
      bottom: 0;
      overflow-y: scroll;
      overflow-x: hidden;
      z-index: 99;

      &::-webkit-scrollbar {
        display: none;
      }

      .container {
        position: absolute;
        top: 0;
        left: 0;
        padding: 1.5rem 0.5rem 1rem;
        width: 100%;
        min-height: 100%;
        box-sizing: border-box;
        color: #fff;

        .top {
          margin-bottom: 0.3rem;
          width: 100%;

          .image-container {
            margin-bottom: 0.5rem;

            .image {
              margin: 0 auto;
              width: 4.7rem;
              height: 4.7rem;
              border-radius: 0.1rem;

              img {
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 0.1rem;
              }
            }
          }

          .title {
            line-height: 0.7rem;
            text-align: center;
            font-size: $font-size-smaller;
          }
        }

        .bottom {
          font-size: $font-size-mini;

          .subType {
            height: 1rem;
            line-height: 1rem;
          }

          .content {
            line-height: 0.5rem;
            white-space: pre-wrap;
          }
        }
      }

      .bg {
        position: fixed;
      }

      .close {
        position: fixed;
        right: 0.5rem;
        top: 0.5rem;

        .icon {
          width: 1rem;
          height: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;

          i {
            color: #fff;
            font-size: $font-size-smaller;
          }
        }
      }
    }
  }
</style>