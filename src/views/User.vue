<template>
  <div class="user-container">
    <header>
      <div class="header-container">
        <div class="back"
             @click="routerBack">
          <van-icon name="arrow-left" />
        </div>
        <!-- 头像 -->
        <div class="avatar">
          <div class="image"
               v-if="user">
            <img :src="user.avatarUrl">
          </div>
          <div class="icon"
               v-else>
            <van-icon name="user-o" />
          </div>
        </div>
        <!-- 昵称 -->
        <div class="nikeName"
             v-if="user">
          <div class="text"> {{user.nickname}}</div>

        </div>

        <div class="no-login"
             v-else>
          <router-link :to="{name:'index'}">点击登录账户</router-link>
        </div>
        <div class="edit"
             v-if="user">
          <div class="icon"
               @click="handleEdit">
            <van-icon name="setting-o"
                      size="25" />
          </div>
        </div>
      </div>
    </header>
    <section>
      <scroll ref="user_scroll">
        <div class="user-index"
             ref="container">
          <div class="my-list">
            <router-link to="/user/myFollow">
              <div class="my-follow my-list-item">
                <div class="left-image">
                  <van-icon name="star" />
                </div>
                <div class="right-info">
                  <div class="title">收藏歌手</div>
                  <div class="num">{{followCount}}</div>
                </div>
              </div>
            </router-link>
            <router-link to="/user/myLike">
              <div class="my-like my-list-item">
                <div class="left-image">
                  <van-icon name="like" />
                </div>
                <div class="right-info">
                  <div class="title">我的最爱</div>
                  <div class="num">{{myLikeCount}}</div>
                </div>

              </div>
            </router-link>
            <router-link to="/user/recommend">
              <div class="my-recommend my-list-item">
                <div class="left-image">
                  <van-icon name="gem" />
                </div>
                <div class="right-info">
                  <div class="title">每日推荐</div>
                </div>
              </div>
            </router-link>
            <router-link to="/user/playRanking">
              <div class="play-music-ranking my-list-item">
                <div class="left-image">
                  <van-icon name="medal" />
                </div>
                <div class="right-info">
                  <div class="title">听歌排行</div>
                </div>
              </div>
            </router-link>

          </div>

          <template v-if="userSongSheet&&userAlbum">
            <div class="my-follow my-song-sheet-list">
              <div class="title">
                <div class="text">收藏的歌单</div>
                <span class="count">({{songSheetCount}}个)</span>
              </div>
              <song-sheet-mini-list :list="userSongSheet"></song-sheet-mini-list>
            </div>
            <div class="my-follow my-album-list">
              <div class="title">
                <div class="text">收藏的专辑</div>
                <span class="count">({{albumCount}}个)</span>
              </div>
              <template v-if="userAlbum.length!==0">
                <album-list :list="userAlbum"
                            @select="selectItem"></album-list>
              </template>
              <template v-if="userAlbum.length===0">
                <no-result text="还没有专辑,快去收藏吧"></no-result>
              </template>
            </div>
          </template>
          <template v-if="load">
            <!-- loading -->
            <loading />
          </template>
        </div>
      </scroll>
    </section>

  </div>
</template>
<script>
import Scroll from '@/components/common/Scroll'
import NoResult from '@/components/common/NoResult'
import AlbumList from '@/components/home/singer/albumList/AlbumList'
import SongSheetMiniList from '@/components/home/songSheet/songSheetMini/SongSheetMiniList'
import userApi from '@/api/user.js'
import { playlistMixin } from '@/assets/common/js/mixin.js'
import {
  ERR_OK
} from '@/api/config.js'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'user',
  data () {
    return {
      userCount: null,
      userSongSheet: null, // 用户歌单
      userAlbum: null// 用户专辑
    }
  },
  mixins: [playlistMixin],
  computed: {
    ...mapState(['user', 'userLikeList', 'currentPlayIndex']),
    myLikeCount () {
      return this.userLikeList ? this.userLikeList.length + '首' : ''
    },
    followCount () {
      return this.userCount ? this.userCount.artistCount + '个收藏' : ''
    },
    songSheetCount () {
      return this.userCount ? this.userCount.subPlaylistCount : 0
    },
    albumCount () {
      return this.userAlbum ? this.userAlbum.length : 0
    },
    load () {
      if (this.user) { // 判断是否登录
        if (!this.userSongSheet || !this.userAlbum) { // 判断是否加载完收藏专辑和歌单
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  },
  watch: {
    user () {
      if (this.user) {
        // 获取用户专辑歌单数量
        this.getUserCount()
        // 获取用户专辑
        this.getUserAlbum()
        // 获取用户收藏的歌单
        this.getUserSongSheet(this.user.userId)
      }
    }
  },
  mounted () {
    if (this.user) {
      // 获取用户专辑歌单数量
      this.getUserCount()
      // 获取用户专辑
      this.getUserAlbum()
      // 获取用户收藏的歌单
      this.getUserSongSheet(this.user.userId)
    }
  },

  methods: {
    ...mapMutations(['setIsAdvance', 'setHideMiniPlayer']),
    // 返回上一个路由
    routerBack () {
      // 设置为前进页面
      this.setIsAdvance(true)
      this.$router.push('/home')
    },
    // 选择专辑进入专辑详情
    selectItem (item) {
      // 设置为前进页面
      this.setIsAdvance(true)
      this.$router.push(`/singerAlbum/${item.id}`)
    },
    // 获取用户信息 , 歌单，收藏，mv, dj 数量
    async getUserCount () {
      const {
        data: res
      } = await userApi.getUserCount()
      if (res.code === ERR_OK) {
        this.userCount = res
      }
    },
    // 获取用户收藏的歌单
    async  getUserSongSheet (id) {
      const {
        data: res
      } = await userApi.getUserSongSheet(id)
      if (res.code === ERR_OK) {
        this.userSongSheet = res.playlist
      }
    },
    // 获取用户收藏专辑
    async getUserAlbum () {
      const {
        data: res
      } = await userApi.getUserAlbum()
      if (res.code === ERR_OK) {
        this.userAlbum = res.data
      }
    },

    // 点击跳转到编辑页面
    handleEdit () {
      // 如果有歌曲播放就隐藏迷你播放器
      if (this.currentPlayIndex !== -1) {
        this.setHideMiniPlayer(true)
      }
      // 设置为前进页面
      this.setIsAdvance(true)
      this.$router.push('/user/edit')
    },
    handlePlaylist (playList) {
      // 适配播放器与页面底部距离
      const bottom = playList.length > 0 ? '1.6rem' : ''
      this.$nextTick(() => {
        this.$refs.container.style.paddingBottom = bottom
        this.$refs.user_scroll.refresh()
      })
    }

  },
  components: {
    SongSheetMiniList,
    AlbumList,
    NoResult,
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.user-container>>> .scroll {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.user-container {
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $color-common-background;

  header {
    position: relative;
    width: 100%;
    padding-bottom: 6rem;
    height: 0;
    box-sizing: border-box;
    background-image: linear-gradient(-20deg, #f794a4 0%, #fdd6bd 100%);

    .header-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6rem;
      padding: 1.5rem 0 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;

      .avatar {
        position: relative;
        width: 2rem;
        height: 0;
        padding-bottom: 2rem;
        background: #f4f4f4;
        border-radius: 50%;

        .image, .icon {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;

          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .icon {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: $color-common;
          border-radius: 50%;
          border: 1px solid #fff;
          background: #fff;
        }
      }

      .nikeName {
        max-width: 8rem;
        height: 0.9rem;
        line-height: 0.9rem;
        no-wrap();

        .text {
          color: #fff;
          font-weight: bold;
          font-size: $font-size-large-x;
        }
      }

      .edit {
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
        color: #fff;
      }

      .back {
        position: absolute;
        left: 0.2rem;
        top: 0.25rem;
        width: 1rem;
        height: 1rem;
        font-size: $font-size-large;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .no-login {
        margin-top: 0.5rem;

        a {
          display: block;
          height: 1rem;
          line-height: 1rem;
          font-size: $font-size-small-x;
          color: #fff;
        }
      }
    }
  }

  section {
    position: relative;
    flex: 1;

    .user-index {
      padding: 0.4rem;

      .my-list {
        .my-list-item {
          display: flex;
          width: 100%;
          height: 1.7rem;
          margin-bottom: 0.3rem;
          box-shadow: 0 0 0.3rem rgba(0, 0, 0, 0.1);
          border-radius: 0.1rem;
          color: $color-common-x;

          .left-image {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1.7rem;
            height: 1.7rem;
            font-size: $font-size-large;
            color: $color-common;
          }

          .right-info {
            display: flex;
            justify-content: center;
            flex-direction: column;

            .title {
              height: 0.7rem;
              line-height: 0.7rem;
            }

            .num {
              color: $color-common-b2;
            }
          }
        }
      }

      .my-follow {
        .title {
          display: flex;
          height: 1rem;
          line-height: 1rem;

          .text {
            font-size: $font-size-smaller;
            font-weight: bold;
            margin-right: 0.1rem;
          }

          .count {
            color: $color-common-b2;
          }
        }
      }
    }
  }
}
</style>
