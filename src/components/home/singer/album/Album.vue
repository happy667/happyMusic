<template>
  <div class="album-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar :title="$route.meta.title"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>
    <!-- loading -->
    <van-loading v-if="!albumObj.songs"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <template v-if="albumObj.album">
      <!-- 专辑头部 -->
      <div class="album-header">
        <section class="album-info">
          <div class="container">
            <div class="left-img">
              <div class="album-image">
                <img v-lazy="albumObj.album.picUrl"
                     class="animated fadeIn"
                     :key="albumObj.album.picUrl" />
              </div>
              <div class="public-time">{{albumObj.album.publishTime|convertDate}}</div>
            </div>
            <div class="right-info">
              <div class="album-name">{{albumObj.album.name}}</div>
              <div class="album-singer"
                   @click="selectSingers">歌手:{{albumObj.album.singers}}

              </div>
              <div class="func">
                <div class="func-item"
                     @click="handleClickFollow">
                  <div class="icon"
                       :class="followCls">
                    <van-icon :name="followIcon" />
                  </div>
                  {{followText}}
                </div>
                <div class="func-item"
                     @click="goToAlbumComment">
                  <div class="icon">
                    <van-icon name="more-o" />
                  </div>
                  <div class="num">{{albumObj.commentCount}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg">
            <div class="filter"></div>
            <div class="image"
                 :style="bgImage"></div>
          </div>
        </section>
      </div>

      <section>
        <scroll ref="album_scroll">
          <div class="container"
               ref="container">
            <!-- 专辑简介 -->
            <div class="album-desc"
                 v-if="albumObj.album.description"
                 @click="openOverlay">
              <section class="content">
                <p>简介:</p>
                <p v-html="albumObj.album.description"></p>
              </section>
            </div>
            <!-- 歌曲列表 -->
            <div class="play-list"
                 v-if="albumObj.songs&&albumObj.songs.length!==0">
              <div class="play">
                <play-all :length="albumObj.songs.length"
                          @play="playAllSong(albumObj.songs[0],albumObj.songs)"></play-all>
                <!-- 歌曲列表 -->
                <songs-list :songsList="albumObj.songs"
                            @select="selectSong"></songs-list>

              </div>

            </div>
          </div>
        </scroll>
      </section>
    </template>

    <no-result v-if="albumObj.songs&&albumObj.songs.length===0"
               text="暂无相关资源"></no-result>
    <!-- 上拉提示框 -->
    <van-popup v-model="showSingerPopup"
               round
               position="bottom"
               :get-container="getContainer">
      <div class="singerList"
           v-if="albumObj.album&&albumObj.album.albumSingersList.length!==0">
        <singer-item :singer="item"
                     @select="handleSelectSinger"
                     v-for="item in albumObj.album.albumSingersList"
                     :key="item.id"></singer-item>
      </div>
    </van-popup>
    <!-- 遮罩层 -->
    <van-overlay :show="showOverlay"
                 v-if="albumObj.album"
                 class="overlay-container">
      <div class="container"
           @click="closeOverlay"
           @touchmove.stop>
        <div class="top">
          <div class="image-container">
            <div class="image">
              <img v-lazy="albumObj.album.picUrl"
                   class="animated fadeIn">
            </div>
          </div>

          <p class="title">{{albumObj.album.name}}</p>
        </div>
        <div class="bottom">
          <article class="description">
            <p class="subType">专辑类别: {{albumObj.album.subType}}</p>
            <div class="content"
                 v-html="albumObj.album.description"></div>
          </article>
        </div>

      </div>
      <!-- 背景 -->
      <div class="bg"
           v-if="albumObj.album.blurPicUrl">
        <div class="filter"></div>
        <div class="image"
             :style="bgImage"></div>
      </div>
      <div class="close"
           @click="closeOverlay">
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
import Singer from '@/assets/common/js/singer.js'
import NoResult from '@/components/common/NoResult'
import SingerItem from '@/components/home/singer/SingerItem'
import PlayAll from '@/components/common/PlayAll'
import {
  ERR_OK
} from '@/api/config.js'
import { mapMutations, mapGetters, mapState } from 'vuex'
import { playlistMixin } from '@/assets/common/js/mixin.js'

export default {
  name: 'singerAlbum',
  props: {
    id: String
  },
  mixins: [playlistMixin],
  data () {
    return {
      albumObj: {}, // 专辑对象
      showSingerPopup: false, // 显示歌手弹出层
      followed: false,
      showOverlay: false// 是否显示遮罩层
    }
  },
  computed: {
    ...mapState(['user', 'isGetAlbumSingerImage']),
    ...mapGetters(['currentSong']),
    followIcon () {
      return this.followed ? 'like' : 'like-o'
    },
    followCls () {
      return this.followed ? 'followed' : ''
    },
    followText () {
      return this.followed ? '已收藏' : '收藏'
    },
    bgImage () {
      return {
        backgroundImage: `url(${this.albumObj.album.blurPicUrl})`
      }
    }
  },
  watch: {
    showSingerPopup () {
      if (this.showSingerPopup) {
        this.setHideMiniPlayer(true)
      } else {
        this.setHideMiniPlayer(false)
      }
    }
  },
  mounted () {
    // 获取专辑详情
    this.getAlbumInfo(this.id)
    // 获取用户收藏的专辑
    if (this.user) {
      this.getUserAlbum()
    }
    this.setIsGetAlbumSingerImage(false)
  },
  methods: {
    ...mapMutations(['setSingerCurrentIndex', 'setIsGetAlbumSingerImage', 'setHideMiniPlayer']),
    routerBack () {
      this.$route.meta.isBack = true
      this.$utils.routerBack()
    },
    handlePlaylist (playList) {
      // 适配播放器与页面底部距离
      const bottom = playList.length > 0 ? '1.6rem' : ''
      this.$nextTick(() => {
        if (this.$refs.container) {
          this.$refs.container.style.paddingBottom = bottom
          this.$refs.album_scroll.refresh()
        }
      })
    },
    // 选择歌曲
    selectSong (item, index) {
      // 比较两首歌曲
      let result = this.$utils.compareSong(this.currentSong, item)
      if (!result) {
        // 引入vue原型上的utils
        this.$utils.playMusic(item, this.albumObj.songs, index)
      }
    },
    // 比较两首歌曲
    playAllSong (item, list) {
      let result = this.$utils.compareSong(this.currentSong, item)
      if (!result) {
        // 引入vue原型上的utils
        this.$utils.playAllSong(list)
      }
    },

    // 获取专辑详情
    async getAlbumInfo (id) {
      try {
        const { data: res } = await singerApi.getAlbumInfo(id)
        if (res.code === ERR_OK) {
          let songList = []
          res.songs.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
            let singers = item.ar.map(item => item.name).join('/')
            // 处理歌手
            let singersList = this.handleSingerList(item.ar)
            songList.push(new Song({ id: item.id, name: item.name, singers, singersList, picUrl: item.al.picUrl, st: item.privilege.st, mv: item.mv }))
          })
          // 处理专辑歌手名称
          let albumSingers = res.album.artists.map(item => item.name).join('/')
          // 处理歌手
          let albumSingersList = this.handleSingerList(res.album.artists)
          res.album.singers = albumSingers
          res.album.albumSingersList = albumSingersList
          this.$set(this.albumObj, 'songs', songList)
          this.$set(this.albumObj, 'commentCount', res.album.info.commentCount)
          this.$set(this.albumObj, 'album', res.album)
          // 适配页面底部
          this.handlePlaylist(this.playList)
        }
      } catch (e) {
        this.$router.replace('/')
      }
    },
    // 获取用户收藏专辑
    async getUserAlbum () {
      const {
        data: res
      } = await userApi.getUserAlbum()
      if (res.code === ERR_OK) {
        console.log(res)
        let list = res.data
        let id = parseInt(this.id)// 转换成整数类型
        let item = list.find(item => item.id === id)
        this.followed = !!item
      }
    },

    handleClickFollow () {
      if (this.user) { // 说明已经登录
        this.follow() // 收藏/取消收藏专辑
      } else { // 弹窗提示去登录
        this.$utils.alertLogin(this.$router.currentRoute.fullPath)
      }
    },
    // 收藏/取消收藏专辑
    follow () {
      let follow = !this.followed
      follow = follow ? 1 : 0// 1代表收藏，0代表不收藏
      if (follow) { // 收藏
        userApi.updateFollowAlbum(this.id, follow).then(res => {
          if (res.data.code === ERR_OK) {
            this.followed = true
          }
        }).catch(err => {
          this.$toast(err.data.message)
        })
      } else {
        this.$utils.alertConfirm({ message: '确定不再收藏该专辑', confirmButtonText: '不再收藏' }).then(async () => {
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
    // 选择歌手
    selectSingers () {
      const list = this.albumObj.album.albumSingersList
      if (list.length === 1) { // 只有一个歌手直接跳转到歌手页面
        this.setSingerCurrentIndex(0)
        this.$router.push(`/singerInfo/${list[0].id}`)
      } else {
        console.log(123)
        this.showSingerPopup = true
        // 打开歌手遮罩层
        this.openSingerPopup()
        if (!this.isGetAlbumSingerImage) { // 判断是否获取过歌手图片
          list.forEach(async (item, index) => { // 查询该歌手图片
            item.avatar = await this.getSingerImage(item.id)
            if (index === list.length - 1) { // 如果index等于当前歌手列表长度-1就说明数据全部获取完毕
              this.setIsGetAlbumSingerImage(true)// 设置vuex已经获取过歌手图片
            }
          })
        }
      }
    },
    // 获取歌手图片
    async getSingerImage (id) {
      // 获取歌手
      const { data: res } = await singerApi.getSingerSong(id)
      if (res.code === ERR_OK) { // 成功获取歌手
        return res.artist.img1v1Url
      }
    },
    // 获取容器
    getContainer () {
      return document.querySelector('#app')
    },
    // 选择歌手列表中歌手
    handleSelectSinger (item) {
      this.setSingerCurrentIndex(0)
      // 关闭歌手遮罩层
      this.closeSingerPopup()
      this.$router.push(`/singerInfo/${item.id}`)
    },
    // 处理歌手列表
    handleSingerList (list) {
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
    goToAlbumComment () {
      this.$route.meta.isBack = false
      this.$router.push(`/albumComment/${this.id}`)
    },
    // 打开歌手遮罩层
    openSingerPopup () {
      this.showSingerPopup = true
    },
    // 关闭歌手遮罩层
    closeSingerPopup () {
      this.showSingerPopup = false
    },
    // 打开遮罩层
    openOverlay () {
      this.showOverlay = true
      this.setHideMiniPlayer(true)
      // 不让页面滚动
      document.body.style.position = 'absolute'
      document.body.style.overflow = 'hidden'
    },
    // 关闭遮罩层
    closeOverlay () {
      this.showOverlay = false
      this.setHideMiniPlayer(false)
      document.body.style.position = ''
      document.body.style.overflow = ''
    }
  },
  components: {
    SongsList,
    NoResult,
    SingerItem,
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

.album-container >>> .scroll {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
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
    height: 0;
    padding-bottom: 3.1rem;

    .album-info {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      padding: 0.5rem;

      .container {
        display: flex;
        height: 2.1rem;

        .left-img {
          position: relative;
          margin-right: 0.5rem;

          .album-image {
            width: 2.1rem;
            height: 2.1rem;
            border-radius: 0.3rem;

            img {
              display: block;
              width: 100%;
              height: 100%;
              border-radius: 0.3rem;
              background: $color-common-b;
            }
          }

          .public-time {
            position: absolute;
            bottom: 0.2rem;
            right: 0.2rem;
            color: #fff;
            font-size: 0.28rem;
          }
        }

        .right-info {
          width: 100%;
          color: #fff;
          font-size: $font-size-smaller-x;
          no-wrap();

          .album-name {
            height: 0.75rem;
            line-height: 0.75rem;
            font-size: $font-size-smaller;
            font-weight: bold;
            no-wrap();
          }

          .album-singer {
            height: 0.75rem;
            line-height: 0.75rem;
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

            .icon, .iconfont {
              font-size: 0.65rem;
            }
          }
        }
      }

      .bg {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: -1;
        overflow: hidden;

        .filter {
          position: absolute;
          width: 100%;
          height: 100%;
          background: $color-common-b2;
          opacity: 0.9;
        }

        .image {
          width: 100%;
          height: 100%;
          transition: background-image 0.4s;
          background: no-repeat 50% / cover;
          filter: blur(30px);
          transform: scale(1.5);
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
          color: #777;
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

    &::-webkit-scrollbar {
      display: none;
    }

    .container {
      position: absolute;
      top: 0;
      left: 0;
      padding: 1.4rem 0.5rem 1rem;
      width: 100%;
      min-height: 100%;
      box-sizing: border-box;
      color: #fff;
      z-index: 0;

      .top {
        margin-bottom: 0.3rem;
        width: 100%;

        .image-container {
          margin-bottom: 0.3rem;

          .image {
            margin: 0 auto;
            width: 4rem;
            height: 4rem;
            border-radius: 0.3rem;

            img {
              display: block;
              width: 100%;
              height: 100%;
              border-radius: 0.3rem;
            }
          }
        }

        .title {
          line-height: 0.7rem;
          text-align: center;
          font-size: $font-size-smaller-x;
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
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;

      .filter {
        position: fixed;
        width: 100%;
        height: 100%;
        background: $color-common-b2;
      }

      .image {
        width: 100%;
        height: 100%;
        background: no-repeat 50% / cover;
        filter: blur(140px);
      }
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