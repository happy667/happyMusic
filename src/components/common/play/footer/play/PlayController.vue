<template>
  <div class="play-controller-container">
    <!-- 播放类型 -->
    <div class="play-type icon"
         @click="changeMode">
      <i class="iconfont"
         :class="playModeIcon"></i>
    </div>
    <!-- 上一首 -->
    <div class="prev icon"
         @click="prev">
      <i class="iconfont icon-shangyishoushangyige"></i>
    </div>
    <!-- 播放暂停 -->
    <div class="play icon"
         @click="handleTogglePlaying">
      <van-icon :name="playIcon" />
    </div>
    <!--下一曲-->
    <div class="next icon"
         @click="next">
      <i class="iconfont icon-xiayigexiayishou"></i>
    </div>
    <!-- 歌曲列表 -->
    <div class="play-list icon"
         @click="handlePlayList">
      <i class="iconfont icon-bofangliebiao"></i>
    </div>

  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import {
  playMode
} from '@/assets/common/js/config.js'
import 'common/js/utils.js'
export default {
  computed: {
    ...mapState(['audio', 'playing', 'currentPlayIndex', 'playList', 'songReady', 'playMode', 'sequenceList']),
    ...mapGetters(['currentSong']),
    playIcon () {
      return this.playing ? 'pause' : 'play'
    },
    playModeIcon () {
      return this.playMode === playMode.sequence ? 'icon-xunhuanbofang' : this.playMode === playMode.loop ? 'icon-danquxunhuan' : 'icon-suijibofang'
    }
  },
  methods: {
    ...mapMutations(['setPlaying', 'setTogglePlayList', 'setCurrentPlayIndex', 'setSongReady', 'setPlayMode', 'setPlayList']),
    // 切换播放暂停
    handleTogglePlaying () {
      console.log(this.playing)
      this.setPlaying(!this.playing)
    },
    // 查看歌曲列表
    handlePlayList () {
      this.setTogglePlayList(true)
    },
    // 上一曲
    prev () {
      // 未加载好
      if (!this.songReady) return
      // 限制播放索引
      let index = this.utils.limitCutIndex(this.currentPlayIndex, this.playList.length - 1)
      this.setCurrentPlayIndex(index)

      if (!this.playing) this.handleTogglePlaying()
      this.setSongReady(false)
      this.utils.playMusic(this.currentSong, null, this.currentPlayIndex)
    },
    // 下一曲
    next () {
      // 未加载好
      if (!this.songReady) return
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
  }

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.play-controller-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: $color-common;

  .icon {
    i {
      font-size: 0.7rem;
    }
  }

  .play {
    display: flex;
    justify-content: center;
    align-items: center;
    color: red;
    background: $color-common;
    width: 1.3rem;
    height: 1.3rem;
    border-radius: 50%;

    i {
      font-size: 0.8rem;
      color: #fff;
    }
  }
}
</style>