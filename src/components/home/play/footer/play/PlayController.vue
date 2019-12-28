<template>
  <div class="play-controller-container">
    <!-- 播放类型 -->
    <div class="play-type icon">
      <i class="iconfont icon-xunhuanbofang"></i>
    </div>
    <!-- 上一首 -->
    <div class="prev icon">
      <i class="iconfont icon-shangyishoushangyige"></i>
    </div>
    <!-- 播放暂停 -->
    <div class="play icon">
      <i class="iconfont icon-zanting"></i>
    </div>
    <!--下一曲-->
    <div class="next icon">
      <i class="iconfont icon-xiayigexiayishou"></i>
    </div>
    <!-- 播放列表 -->
    <div class="play-list icon">
      <i class="iconfont icon-bofangliebiao"></i>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.play-controller-container {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .icon {
    i {
      color: $color-common;
      font-size: 0.65rem;
    }
  }

  .play {
    display: flex;
    justify-content: center;
    align-items: center;
    color: red;
    background: $color-common;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;

    i {
      font-size: 0.8rem;
      color: #fff;
    }
  }
}
</style>