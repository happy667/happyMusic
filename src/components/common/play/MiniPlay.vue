<template>
  <div class="mini-play-container"
       @click="handleShowFullPlay">
    <div class="fixed">
      <!-- 左侧图片 -->
      <div class="left">
        <img :src="currentSong.picUrl"
             ref="img">
      </div>
      <div class="right">
        <div class="top">
          <!--歌曲信息-->
          <div class="song-info">
            <p class="song-name">{{currentSong.name}}</p>
            <p class="singer">{{currentSong.singers}}</p>
          </div>
          <!-- 按钮区域 -->
          <div class="player-controller">
            <div class="prev icon">
              <i class="iconfont icon-shangyishoushangyige"></i>
            </div>
            <div class="play icon"
                 @click.stop="handleTogglePlaying">
              <van-icon :name="playIcon" />
            </div>
            <div class="next icon">
              <i class="iconfont icon-xiayigexiayishou"></i>
            </div>
          </div>
        </div>
        <div class="bottom">
          <!-- 进度条 -->
          <div class="progress">
            <van-progress :show-pivot="false"
                          color="#FD4979"
                          stroke-width="2"
                          :percentage="50" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapGetters, mapState } from 'vuex'
export default {
  computed: {
    ...mapGetters(['currentSong']),
    ...mapState(['playing', 'audio']),
    playIcon () {
      return this.playing ? 'pause' : 'play'
    }
  },
  watch: {
    playing () {
      const img = this.$refs.img
      this.playing ? img.style.webkitAnimationPlayState = 'running' : img.style.webkitAnimationPlayState = 'paused'
    }
  },
  methods: {
    ...mapMutations(['setPlayerFullScreen', 'setPlaying']),
    handleShowFullPlay (e) {
      if (e.target.className !== 'player-controller') {
        this.setPlayerFullScreen(true)
      }
    },
    // 切换播放暂停
    handleTogglePlaying () {
      this.setPlaying(!this.playing)
    }
  }
}
</script>
 <style lang="stylus" scoped>
 @import '~common/stylus/variable';

 .progress >>>.van-progress__portions {
   width: 100%;
 }

 .mini-play-container {
   .fixed {
     position: fixed;
     width: 100%;
     height: 1.8rem;
     bottom: 0;
     left: 0;
     padding: 0.2rem 0.25rem;
     display: flex;
     box-sizing: border-box;
     background: $color-common-background;
     box-shadow: 0 -0.15rem 1rem rgba(0, 0, 0, 0.2);

     .left {
       margin-right: 0.25rem;
       width: 1.2rem;
       height: 1.2rem;

       img {
         display: block;
         width: 100%;
         height: 100%;
         border-radius: 50%;
         animation: turn 10s linear infinite;
       }
     }

     .right {
       flex: 1;

       .top {
         display: flex;
         margin-bottom: 0.2rem;
         justify-content: space-between;

         .song-info {
           flex: 1;
           margin-right: 0.5rem;

           .song-name {
             width: 4rem;
             height: 0.6rem;
             line-height: 0.6rem;
             font-size: $font-size-smaller;
             font-weight: 400;
             no-wrap();
           }

           .singer {
             width: 4rem;
             height: 0.5rem;
             line-height: 0.5rem;
             font-size: $font-size-smaller-x;
             color: #999;
             no-wrap();
           }
         }

         .player-controller {
           flex: 1;
           display: flex;
           justify-content: space-between;
           align-items: center;
           z-index: 99;

           .icon {
             display: flex;
             justify-content: center;
             align-items: center;
             width: 1rem;
             height: 1rem;

             i {
               color: $color-common;
               font-size: 0.65rem;
             }
           }

           .play {
             display: flex;
             justify-content: center;
             align-items: center;
             color: red;
             background: $color-common;
             width: 1rem;
             height: 1rem;
             border-radius: 50%;

             i {
               color: #fff;
             }
           }
         }
       }
     }
   }
 }

 @keyframes turn {
   0% {
     transform: rotate(0deg);
   }

   100% {
     transform: rotate(360deg);
   }
 }
</style>