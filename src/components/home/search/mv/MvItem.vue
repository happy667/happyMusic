<template>
  <div class="mv-list-item-container">
    <!-- mv 图片 -->
    <div class="mv-img">
      <img src="http://p1.music.126.net/5kxVGwb-9EfdFQu83L9NCw==/109951164583117120.jpg?param=137y103" />
      <!-- 播放次数 -->
      <div class="play-num">
        <i class="iconfont icon-bofang"></i>
        1232
      </div>
    </div>
    <!-- mv信息 -->
    <div class="mv-info">
      <!-- 标题 -->
      <div class="mv-title">是的范德萨范德萨</div>
      <div class="bottom">
        <!-- 时间 -->
        <div class="mv-time">12:12</div>
        <!-- 来源 -->
        <div class="mv-source">123</div>
      </div>

    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="stylus" scoped>
.mv-list-item-container {
  display: flex;
  margin-bottom: 0.3rem;
  padding .1rem
  .mv-img {
    position: relative;
    margin-right: 0.4rem;
    width: 3rem;
    height: 1.8rem;

    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 0.1rem;
    }

    .play-num {
      position: absolute;
      right: 0.1rem;
      top: 0.1rem;
      color: #fff;
    }
  }

  .mv-info {
    .mv-title {
      margin-bottom: 0.2rem;
      line-height: 0.5rem;
      font-weight: bold;
    }

    .bottom {
      display: flex;
      color: #999;

      .mv-time {
        margin-right: 0.3rem;
      }
    }
  }
}
</style>