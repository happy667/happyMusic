<template>
  <div class="play-progress-container">
    <!-- 进度条 -->
    <div class="progress">
      <van-slider active-color="#FD4979"
                  @input="handleSlideChange"
                  v-model="playerParams.width" />

    </div>
    <!-- 播放时长 -->
    <div class="play-time">
      <div class="start-time">{{playerParams.currentTime|convertPlayTime}}</div>
      <div class="end-time">{{playerParams.duration|convertPlayTime}}</div>
    </div>
  </div>
</template>
<script>
import 'common/js/convert.js'
import { mapState } from 'vuex'
export default {
  inject: ['playerParams'],
  computed: {
    ...mapState(['audio'])
  },
  methods: {
    // 滑动进度条
    handleSlideChange () {
      this.audio.currentTime = this.playerParams.width * this.playerParams.duration / 100
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

    .start-time, .end-time {
      color: #81898f;
    }
  }
}
</style>