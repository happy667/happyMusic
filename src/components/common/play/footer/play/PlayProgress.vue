<template>
  <div class="play-progress-container">
    <!-- 进度条 -->
    <div class="progress">
      <van-slider active-color="#FD4979"
                  v-model="value" />

    </div>
    <!-- 播放时长 -->
    <div class="play-time">
      <div class="start-time">00:00</div>
      <div class="end-time">03:30</div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value: 30
    }
  }
}
</script>
<style lang="stylus" scoped>
.play-progress-container {
  .progress {
    width: 100%;
    margin-top: 0.6rem;
  }

  .play-time {
    display: flex;
    justify-content: space-between;
    height: 1.3rem;
    line-height: 1.3rem;

    .start-time {
      color: #81898f;
    }
  }
}
</style>