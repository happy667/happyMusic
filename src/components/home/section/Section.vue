<template>
  <div class="navBar-container"
       ref="navBar">
    <!-- 头部导航栏 -->
    <van-tabs v-model="currentIndex"
              @change="handleChange"
              title-active-color="#FD4979"
              color="#FD4979"
              animated
              swipeable>
      <!-- 推荐页 -->
      <van-tab title="推荐">
        <Recommend ref="recommend" />
      </van-tab>
      <!-- 排行页 -->
      <van-tab title="排行">
        <ranking ref="ranking" />
      </van-tab>
      <!-- 歌手页 -->
      <van-tab title="歌手">
        <singer ref="singer" />
      </van-tab>
      <!-- 搜索页 -->
      <van-tab title="MV">
        <video-list ref="mv" />
      </van-tab>
      <!-- logo -->
      <template #nav-left>
        <div class="logo"
             :class="user?'active':''"
             @click="goToMyHome">
          <div class="image">
            <img v-lazy="image">
          </div>

        </div>
      </template>
      <!-- 搜索 -->
      <template #nav-right>

        <div class="search"
             @click="handleSearchClick">
          <van-icon name="search" />
        </div>
      </template>
    </van-tabs>
  </div>
</template>
<script>
import Recommend from '@/components/home/recommend/Recommend'
import Ranking from '@/components/home/ranking/Ranking'
import Singer from '@/components/home/singer/Singer'
import VideoList from '@/components/home/video/VideoList'
import { playlistMixin } from '@/assets/common/js/mixin.js'
import { mapState, mapMutations } from 'vuex'
export default {
  mixins: [playlistMixin],
  computed: {
    ...mapState(['oldVideo', 'user']),
    currentIndex: {
      get () {
        return this.$store.state.homeCurrentIndex
      },
      set (index) {
        this.$store.commit('setHomeCurrentIndex', index)
      }
    },
    image () {
      return this.user ? this.user.avatarUrl : require('@/assets/images/logo.png')
    }
  },
  methods: {
    ...mapMutations(['setSearchKeywords', 'setIsAdvance']),
    handleChange () {
      this.handlePlaylist(this.playList)
      if (this.currentIndex === 3) return
      if (this.oldVideo.$data && this.oldVideo.$data.isPlay) {
        this.oldVideo.pauseCurrentVideo()
      }
    },
    handlePlaylist (playList) {
      // 适配播放器与页面底部距离
      const bottom = playList.length > 0 ? '1.6rem' : ''
      this.$nextTick(() => {
        switch (this.currentIndex) {
          case 0:
            this.$refs.recommend.$refs.container.style.paddingBottom = bottom
            this.$refs.recommend.refresh()
            break
          case 1:
            this.$refs.ranking.$refs.container.style.paddingBottom = bottom
            this.$refs.ranking.refresh()
            break
          case 2:
            this.$refs.singer.$refs.list.$refs.container.style.paddingBottom = bottom
            this.$refs.singer.$refs.list.refresh()
            break
          case 3:
            this.$refs.mv.$refs.container.style.paddingBottom = bottom
            this.$refs.mv.refresh()
            break
        }
      })
    },

    // 点击搜索跳转搜索页面
    handleSearchClick () {
      // 清空搜索内容
      this.setSearchKeywords('')
      this.$router.push('/search/searchPage')
    },
    goToMyHome () {
      // 不设置为前进页面
      this.setIsAdvance(false)
      this.$router.push('/user')
    }
  },
  components: {
    Recommend,
    Ranking,
    Singer,
    VideoList
  }

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.navBar-container>>>.logo {
  margin-right: 0.3rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .image {
    img {
      display: block;
      width: 0.65rem;
    }
  }

  &.active {
    margin-right: 0;

    .image {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }
}

.navBar-container>>>.van-tabs__wrap {
  height: 1.5rem !important;
}

.navBar-container>>>.van-tab {
  line-height: 1.5rem;
}

.navBar-container>>>.search {
  margin-left: 0.3rem;
  width: 1rem;
  height: 100%;
  line-height: 1.5rem;
  font-size: $font-size-small;
  text-align: center;
}

.navBar-container {
  padding: 0 0.3rem;
}
</style>