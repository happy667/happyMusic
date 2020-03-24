<template>
  <div class="mini-play-container"
       @click="handleShowFullPlay">
    <div class="fixed">
      <div class="swiper-container player-swiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide"
               v-for="item in sequenceList"
               :key="item.id">
            <div class="swiper-list-item">
              <!-- 左侧图片 -->
              <div class="left">
                <div class="image">
                  <img :src="item.picUrl"
                       :key="item.picUrl"
                       :class="cdCls">
                </div>
              </div>
              <div class="right">
                <!--歌曲信息-->
                <div class="song-info">
                  <p class="song-name">{{item.name}}</p>
                  <p class="singer">{{item.singers}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 按钮区域 -->
      <div class="player-controller">
        <div class="play"
             @click.stop="handleTogglePlaying">
          <van-circle v-model="playerParams.width"
                      size="32"
                      color="#fd4979"
                      layer-color="#ddd">
          </van-circle>
          <div class="icon">
            <i class="iconfont"
               :class="playIcon"></i>
          </div>
        </div>

        <!-- 歌曲列表 -->
        <div class="play-list icon"
             @click.stop="handlePlayList">
          <i class="iconfont icon-bofangliebiao"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from 'swiper'
import { defaultMusicImage } from 'common/js/config.js'
import { mapMutations, mapGetters, mapState } from 'vuex'
let vm = null
export default {
  data () {
    return {
      isLoop: false
    }
  },
  inject: ['playerParams'],
  computed: {
    ...mapGetters(['currentSong']),
    ...mapState(['playing', 'audio', 'sequenceList', 'currentPlayIndex']),
    playIcon () {
      return this.playing ? 'icon-zanting' : 'icon-bofang'
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    picUrl () {
      return this.currentSong.picUrl ? this.currentSong.picUrl : defaultMusicImage
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 初始化轮播图组件
      this.initSwiper()
    })
  },
  created () {
    vm = this
  },
  watch: {
    currentSong () {
      this.swiper.slideTo(this.currentPlayIndex, 0, false)
    }
  },

  methods: {
    ...mapMutations(['setPlayerFullScreen', 'setIsPlayerClick', 'setTogglePlayList']),
    handleShowFullPlay () {
      this.setPlayerFullScreen(true)
      this.setIsPlayerClick(false)
    },
    // 切换播放暂停
    handleTogglePlaying () {
      this.$parent.handleTogglePlaying()
    },
    // 上一曲
    prev () {
      this.$parent.prev()
    },
    // 下一曲
    next () {
      this.$parent.next()
    },
    // 查看歌曲列表
    handlePlayList () {
      this.setTogglePlayList(true)
    },
    // 初始化轮播图组件
    initSwiper () {
      // 通过settimeout 解决数据还没有完全加载的时候就已经渲染swiper，导致loop失效。
      setTimeout(() => {
        // eslint-disable-next-line no-new
        vm.swiper = new Swiper('.player-swiper', {
          // 解决与vant标签页切换冲突问题
          observer: true,
          observeParents: true,
          initialSlide: vm.currentPlayIndex,
          centeredSlides: true,
          on: {
            touchStart (e) {
              e.stopPropagation()
            },
            touchEnd (e) {
              e.stopPropagation()
            },
            slidePrevTransitionEnd () {
              vm.prev()
            },

            slideNextTransitionEnd () {
              vm.next()
            }
          }
        })
      }, 20)
    }
  }

}
</script>
 <style lang="stylus" scoped>
 @import '~common/stylus/variable';

 .mini-play-container {
   height: 0;

   .fixed {
     position: fixed;
     width: 100%;
     height: 1.5rem;
     bottom: 0;
     left: 0;
     display: flex;
     box-sizing: border-box;
     background: $color-common-background;
     box-shadow: 0 -0.15rem 1rem rgba(0, 0, 0, 0.2);

     .swiper-slide {
       width: 100% !important;

       .swiper-list-item {
         display: flex;
         width: 100%;
         height: 100%;

         .left {
           margin: 0 0.3rem;
           height: 100%;
           display: flex;
           flex-direction: column;
           justify-content: center;

           .image {
             width: 1.1rem;
             height: 1.1rem;
             background-color: #e4e4e4;
             border-radius: 50%;

             img {
               display: block;
               width: 100%;
               height: 100%;
               border-radius: 50%;

               &.play {
                 animation: rotate 10s linear infinite;
               }

               &.pause {
                 animation-play-state: paused;
               }
             }
           }
         }

         .right {
           flex: 1;
           width: 7rem;

           .song-info {
             display: flex;
             flex-direction: column;
             justify-content: space-between;
             height: 100%;

             .song-name {
               margin-top: 0.15rem;
               width: 5.5rem;
               line-height: 0.7rem;
               font-size: $font-size-smaller;
               font-weight: 400;
               no-wrap();
             }

             .singer {
               width: 5.5rem;
               line-height: 0.6rem;
               font-size: $font-size-smaller-x;
               color: $color-common-b2;
               no-wrap();
             }
           }
         }
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
         touch-action: none;

         i {
           color: $color-common;
         }
       }

       .play-list {
         width: 1.2rem;
         height: 1.2rem;

         i {
           font-size: 0.8rem;
         }
       }

       .play {
         position: relative;
         width: 1.2rem;
         height: 1.2rem;
         display: flex;
         justify-content: center;
         align-items: center;
         color: red;
         border-radius: 50%;

         .icon {
           position: absolute;
           color: $color-common;

           i {
             font-size: 0.55rem;
           }
         }
       }
     }
   }
 }

 @keyframes rotate {
   0% {
     transform: rotate(0deg);
   }

   100% {
     transform: rotate(360deg);
   }
 }
</style>