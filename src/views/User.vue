<template>
  <div class="user-container">
    <header :style="backgroundImage">
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
          {{user.nickname}}
        </div>

        <div class="no-login"
             v-else>
          <van-button plain
                      :to="{name:'index'}"
                      type="info"
                      color="#fd4979">未登录</van-button>
        </div>
        <div class="logout"
             v-if="user">
          <div class="icon">
            <i class="iconfont icon-tuichu"></i>
          </div>
          <div class="text"
               @click="logout">退出登录</div>
        </div>
        <div class="edit"
             v-if="user">
          <div class="text"
               @click="handleEdit">编辑</div>
        </div>
      </div>
    </header>
    <section>
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
        <van-loading size="24px"
                     color="#FD4979"
                     class="load"
                     vertical>加载中...</van-loading>
      </template>
    </section>

  </div>
</template>
<script>
import NoResult from '@/components/common/NoResult'
import AlbumList from '@/components/home/singer/albumList/AlbumList'
import SongSheetMiniList from '@/components/home/songSheet/songSheetMini/SongSheetMiniList'
import userApi from '@/api/user.js'
import loginApi from '@/api/login.js'
import {
  ERR_OK
} from '@/api/config.js'
import { USER_TOKEN } from 'common/js/config.js'
import { clearItem } from 'common/js/localStorage.js'
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

  computed: {
    ...mapState(['user', 'userLikeList']),
    backgroundImage () {
      return {
        backgroundImage: `url(http://p1.music.126.net/WLTBvNL_l9ZKlslFwaCM9Q==/109951163792144631.jpg)`
      }
    },
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
  inject: ['reload'],
  methods: {
    ...mapMutations(['setLoginUser', 'setUserLikeList', 'setToken', 'setIsAdvance']),
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
    // 退出登录
    logout () {
      this.utils.alertConfirm({ message: '确定要退出登录吗', confirmButtonText: '退出' }).then(() => {
        loginApi.logout().then(res => {
          if (res.data.code === ERR_OK) {
            // 清空用户所有信息
            clearItem(USER_TOKEN)
            this.setLoginUser(null)
            this.setUserLikeList(null)
            this.setToken(null)
            // 添加不缓存路由
            this.$store.commit('setAddNoCacheComponents', 'user')
            this.reload()// 刷新页面
          }
        })
      }).catch(() => { })
    },
    // 点击跳转到编辑页面
    handleEdit () {
      // 设置为前进页面
      this.setIsAdvance(true)
      this.$router.push('/user/edit')
    }

  },
  components: {
    SongSheetMiniList,
    AlbumList,
    NoResult
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.user-container {
  width: 100%;
  min-height: 100vh;
  background-color: $color-common-background;

  header {
    position: relative;
    width: 100%;
    padding-bottom: 5.4rem;
    height: 0;
    background-color: #f4f4f4;
    box-sizing: border-box;

    .header-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 5.4rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .avatar {
        position: relative;
        width: 2rem;
        height: 0;
        padding-bottom: 2rem;
        margin-bottom: 0.5rem;
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
          border: 1px solid $color-common;
          background: #fff;
        }
      }

      .nikeName {
        max-width: 8rem;
        height: 0.9rem;
        line-height: 0.9rem;
        color: #fff;
        font-weight: bold;
        font-size: $font-size-large-x;
        no-wrap();
      }

      .logout {
        position: absolute;
        right: 0.2rem;
        top: 0.25rem;
        height: 1rem;
        line-height: 1rem;
        color: #fff;
        display: flex;

        .icon {
          .iconfont {
            font-size: $font-size-small;
          }
        }

        .text {
          font-size: $font-size-smaller;
        }
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

      .edit {
        margin-top: 0.4rem;

        .text {
          padding: 0.15rem 0.3rem;
          border-radius: 0.5rem;
          font-size: $font-size-small-x;
          background: #e3e3e3;
          text-align: right;
          color: #fff;
        }
      }
    }
  }

  section {
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
</style>
