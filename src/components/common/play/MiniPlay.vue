<template>
  <transition enter-active-class="animated fadeIn faster"
              leave-active-class="animated fadeOut faster">
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
                  <div class="image  animated fadeIn"
                       :class="cdCls">
                    <van-image :src="item.picUrl"
                               round>
                      <template v-slot:loading>
                        <van-loading type="spinner"
                                     size="20" />
                      </template>
                    </van-image>
                  </div>
                </div>
                <div class="right">
                  <!--歌曲信息-->
                  <div class="song-info"
                       :class="currentSong.id===item.id?'active':''">
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
                        :layer-color="circleColor">
            </van-circle>
            <div class="icon">
              <i class="iconfont"
                 :style="iconColor"
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
  </transition>
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
    iconColor () {
      return {
        color: this.playing ? '#fd4979' : '#999',
        marginLeft: this.playing ? '0.03rem' : '0.07rem'
      }
    },
    circleColor () {
      return this.playing ? '#ddd' : '#999'
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
      if (this.currentSong) {
        let index = this.sequenceList.findIndex(item => item.id === this.currentSong.id)
        this.swiper.slideTo(index, 0, false)
      }
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
        let index = this.sequenceList.findIndex(item => item.id === this.currentSong.id)
        // eslint-disable-next-line no-new
        vm.swiper = new Swiper('.player-swiper', {
          // 解决与vant标签页切换冲突问题
          observer: true,
          observeParents: true,
          initialSlide: index,
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

             .van-image {
               width: 100%;
               height: 100%;
             }

             &.play {
               animation: rotate 10s linear infinite;
             }

             &.pause {
               animation-play-state: paused;
             }
           }
         }

         .right {
           .song-info {
             display: flex;
             flex-direction: column;
             justify-content: space-around;
             height: 100%;

             .song-name {
               margin-top: 0.2rem;
               width: 5.7rem;
               line-height: 0.55rem;
               font-size: $font-size-smaller;
               font-weight: 400;
               no-wrap();
             }

             &.active {
               overflow: hidden;

               .song-name {
                 overflow: visible;
                 animation: 10s wordsLoop linear infinite normal;
               }
             }

             .singer {
               margin-bottom: 0.2rem;
               width: 5.7rem;
               line-height: 0.55rem;
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
         height: 1.5rem;

         i {
           font-size: 0.8rem;
         }
       }

       .play {
         position: relative;
         width: 1.2rem;
         height: 1.5rem;
         display: flex;
         justify-content: center;
         align-items: center;
         color: red;
         border-radius: 50%;

         .icon {
           position: absolute;
           color: $color-common;

           i {
             color: $color-common-b2;
             font-size: 0.35rem;
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

 @keyframes wordsLoop {
   0% {
     transform: translateX(100%);
   }

   100% {
     transform: translateX(-100%);
   }
 }
</style>