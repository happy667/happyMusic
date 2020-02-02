<template>
  <div class="play-container"
       ref="play"
       v-show="playList.length>0">
    <!-- 全屏播放器 -->
    <transition enter-active-class="animated fadeInUp faster">
      <FullScreenPlay ref="FullScreenPlay"
                      v-show="playerFullScreen"></FullScreenPlay>
    </transition>
    <!-- 迷你播放器 -->
    <mini-play v-show="!playerFullScreen">
    </mini-play>
    <div class="audio">
      <audio ref="audio"
             id="audio"
             preload="auto"
             @canplay="ready"
             @error="error"
             @timeupdate="handleUpdateTime"
             @ended="handleEnd"
             :src="url"></audio>
    </div>
  </div>
</template>
<script>
import 'common/js/utils.js'
import songApi from '@/api/song.js'
import {
  ERR_OK
} from '@/api/config.js'
import FullScreenPlay from './play/FullScreenPlay'
import MiniPlay from './play/MiniPlay'
import {
  playMode
} from '@/assets/common/js/config.js'
import { mapState, mapGetters, mapMutations } from 'vuex'
export default {
  data () {
    return {
      url: '', // 播放路径
      playerParams: {// 播放器参数
        currentTime: 0,
        duration: 1,
        width: 0
      }
    }
  },
  // 依赖注入传值
  provide () {
    return {
      playerParams: this.playerParams
    }
  },
  watch: {
    playerFullScreen () {
      if (this.playerFullScreen) {
        this.$refs.play.style.position = 'fixed'
      } else {
        this.$refs.play.style.position = 'relative'
      }
    },
    currentSong (newSong, oldSong) {
      if (!newSong.id) {
        return
      }
      if (newSong.id === oldSong.id) {
        return
      }
      this.setPlaying(false)
      this.getSong(this.currentSong.id)
    },
    playing (newPlaying) {
      this.$nextTick(() => {
        newPlaying ? this.audio.play() : this.audio.pause()
      })
    }
  },
  computed: {
    ...mapState(['playerFullScreen', 'playing', 'audio', 'playList', 'playMode', 'sequenceList']),
    ...mapGetters(['currentSong']),
    togglePlayList: {
      get () {
        return this.$store.state.togglePlayList
      },
      set (newVal) {
        this.$store.commit('setTogglePlayList', newVal)
      }
    }

  },
  mounted () {
    // 设置音频对象
    this.setAudio(this.$refs.audio)
  },
  methods: {
    ...mapMutations(['setAudio', 'setTogglePlayList', 'setSongReady', 'setPlaying', 'setCurrentPlayIndex', 'setSequenceList']),
    ready () {
      this.playerParams.duration = this.audio.duration
      this.setSongReady(true)
    },
    error () {
      this.setSongReady(true)
    },
    async getSong (id) {
      // 获取音乐播放路径
      const { data: res } = await songApi.getMusicUrl(id)
      if (res.code === ERR_OK) {
        this.url = res.data[0].url
        if (!this.url) { // 判断是否为空
          // 移除歌曲
          let list = this.sequenceList
          const listIndex = this.sequenceList.findIndex(item => item.id === id)
          list.splice(listIndex, 1)
          this.setSequenceList(list)
          this.$toast('该歌曲暂时不能播放,自动移除该歌曲')
          this.setSongReady(true)
          this.next()
        } else {
          this.$nextTick(() => {
            this.setPlaying(true)
          })
        }
      }
    },
    handleUpdateTime (e) {
      // 更新当前播放时间
      this.playerParams.currentTime = e.target.currentTime
      // 更新滚动条
      this.playerParams.width = (this.playerParams.currentTime / this.playerParams.duration) * 100
    },
    // 播放结束
    handleEnd () {
      // 如果是单曲循环
      if (this.playMode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    // 循环播放
    loop () {
      this.audio.currentTime = 0// 重新播放
      this.$refs.audio.play()
      this.setPlaying(true)
    },
    next () {
      this.$refs.FullScreenPlay.$refs.playFooter.$refs.playController.next()
    }

  },
  components: {
    FullScreenPlay,
    MiniPlay
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.play-container {
  position: relative;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: $color-common-background;
}
</style>