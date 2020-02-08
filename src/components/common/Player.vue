<template>
  <div class="play-container"
       ref="play"
       v-show="playList.length>0">
    <!-- 全屏播放器 -->
    <transition enter-active-class="animated fadeInUp faster">
      <FullScreenPlay ref="FullScreenPlay"
                      v-show="playerFullScreen"
                      @prev="prev"></FullScreenPlay>
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
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.audio.currentTime = 0
        this.setCurrentPlayLyric('')
        this.setCurrentLineNum(0)
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$refs.FullScreenPlay.$refs.playSection.getLyric(this.currentSong.id)// 获取歌词
      }, 1000)

      this.setPlaying(false)
      this.getSong(this.currentSong.id)
      // 默认显示歌曲封面
      this.setPlayerShowImage(true)
    },
    playing (newPlaying) {
      this.$nextTick(() => {
        newPlaying ? this.audio.play() : this.audio.pause()
      })
    }
  },
  computed: {
    ...mapState(['playerFullScreen', 'songReady', 'playing', 'audio', 'currentPlayIndex', 'playList', 'playMode', 'sequenceList', 'currentLyric']),
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
    ...mapMutations(['setAudio', 'setTogglePlayList', 'setSongReady', 'setPlaying', 'setPlayMode', 'setPlayList', 'setCurrentPlayIndex', 'setSequenceList', 'setPlayerShowImage', 'setCurrentPlayLyric', 'setCurrentLineNum']),
    ready () {
      this.playerParams.duration = this.audio.duration
      this.setSongReady(true)
    },
    error () {
      this.setSongReady(true)
    },
    // 获取歌曲
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
    // 更新时间
    handleUpdateTime (e) {
      // 更新当前播放时间
      this.playerParams.currentTime = e.target.currentTime
      // 更新滚动条
      this.playerParams.width = (this.playerParams.currentTime / this.playerParams.duration) * 100
    },
    // 播放结束
    handleEnd () {
      this.$nextTick(() => {
        this.setPlaying(false)
      })
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
      if (this.currentLyric) {
        this.currentLyric.seek(0)
        this.setCurrentPlayLyric('')
        this.setCurrentLineNum(0)
      }
      this.$nextTick(() => {
        this.setPlaying(true)
        this.audio.play()
      })
    },
    // 上一曲
    prev () {
      // 未加载好
      if (!this.songReady) return
      // 如果只有一首就循环播放当前歌曲
      if (this.playList.length === 1) {
        this.loop()
        return
      }
      // 限制播放索引
      let index = this.utils.limitCutIndex(this.currentPlayIndex, this.playList.length - 1)
      this.setCurrentPlayIndex(index)
      if (!this.playing) this.handleTogglePlaying()
      this.setSongReady(false)
      this.utils.playMusic(this.currentSong, null, this.currentPlayIndex)
    },
    // 切换播放暂停
    handleTogglePlaying () {
      if (!this.songReady) return
      this.setPlaying(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    // 下一曲
    next () {
      // 未加载好
      if (!this.songReady) return
      // 如果只有一首就循环播放当前歌曲
      if (this.playList.length === 1) {
        this.loop()
        return
      }
      // 限制当前播放索引
      let index = this.utils.limitAddIndex(this.currentPlayIndex, this.playList.length)
      this.setCurrentPlayIndex(index)
      if (!this.playing) this.handleTogglePlaying()
      this.setSongReady(false)
      this.utils.playMusic(this.currentSong, null, this.currentPlayIndex)
    },
    // 切换播放类型
    changeMode () {
      const mode = (this.playMode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) { // 随机播放
        list = this.utils.randomList(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
      this.$toast(this.playMode === playMode.sequence ? '列表循环' : this.playMode === playMode.loop ? '单曲循环' : '随机播放')
    },
    // 重置当前索引
    resetCurrentIndex (list) {
      let index = list.findIndex(item => item.id === this.currentSong.id)
      this.setCurrentPlayIndex(index)
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

.play-container>>>.singerList {
  max-height: 6rem;
}

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