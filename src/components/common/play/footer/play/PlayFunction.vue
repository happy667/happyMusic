<template>
  <div class="function-container">
    <div class="love icon">
      <i class="iconfont icon-icon-test"></i>
    </div>
    <div class="recomment icon"
         @click="handleRecommentClick">
      <van-icon name="more-o" />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters(['currentSong'])
  },
  methods: {
    ...mapMutations(['setPlayerFullScreen']),
    // 点击评论
    handleRecommentClick () {
      this.setPlayerFullScreen(false)
      this.$router.push(`/songComment/${this.currentSong.id}`)
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