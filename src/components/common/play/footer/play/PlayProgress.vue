<template>
  <div class="play-progress-container">
    <!-- 进度条 -->
    <div class="progress">
      <van-slider active-color="#FD4979"
                  @change="handleSlideChange"
                  v-model="playerParams.width" />

    </div>
    <!-- 播放时长 -->

    <div class="play-time">
      <div class="start-time">{{playerParams.currentTime|convertTime}}</div>
      <div class="end-time">{{playerParams.duration|convertTime}}</div>
    </div>
  </div>
</template>
<script>
import 'common/js/convert.js'
import { mapState } from 'vuex'
export default {
  inject: ['playerParams'],
  computed: {
    ...mapState(['audio', 'currentLyric'])
  },
  methods: {
    // 滑动进度条
    handleSlideChange () {
      this.audio.currentTime = this.playerParams.width * this.playerParams.duration / 100
      if (this.currentLyric) {
        this.currentLyric.seek(this.audio.currentTime * 1000)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.play-progress-container {
  .progress {
    width: 100%;
  }

  .play-time {
    display: flex;
    justify-content: space-between;
    height: 0.8rem;
    line-height: 0.8rem;

    .start-time, .end-time {
      color: #81898f;
    }
  }
}
</style>