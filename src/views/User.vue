<template>
  <div class="user-container">
    <header :style="backgroundImage">
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
                    :to="{name:'login'}"
                    size="small"
                    type="info"
                    color="#fd4979">未登录</van-button>
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
      <template v-if="!userSongSheet||!userAlbum">
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
import {
  ERR_OK
} from '@/api/config.js'
import { mapState } from 'vuex'
export default {
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
    }
  },
  watch: {
    user () {
      // 获取用户收藏的歌单
      this.getUserSongSheet(this.user.userId)
    }
  },
  mounted () {
    this.getUserCount()
    // 获取用户专辑
    this.getUserAlbum()
    if (this.user) {
      // 获取用户收藏的歌单
      this.getUserSongSheet(this.user.userId)
    }
  },
  methods: {
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    },
    // 选择专辑进入专辑详情
    selectItem (item) {
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    height: 0;
    background-color: #f4f4f4;

    .avatar {
      position: relative;
      width: 2rem;
      height: 0;
      margin-bottom: 0.3rem;
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
        border: 1px solid $color-common;
        background: #fff;
      }
    }

    .nikeName {
      color: #fff;
      font-weight: bold;
      font-size: $font-size-large;
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
            color: $color-common-b;
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
          color: $color-common-b;
        }
      }
    }
  }
}
</style>
