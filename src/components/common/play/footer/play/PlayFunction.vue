<template>
  <div class="function-container">
    <div class="love icon"
         @click="selectItemLove">
      <i class="iconfont"
         :class="loveIcon"></i>
    </div>
    <div class="recomment icon"
         @click="handleRecommentClick">
      <van-icon name="more-o" />
    </div>
  </div>
</template>
<script>
import userApi from '@/api/user.js'
import {
  ERR_OK
} from '@/api/config.js'
import { mapGetters, mapMutations, mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['user']),
    ...mapGetters(['currentSong']),
    loveIcon () {
      return this.currentSong.isLike ? 'icon-aixin' : 'icon-icon-test'
    }
  },
  methods: {
    ...mapMutations(['setPlayerFullScreen']),
    // 点击评论
    handleRecommentClick () {
      this.setPlayerFullScreen(false)
      this.$router.push(`/songComment/${this.currentSong.id}`)
    },
    // 选中歌曲喜欢
    selectItemLove () {
      // 判断是否登录
      if (!this.user) { // 弹窗提示去登录
        this.alertConfirm()
      } else { // 添加或取消喜欢音乐
        this.likeMusic(this.currentSong)
      }
    },
    alertConfirm () {
      this.$Dialog.confirm({
        message: '请登陆后再操作!',
        confirmButtonColor: '#FD4979',
        confirmText: '去登陆',
        width: '265px'
      }).then(() => {
        this.$router.push({ name: 'login' })
        return true
      })
    },
    // 喜欢音乐
    async likeMusic (song) {
      let like = !song.isLike
      console.log(like)
      const { data: res } = await userApi.likeMusic(song.id, like)
      if (res.code === ERR_OK) {
        this.currentSong.isLike = like
      }
    }

  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.function-container {
  margin-top: 0.3rem;
  display: flex;
  justify-content: space-evenly;
  height: 1.2rem;

  .icon {
    i {
      color: $color-common;
      font-size: 0.7rem;
    }
  }

  .van-info {
    background-color: $color-common;
  }
}
</style>