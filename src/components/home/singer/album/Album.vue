<template>
  <div class="album-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar title="专辑详情"
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
          <div class="top">
            <div class="left-img">
              <div class="album-image">
                <img v-lazy="albumObj.album.picUrl" />
              </div>
              <div class="public-time">{{albumObj.album.publishTime|convertTime}}</div>
            </div>
            <div class="right-info">
              <div class="album-name">{{albumObj.album.name}}</div>
              <div class="album-singer"
                   @click="selectSingers">歌手:{{albumObj.album.singers}}

              </div>
              <div class="func">
                <div class="func-item">
                  <div class="icon">
                     <van-icon name="like-o" />
                  </div>
                  收藏
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
        </section>
      </div>
      <!-- 专辑简介 -->
      <div class="album-desc"
           v-if="albumObj.album.description">
        <section class="content">
          <p>简介:</p>
          <p v-html="albumObj.album.description"></p>
        </section>
      </div>
    </template>
    <section class="play-list"
             v-if="albumObj.songs&&albumObj.songs.length!==0">
      <div class="play">
        <div class="play-icon">
          <van-icon name="play-circle-o" />
        </div>
        <div class="play-all"
             @click="playSong(albumObj.songs[0],0)">
          播放全部({{albumObj.songs.length}})
        </div>
      </div>
      <!-- 歌曲列表 -->
      <songs-list :songsList="albumObj.songs"
                  @select="playSong"></songs-list>

    </section>
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
  </div>
</template>
<script>
import 'common/js/convert.js'
import 'common/js/utils.js'
import SongsList from '@/components/home/song/SongList'
import singerApi from '@/api/singer.js'
import Song from '@/assets/common/js/song.js'
import Singer from '@/assets/common/js/singer.js'
import NoResult from '@/components/common/NoResult'
import SingerItem from '@/components/home/singer/SingerItem'
import {
  ERR_OK
} from '@/api/config.js'
import { mapMutations, mapGetters } from 'vuex'
export default {
  props: {
    id: String
  },
  data () {
    return {
      albumObj: {}, // 专辑对象
      showSingerPopup: false// 显示歌手弹出层
    }
  },
  computed: {
    ...mapGetters(['currentSong'])
  },
  mounted () {
    // 获取专辑详情
    this.getAlbumInfo(this.id)
  },
  methods: {
    ...mapMutations(['setPlayerFullScreen', 'setSingerCurrentIndex']),
    routerBack () {
      this.$router.back()
    },
    // 播放歌曲
    playSong (item, index) {
      // 判断点击的是否是当前播放的歌曲
      if (this.currentSong.id === item.id) {
        this.setPlayerFullScreen(true)
        return
      }
      // 引入vue原型上的utils
      this.utils.playMusic(item, this.albumObj.songs, index)
    },

    // 获取专辑详情
    async getAlbumInfo (id) {
      const { data: res } = await singerApi.getAlbumInfo(id)
      if (res.code === ERR_OK) {
        let songList = []
        res.songs.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
          let singers = item.ar.map(item => item.name).join('/')
          // 处理歌手
          let singersList = this.handleSingerList(item.ar)
          songList.push(new Song({ id: item.id, name: item.name, singers, singersList, picUrl: item.al.picUrl }))
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
      }
    },
    // 选择歌手
    selectSingers () {
      const list = this.albumObj.album.albumSingersList
      if (list.length === 1) { // 只有一个歌手直接跳转到歌手页面
        this.setSingerCurrentIndex(0)
        this.$router.push(`/singerInfo/${list[0].id}`)
      } else {
        console.log(11111111)
        this.showSingerPopup = true
        list.forEach(async item => { // 查询该歌手图片
          item.avatar = await this.getSingerImage(item.id)
        })
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
      return document.querySelector('.album-container')
    },
    // 选择歌手列表中歌手
    handleSelectSinger (item) {
      this.setSingerCurrentIndex(0)
      this.showSingerPopup = false
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
      this.$router.push(`/albumComment/${this.id}`)
    }
  },
  components: {
    SongsList,
    NoResult,
    SingerItem
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.album-container {
  background: $color-common-background;
  min-height: 100vh;

  .album-header {
    position: relative;
    height: 0;
    background-image: linear-gradient(160deg, #c4c4c4 60%, #fff 100%);
    padding-bottom: 3.1rem;

    .album-info {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      padding: 0.5rem;

      .top {
        display: flex;

        .left-img {
          position: relative;
          margin-right: 0.5rem;

          .album-image {
            width: 2.2rem;
            height: 2.2rem;
            border-radius: 0.3rem;

            img {
              display: block;
              width: 100%;
              height: 100%;
              border-radius: 0.3rem;
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
            height:0.75rem;
            line-height :0.75rem;
            font-size: $font-size-smaller;
            font-weight :bold;
          }

          .album-singer {
            height: 0.75rem;
            line-height: 0.75rem;

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
              }
            }

            .icon, .iconfont {
              font-size: 0.7rem;
            }
          }
        }
      }
    }
  }

  .album-desc {
    padding: 0.3rem 0.4rem;

    .content {
      no-wrap3();
      line-height: 0.5rem;
      color: #777;
      font-size: $font-size-smaller-x;
    }
  }

  .play-list {
    padding-top: 0.3rem;

    .play {
      display: flex;
      padding-left: 0.4rem;

      .play-icon {
        font-size: $font-size-small;
        color: $color-common;
        margin-right: 0.2rem;

        i {
          line-height: 0.8rem;
        }
      }

      .play-all {
        font-size: $font-size-smaller;
        height: 0.8rem;
        line-height: 0.8rem;
      }
    }
  }
}
</style>