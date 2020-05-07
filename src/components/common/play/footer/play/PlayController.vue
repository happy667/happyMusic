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
import { mapState, mapMutations } from 'vuex'
import {
  PLAY_MODE
} from '@/assets/common/js/config.js'
export default {
  computed: {
    ...mapState(['playing', 'playMode']),
    playIcon () {
      return this.playing ? 'pause' : 'play'
    },
    playModeIcon () {
      return this.playMode === PLAY_MODE.sequence ? 'icon-xunhuanbofang' : this.playMode === PLAY_MODE.loop ? 'icon-danquxunhuan' : 'icon-suijibofang'
    }
  },
  methods: {
    ...mapMutations(['setTogglePlayList']),
    // 切换播放暂停
    handleTogglePlaying () {
      this.$parent.$parent.$parent.handleTogglePlaying()
    },
    // 上一曲
    prev () {
      this.$parent.$parent.$parent.prev()
    },
    // 下一曲
    next () {
      this.$parent.$parent.$parent.next()
    },
    // 切换播放类型
    changeMode () {
      this.$parent.$parent.$parent.changeMode()
    },
    // 查看歌曲列表
    handlePlayList () {
      this.setTogglePlayList(true)
    }
  }

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.play-controller-container {
  margin: 0 0.65rem;
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