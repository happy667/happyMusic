<template>
  <div class="play-progress-container">
    <!-- 进度条 -->
    <div class="progress">
      <van-slider
        active-color="#FD4979"
        button-size="8"
        @change="handleSlideChange"
        v-model="playerParams.width"
      />
    </div>
    <!-- 播放时长 -->

    <div class="play-time">
      <div class="start-time">{{ $filters.convertTime(playerParams.currentTime) }}</div>
      <div class="end-time">{{ $filters.convertTime(playerParams.duration) }}</div>
    </div>
  </div>
</template>
<script>
import "common/js/convert.js";
import { mapWritableState, mapActions } from "pinia";

import { useAppStore, usePlayerStore } from "@/stores";
export default {
  inject: ["playerParams"],
  computed: {
    ...mapWritableState(useAppStore, ["audio"]),
    ...mapWritableState(usePlayerStore, ["currentLyric", "playing"]),
  },
  methods: {
    ...mapActions(usePlayerStore, ["handleTogglePlaying"]),
    // 滑动进度条
    handleSlideChange() {
      this.audio.currentTime =
        (this.playerParams.width * this.playerParams.duration) / 100;
      console.log(this.currentLyric);
      if (this.currentLyric) {
        this.currentLyric.seek(this.audio.currentTime * 1000);
      }

      if (!this.playing) {
        // 开始播放
        this.playing = true;
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.play-progress-container {
    .progress {
        width: 100%;
    }
    .van-slider {
        height: 0.025rem;
    }
    .play-time {
        display: flex;
        justify-content: space-between;
        height: 0.8rem;
        line-height: 0.8rem;
        .start-time,
        .end-time {
            color: #f3f3f3;
        }
    }
}
</style>
