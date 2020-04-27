<template>
  <div class="play-container"
       ref="play"
       v-show="playList.length>0">
    <!-- 全屏播放器 -->
    <FullScreenPlay ref="FullScreenPlay"
                    v-show="playerFullScreen"
                    @prev="prev"></FullScreenPlay>

    <!-- 迷你播放器 -->
    <mini-play v-show="!hideMiniPlayer">
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
    <!--歌曲列表-->
    <transition enter-active-class="animated fadeIn faster"
                leave-active-class="animated fadeOut faster">
      <play-list v-show="togglePlayList"
                 @close="togglePlayList"></play-list>
    </transition>
  </div>
</template>
<script>
import songApi from '@/api/song.js'
import {
  ERR_OK
} from '@/api/config.js'
import FullScreenPlay from './play/FullScreenPlay'
import MiniPlay from './play/MiniPlay'
import PlayList from '@/components/home/playList/PlayList'
import {
  playMode
} from '@/assets/common/js/config.js'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data () {
    return {
      url: '', // 播放路径
      playerParams: {// 播放器参数
        currentTime: 0,
        duration: 0,
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
        this.setCurrentLyric(null)
        this.setCurrentPlayLyric('')
        this.setCurrentLineNum(0)
      }
      this.setPlaying(false)
      this.getSong(this.currentSong)
      // 获取歌词
      this.$refs.FullScreenPlay.$refs.playSection.getLyric(this.currentSong.id)
      // 初始化获取歌手图片（点击歌手弹出歌手框的图片）
      this.setIsGetSingerImage(false)
    },

    playing (newPlaying) {
      let audio = this.audio
      clearInterval(this.t1)
      clearInterval(this.t2)
      console.log(newPlaying)
      if (newPlaying) {
        // 如果有视频播放就暂停
        // if (this.oldVideo.$data && this.oldVideo.$data.isPlay) {
        //   this.oldVideo.pauseCurrentVideo()
        // }
        this.$nextTick(() => {
          audio.play()
          let v = 0
          audio.volume = 0
          // 加音量
          this.t1 = setInterval(() => {
            v += 0.1
            if (v <= 1) {
              audio.volume = v
            }
            if (v >= 1) {
              clearInterval(this.t1)
            }
          }, 100)
        })
      } else {
        this.$nextTick(() => {
          audio.pause()
          let v = audio.volume
          clearInterval(this.t2)
          // 减音量
          this.t2 = setInterval(() => {
            v -= 0.1
            if (v >= 0) {
              audio.volume = v
            }
            if (v <= 0) {
              audio.pause()
              audio.volume = 0
              clearInterval(this.t2)
            }
          }, 100)
        })
      }
    },

    togglePlayList () {
      if (this.togglePlayList) {
        this.closeScroll()
      } else {
        this.openScroll()
      }
    }

  },
  computed: {
    ...mapState(['playerFullScreen', 'songReady', 'playing', 'audio', 'currentPlayIndex', 'playList', 'playMode', 'sequenceList', 'currentLyric', 'isPlay', 'hideMiniPlayer']),
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
    ...mapMutations(
      [
        'setAudio',
        'setTogglePlayList',
        'setSongReady',
        'setPlaying',
        'setPlayMode',
        'setPlayList',
        'setCurrentPlayIndex',
        'setSequenceList',
        'setPlayerShowImage',
        'setCurrentPlayLyric',
        'setCurrentLineNum',
        'setIsGetSingerImage',
        'setCurrentLyric'
      ]),
    ...mapActions([
      'deleteSong',
      'loop',
      'next',
      'prev',
      'handleTogglePlaying'
    ]),
    ready () {
      this.playerParams.duration = this.audio.duration
      this.setSongReady(true)
    },
    error () {
      this.setSongReady(true)
    },
    // 获取歌曲
    async getSong (song) {
      // 检查音乐是否可用
      songApi.checkMusic(song.id).then(async res => {
        if (res.data.success) {
          // 获取音乐播放路径
          const { data: res } = await songApi.getMusicUrl(song.id)
          if (res.code === ERR_OK) {
            this.url = res.data[0].url
            if (!this.url) { // 判断是否为空
              song.st = -1
              // 移除该歌曲
              this.deleteSong(song)
              this.setSongReady(true)
              this.$toast('该歌曲暂时不能播放')
            } else {
              this.$nextTick(() => {
                this.setPlaying(true)
                if (this.currentLyric) {
                  this.currentLyric.play()
                }
              })
            }
          }
        }
      }).catch((res) => {
        song.st = -1
        // 移除该歌曲
        this.deleteSong(song)
        this.setSongReady(true)
        this.$toast(res.data.message)
      })
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
      // 如果是单曲循环
      if (this.playMode === playMode.loop) {
        this.loop()
      } else {
        this.$nextTick(() => {
          this.setPlaying(false)
        })
        this.next()
      }
    },

    // 切换播放类型
    changeMode () {
      const mode = (this.playMode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) { // 随机播放
        list = this.$utils.randomList(this.sequenceList)
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
    },

    // 禁止背景滚动
    closeScroll () {
      document.body.style.overflow = 'hidden'
    },
    // 开启背景滚动
    openScroll () {
      document.body.style.overflow = ''
    }
  },
  components: {
    FullScreenPlay,
    MiniPlay,
    PlayList
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.play-container>>>.singerList {
  max-height: 6rem;
}
</style>