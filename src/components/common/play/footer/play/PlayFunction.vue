<template>
  <div class="function-container">
    <div class="love icon">
      <i class="iconfont icon-icon-test"></i>
    </div>
    <div class="recomment icon"
         @click="handleRecommentClick">
      <van-icon name="more-o"
                info="99+" />
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    // 点击评论
    handleRecommentClick () {
      this.$router.push('/songComment')
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