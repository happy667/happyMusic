<template>
  <transition name="fade">
    <div class="mini-play-container" @click="handleShowFullPlay">
      <div class="fixed">
        <div class="swiper player-swiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="item in sequenceList" :key="item.id">
              <div class="swiper-list-item">
                <!-- 左侧图片 -->
                <div class="left">
                  <div class="image-container">
                    <div class="image anim-fade-in">
                      <img v-lazy="item.album.picUrl || item.picUrl" />
                    </div>
                    <div class="digital-album anim-fade-in">
                      <img src="@/assets/images/digital-album.svg" />
                    </div>
                  </div>
                </div>
                <div class="right">
                 <!--歌曲信息-->
                 <div
                   class="song-info"
                   :class="currentSong.id === item.id ? 'active' : ''"
                 >
                    <div class="song-name-wrapper">
                      <p
                        class="song-name"
                      >
                        <span class="name-text">{{ displayText(item) }}</span>
                        <span class="name-gap" v-if="isOverflow"></span>
                        <span class="name-text" v-if="isOverflow">{{ displayText(item) }}</span>
                      </p>
                    </div>
                 </div>
               </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 按钮区域 -->
        <div class="player-controller">
          <div class="play" @click.stop="handleTogglePlaying">
            <van-circle
              :current-rate="playerParams.width"
              size="35"
              color="#fd4979"
              layer-color="#E2E2E2"
            >
            </van-circle>
            <div v-if="!songLoading" class="icon">
              <i class="iconfont" :style="iconStyle" :class="playIcon"></i>
            </div>
            <div v-if="songLoading" class="icon">
              <i class="loading iconfont icon-loading rotate"></i>
            </div>
          </div>

          <!-- 歌曲列表 -->
          <div class="play-list icon" @click.stop="handlePlayList">
            <i class="iconfont icon-bofangliebiao"></i>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import Swiper from "swiper";
import { DEFAULT_IMAGE } from "common/js/config.js";
import { mapWritableState, mapState, mapActions } from "pinia";

import { usePlayerStore, useAppStore } from "@/stores";
let vm = null;
export default {
data() {
  return {
    isLoop: false,
     isOverflow: false,
      marqueeDistance: 0,
      pauseAnimation: false,
      rafId: null,
  };
},
  inject: ["playerParams"],
  computed: {
    ...mapState(usePlayerStore, ["currentSong"]),
   ...mapWritableState(usePlayerStore, [
     "playing",
     "sequenceList",
     "currentPlayIndex",
     "songLoading",
      "currentPlayLyric",
   ]),
    ...mapWritableState(useAppStore, ["audio"]),
    ...mapWritableState(usePlayerStore, [
      "playerFullScreen",
      "isPlayerClick",
      "togglePlayList",
    ]),
   playIcon() {
     return this.playing ? "icon-zanting" : "icon-bofang";
   },
   cdCls() {
      return this.playing ? "play" : "play pause";
    },
    iconStyle() {
      return {
        marginLeft: this.playing ? "0.03rem" : "0.07rem",
      };
    },
  },
 mounted() {
   this.$nextTick(() => {
     // 初始化轮播图组件
     this.initSwiper();
     console.log(this.sequenceList);
   });
    setTimeout(() => {
      this.checkOverflow();
    }, 100);
 },
 created() {
   vm = this;
 },
  beforeUnmount() {
    this.stopMarquee();
  },
 watch: {
   currentSong() {
     if (this.currentSong) {
       this.stopMarquee();
       let index = this.sequenceList.findIndex(
         (item) => item.id === this.currentSong.id
       );
       this.swiper.slideTo(index, 0, false);
       this.$nextTick(() => this.checkOverflow());
     }
   },
   currentPlayLyric() {
      // 不停止 rAF，只冻结当前位置、重置、测量新宽度后恢复
      if (!this.rafId) return;
      this._marqueePos = 0;
      this._isPausing = false;
      this._pauseRemaining = 0;
      this.pauseAnimation = true;
      this.$nextTick(() => {
        this.checkOverflow();
        this.$nextTick(() => {
          if (this.isOverflow && this.marqueeDistance > 0) {
            this.pauseAnimation = false;
          }
        });
      });
   },
   playing() {
     this.stopMarquee();
     this.pauseAnimation = true;
     this.$nextTick(() => this.checkOverflow());
     setTimeout(() => {
       if (this.isOverflow && this.marqueeDistance > 0) {
         this.pauseAnimation = false;
       }
     }, 600);
   },
 },

  methods: {
   ...mapActions(usePlayerStore, ["next", "prev", "handleTogglePlaying"]),
    displayText(item) {
      // 播放状态显示歌词，暂停状态显示歌名
      if (this.playing && item.id === this.currentSong.id && this.currentPlayLyric) {
        return this.currentPlayLyric;
      }
      return item.name + " - " + item.singers;
    },
   handleShowFullPlay() {
      this.playerFullScreen = true;
      this.isPlayerClick = false;
    },
    // 查看歌曲列表
    handlePlayList() {
      this.togglePlayList = true;
    },
    // 初始化轮播图组件
    initSwiper() {
      // 通过settimeout 解决数据还没有完全加载的时候就已经渲染swiper，导致loop失效。
      setTimeout(() => {
        let index = this.sequenceList.findIndex(
          (item) => item.id === this.currentSong.id
        );
        // eslint-disable-next-line no-new
        vm.swiper = new Swiper(".player-swiper", {
          // 解决与vant标签页切换冲突问题
          observer: true,
          observeParents: true,
          initialSlide: index,
          centeredSlides: true,
          slidesPerView: "auto",
          on: {
            sliderMove(swiper, e) {
              e.stopPropagation();
            },
            slidePrevTransitionEnd() {
              vm.prev();
            },
            slideNextTransitionEnd() {
              vm.next();
            },
          },
        });
     }, 20);
   },
   checkOverflow() {
     const wrapper = document.querySelector(
       ".mini-play-container .song-info.active .song-name-wrapper"
     );
     const nameEl = wrapper?.querySelector(".song-name");
     if (!nameEl || !wrapper) {
       this.isOverflow = false;
       this.pauseAnimation = false;
       this.stopMarquee();
       return;
     }
     const textSpans = nameEl.querySelectorAll(".name-text");
     const singleWidth = textSpans.length > 0 ? textSpans[0].offsetWidth : 0;
      const wrapperWidth = wrapper.clientWidth;
      // 歌名始终滚动；歌词只在超出容器时滚动
      const needsScroll = this.playing ? singleWidth > wrapperWidth : true;

       if (needsScroll && !this.isOverflow) {
         this.isOverflow = true;
         this.pauseAnimation = true;
         this.$nextTick(() => {
           const updatedNameEl = wrapper.querySelector(".song-name");
           if (!updatedNameEl) return;
           const gapEl = updatedNameEl.querySelector(".name-gap");
           const gapWidth = gapEl ? gapEl.offsetWidth : 0;
           const spans = updatedNameEl.querySelectorAll(".name-text");
           const w = spans.length > 0 ? spans[0].offsetWidth : 0;
           this.marqueeDistance = w + gapWidth;
           this.startMarquee();
           this.$nextTick(() => {
             this.pauseAnimation = false;
           });
         });
       } else if (needsScroll) {
         const gapSpan = nameEl.querySelector(".name-gap");
         const gapWidth = gapSpan ? gapSpan.offsetWidth : 0;
         this.marqueeDistance = singleWidth + gapWidth;
         this.startMarquee();
       } else {
         this.isOverflow = false;
         this.pauseAnimation = false;
         this.stopMarquee();
       }
   },
   startMarquee() {
     if (this.rafId) return;
     if (!this.isOverflow || this.marqueeDistance <= 0) return;
      const wrapper = document.querySelector(
        ".mini-play-container .song-info.active .song-name-wrapper"
      );
      const nameEl = wrapper?.querySelector(".song-name");
      if (!nameEl) return;
      const speed = 40;
      this._marqueePos = 0;
      this._isPausing = false;
      this._pauseRemaining = 0;
      let lastTime = performance.now();
      const animate = (now) => {
        if (!this.isOverflow || this.marqueeDistance <= 0) {
          nameEl.style.transform = '';
          this.rafId = null;
          return;
        }
        const dt = (now - lastTime) / 1000;
        lastTime = now;
        if (this._isPausing) {
          this._pauseRemaining -= dt;
          if (this._pauseRemaining <= 0) {
            this._isPausing = false;
            this._pauseRemaining = 0;
          }
        } else if (!this.pauseAnimation) {
          this._marqueePos -= speed * dt;
          if (this._marqueePos <= -this.marqueeDistance) {
            this._marqueePos += this.marqueeDistance;
            // 滚完一圈回到开头，停顿一下
            this._isPausing = true;
            this._pauseRemaining = 1.5;
          }
          nameEl.style.transform = 'translateX(' + this._marqueePos + 'px)';
        }
        this.rafId = requestAnimationFrame(animate);
      };
      this.rafId = requestAnimationFrame(animate);
   },
   stopMarquee() {
     if (this.rafId) {
       cancelAnimationFrame(this.rafId);
       this.rafId = null;
     }
      // 停止时立即复位 DOM transform，防止新内容出现在旧位置
      const nameEl = document.querySelector(
        ".mini-play-container .song-info.active .song-name"
      );
      if (nameEl) nameEl.style.transform = '';
   },
 },
};
</script>
<style lang="stylus" scoped>
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
    box-shadow: 0 0rem 0.3rem rgba(0, 0, 0, 0.12);

    .player-swiper {
      flex: 1;
      min-width: 0;

      .swiper-slide {
        .swiper-list-item {
          display: flex;
          width: 100%;
          height: 100%;

          .left {
            position: relative;
            margin: 0 0.4rem 0 0.4rem;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .image-container {
              position: relative;
              width: 1.3rem;
              height: 1.3rem;

              .image {
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 0.1rem;
                background: $color-common-b;

                img {
                  position: absolute;
                  display: block;
                  width: 100%;
                  height: 100%;
                  border-radius: 0.1rem;
                }
              }

              .digital-album {
                position: absolute;
                top: 5%;
                left: 56%;
                width: 100%;
                height: 100%;

                img {
                  display: block;
                  width: 100%;
                  height: 90%;
                }
              }
            }
          }

          .right {
            flex: 1;
            overflow: hidden;
            min-width: 0;

            .song-info {
              display: flex;
              flex-direction: column;
              justify-content: space-evenly;
              height: 100%;

             &.active {
               color: $color-common;

               .singer {
                  color: $color-common;
                }
              }

             .song-name {
                display: inline-flex;
                white-space: nowrap;
                align-items: center;
                margin: 0;
                line-height: 1.5;

                .name-text {
                  flex-shrink: 0;
                  margin-top: 0.1rem;
                  line-height: $font-size-smaller-x;
                  font-size: $font-size-smaller-x;
                  font-weight: 400;
                }

               .name-gap {
                 flex-shrink: 0;
                 width: 1.2rem;
               }
             }

              .song-name-wrapper {
                overflow: hidden;
                width: 100%;
                display: flex;
                align-items: center;
                height: 100%;
             }
            }
          }
        }
      }
    }

    .player-controller {
      flex-shrink: 0;
      margin: 0 0.15rem;
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
        width: 1.1rem;
        height: 100%;

        i {
          font-size: 0.9rem;
        }
      }

      .play {
        position: relative;
        margin-right: 0.05rem;
        width: 1.1rem;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;

        .icon {
          position: absolute;
          color: $color-common;

          i {
            font-size: 0.4rem;
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
