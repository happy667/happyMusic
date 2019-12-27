<template>
  <div class="video-container">
    <!-- 视频区域 -->
    <div class="player">
      <video src="@/assets/testMv/1.mp4"></video>
      <!-- 播放按钮 -->
      <div class="play-btn">
        <van-icon name="play-circle-o" />
      </div>

      <div class="play-desc">
        <!-- 播放次数 -->
        <div class="play-left">
          <i class="iconfont icon-bofang"></i>
          123213
        </div>
        <!-- 播放时长 -->
        <div class="play-right">
          <i class="iconfont icon-shichang"></i>
          12:52
        </div>
      </div>
    </div>

    <div class="play-info">
      <!-- 视频标题 -->
      <div class="play-title">差不多姑娘差不多姑娘差不多姑娘差不多姑娘差不多姑娘差不多姑娘差不多姑娘</div>
      <!-- 视频出处 -->
      <div class="play-source">
        <div class="play-source-img">
          <img src="http://p3.music.126.net/Xl0WENt4F6wsgjjjQWuQsw==/109951164232034479.jpg?param=50y50" />
        </div>
        <div class="play-source-author">
          张艺兴
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.video-container {
  margin-bottom: 0.5rem;
  width: 100%;
  box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, 0.1);
  border-radius: 0 0 0.3rem 0.3rem;

  .player {
    position: relative;
    width: 100%;

    video {
      display: block;
      width: 100%;
      height: 100%;
    }

    .play-btn {
      position: absolute;
      top: 0px;
      left: 0px;
      bottom: 0px;
      right: 0px;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0);
      display: flex;
      align-items: center;
      justify-content: center;

      .van-icon {
        display: block;
        color: #fff;
        font-size: 2rem;
        opacity: 0.7;
      }
    }

    .play-desc {
      position: absolute;
      bottom: 0rem;
      left: 0;
      display: flex;
      justify-content: space-between;
      padding: 0 0.3rem;
      width: 100%;
      box-sizing: border-box;
      height: 1rem;
      line-height: 1rem;
      color: #fff;
    }
  }

  .play-info {
    .play-title {
      padding: 0.1rem;
      margin-bottom: 0.2rem;
      line-height: 1rem;
      font-size: $font-size-smaller;
      no-wrap();
      border-bottom: 0.03rem solid #ccc;
    }

    .play-source {
      padding: 0.1rem;
      display: flex;
      align-items: center;

      .play-source-img {
        margin-right: 0.3rem;
        width: 1rem;
        height: 1rem;

        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .play-source-author {
        font-size: $font-size-smaller;
      }
    }
  }
}
</style>