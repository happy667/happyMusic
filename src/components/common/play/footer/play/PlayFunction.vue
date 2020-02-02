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
  display: flex;
  justify-content: space-evenly;
  align-items: center;

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