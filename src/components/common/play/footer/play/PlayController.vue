<template>
  <div class="play-controller-container">
    <!-- 播放类型 -->
    <div class="play-type icon">
      <i class="iconfont icon-xunhuanbofang"></i>
    </div>
    <!-- 上一首 -->
    <div class="prev icon">
      <i class="iconfont icon-shangyishoushangyige"></i>
    </div>
    <!-- 播放暂停 -->
    <div class="play icon"
         @click="handleTogglePlaying">
      <van-icon :name="playIcon" />
    </div>
    <!--下一曲-->
    <div class="next icon">
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

export default {
  data () {
    return {
      songReady: false
    }
  },
  computed: {
    ...mapState(['audio', 'playing']),
    playIcon () {
      return this.playing ? 'pause' : 'play'
    }
  },
  methods: {
    ...mapMutations(['setPlaying', 'setTogglePlayList']),
    // 切换播放暂停
    handleTogglePlaying () {
      this.setPlaying(!this.playing)
      console.log(this.audio)
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