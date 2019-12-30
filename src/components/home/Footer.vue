<template>
  <div class="footer-container"
       @click="handleClick">
    <div class="fixed">
      <!-- 左侧图片 -->
      <div class="left">
        <img src="http://p2.music.126.net/bneNR7SFgi-qe814_bAgdQ==/109951164583628522.jpg?param=140y140">
      </div>
      <div class="right">
        <div class="top">
          <!--歌曲信息-->
          <div class="song-info">
            <p class="song-name">This Girl</p>
            <p class="singer">Kungs</p>
          </div>
          <!-- 按钮区域 -->
          <div class="player-controller">
            <div class="prev icon">
              <i class="iconfont icon-shangyishoushangyige"></i>
            </div>
            <div class="play icon">
              <i class="iconfont icon-bofang"></i>
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
export default {
  methods: {
    handleClick () {
      this.$router.push('/play')
    }
  }
}
</script>
 <style lang="stylus" scoped>
 @import '~common/stylus/variable';

 .progress >>>.van-progress__portions {
   width: 100%;
 }

 .footer-container {
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
     box-shadow: 0.25rem 0 0.5rem rgba(0, 0, 0, 0.2);

     .left {
       margin-right: 0.25rem;
       width: 1.2rem;
       height: 1.2rem;

       img {
         display: block;
         width: 100%;
         height: 100%;
         border-radius: 50%;
       }
     }

     .right {
       flex: 1;

       .top {
         display: flex;
         margin-bottom: 0.2rem;
         justify-content: space-between;

         .song-info {
           margin-right: 0.5rem;

           .song-name {
             height: 0.6rem;
             line-height: 0.6rem;
             font-size: $font-size-smaller;
             font-weight: 400;
             no-wrap();
           }

           .singer {
             height: 0.5rem;
             line-height: 0.5rem;
             font-size: $font-size-smaller-x;
             color: #999;
             no-wrap();
           }
         }

         .player-controller {
           width: 3.25rem;
           display: flex;
           justify-content: space-between;
           align-items: center;

           .icon {
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
</style>