<template>
  <div class="function-container">
    <!-- 倍速播放 -->
    <div class="song-speed icon"
         @click="handleSongSpeedClick">
      <i class="iconfont icon-speed"></i>
    </div>
    <!-- 关注 -->
    <div class="love icon"
         @click="selectItemLove">
      <i class="iconfont"
         :class="loveIcon"></i>
    </div>
    <!-- 视频 -->
    <div class="video icon"
         v-if="currentSong.mv"
         @click="handleVideoClick">
      <van-icon name="tv-o" />
    </div>
    <!-- 评论 -->
    <div class="comment icon"
         @click="handleCommentClick">
      <van-icon name="more-o" />
    </div>

  </div>
</template>
<script>
import userApi from '@/api/user.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  mapGetters,
  mapMutations,
  mapState
} from 'vuex'
export default {
  computed: {
    ...mapState(['user']),
    ...mapGetters(['currentSong']),
    loveIcon () {
      return this.currentSong.isLike ? 'icon-aixin' : 'icon-icon-test'
    }
  },
  methods: {
    ...mapMutations(['setPlayerFullScreen', 'setAddNoCacheComponents', 'setIsPlayerClick', 'setSongSpeedPopup']),
    // 点击评论
    handleCommentClick () {
      // 设置从播放器页面点击
      this.setIsPlayerClick(true)
      // 添加不缓存路由
      this.setAddNoCacheComponents('songComment')
      this.setPlayerFullScreen(false)
      if (this.$route.path !== `/songComment/${this.currentSong.id}`) {
        this.$router.push(`/songComment/${this.currentSong.id}`)
      }
    },
    // 点击tv
    handleVideoClick () {
      // 设置从播放器页面点击
      this.setIsPlayerClick(true)
      // 添加不缓存路由
      this.setAddNoCacheComponents('videoInfo')
      this.setPlayerFullScreen(false)
      if (this.$route.path !== `/videoInfo/${this.currentSong.mv}`) {
        this.$router.push(`/videoInfo/${this.currentSong.mv}`)
      }

    },
    // 选中歌曲喜欢
    selectItemLove () {
      // 判断是否登录
      if (!this.user) { // 弹窗提示去登录
        this.$utils.alertLogin(this.$router.currentRoute.fullPath)
      } else { // 添加或取消喜欢音乐
        this.likeMusic(this.currentSong)
      }
    },
    // 喜欢音乐
    likeMusic (song) {
      let like = !song.isLike
      userApi.likeMusic(song.id, like).then(res => {
        if (res.data.code === ERR_OK) {
          console.log(like)
          // 同步喜欢状态
          this.$set(this.currentSong, 'isLike', like)
        } else {
          this.$toast(res.data.message)
        }
      }).catch(err => {
        this.$toast(err.data.message)
      })
    },
    handleSongSpeedClick () {
      this.setSongSpeedPopup(true);
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.function-container {
  display: flex;
  justify-content: space-evenly;
  height: 1.45rem;

  .icon {
    i {
      color: #fff;
      font-size: 0.7rem;
    }

    .icon-aixin {
      color: $color-common;
    }
  }

  .van-info {
    background-color: $color-common;
  }
}
</style>