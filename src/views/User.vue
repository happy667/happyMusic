<template>
  <div class="user-container">
    <header :style="backgroundImage">
      <div class="back"
           @click="routerBack">
        <van-icon name="arrow-left" />
      </div>
      <div class="avatar"
           v-if="user">
        <img :src="user.avatarUrl">
      </div>
      <div class="nikeName"
           v-if="user">
        {{user.nickname}}
      </div>
      <div class="no-login"
           v-if="!user">
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
              <div class="title">我的关注</div>
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
        <div class="my-recommend my-list-item">
          <div class="left-image">
            <van-icon name="gem" />
          </div>
          <div class="right-info">
            <div class="title">为您推荐</div>
          </div>
        </div>
      </div>
      <div class="my-song-sheet-list">
        <h1 class="title">收藏的歌单</h1>
      </div>
    </section>

  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['user', 'userLikeList']),
    backgroundImage () {
      return {
        backgroundImage: `url(http://p1.music.126.net/WLTBvNL_l9ZKlslFwaCM9Q==/109951163792144631.jpg)`
      }
    },
    myLikeCount () {
      return this.userLikeList ? this.userLikeList.length + '首' : ''
    }
  },
  methods: {
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.user-container {
  width: 100%;
  height: 100vh;
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

      img {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
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

    .my-song-sheet-list {
      .title {
        height: 1rem;
        line-height: 1rem;
        font-size: $font-size-smaller;
        font-weight: bold;
      }
    }
  }
}
</style>
