<template>
  <div class="song-speed-container">
    <van-popup v-model="showPopup"
               position="bottom"
               :get-container="getContainer"
               round>
      <div class="song-speed-container">
        <h3 class="title">播放速度 {{ songSpeed === 1.0 ? '正常' : `${songSpeed}X` }}</h3>
        <div class="slider">
          <van-slider v-model="currentSpeed"
                      :min="0.5"
                      bar-height="4px"
                      :max="2.0"
                      active-color="#FD4979"
                      :step="0.1"
                      button-size="18"
                      @input="handleSpeedChange"
                      @change="handleSpeedChange" />
        </div>
        <div class="speed-options">
          <div v-for="speed in speedOptions"
               :key="speed"
               :class="['speed-option', { active: songSpeed === speed }]"
               @click="handleSpeedChange(speed)">
            {{ speed === 1.0 ? '正常' : `${speed}X` }}
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Slider, Popup } from 'vant'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'SongSpeed',
  data () {
    return {
      speedOptions: [0.5, 1.0, 1.5, 2.0]
    }
  },
  computed: {
    ...mapState(['songSpeed', 'songSpeedPopup']),
    showPopup: {
      get () { return this.songSpeedPopup },
      set (value) { this.setSongSpeedPopup(value) }
    },
    currentSpeed: {
      get () { return this.songSpeed },
      set (value) { this.setSongSpeed(value) }
    }
  },
  methods: {
    ...mapMutations(['setSongSpeed', 'setSongSpeedPopup']),
    handleSpeedChange (speed) {
      this.currentSpeed = speed
      this.$toast('当前倍速:' + (speed === 1 ? '正常' : `${speed}X`))
    },
    getContainer () {
      return document.querySelector('#app')
    },
  },
  components: {
    [Slider.name]: Slider,
    [Popup.name]: Popup
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.song-speed-container {
  padding: 0.6rem 0.4rem 0.4rem;
  text-align: center;

  .title {
    font-size: $font-size-small-x;
    margin-bottom: 0.7rem;
  }

  .slider {
    padding: 0 0.7rem;
  }

  .speed-options {
    margin-top: 0.7rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .speed-option {
      padding: 0.25rem 0.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s;
      color: $color-common-x;
      font-size: $font-size-smaller-x;

      &.active {
        background-color: $color-common;
        color: #fff;
        border-color: $color-common;
      }
    }
  }
}
</style>