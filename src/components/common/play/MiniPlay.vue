<template>
  <transition enter-active-class="animated fadeIn faster" leave-active-class="animated fadeOut faster">
    <div class="mini-play-container" @click="handleShowFullPlay">
      <div class="fixed">
        <div class="swiper-container player-swiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="item in sequenceList" :key="item.id">
              <div class="swiper-list-item">
                <!-- 左侧图片 -->
                <div class="left">
                  <div class="image-container">
                    <div class="image">
                      <img v-lazy="item.album.picUrl||item.picUrl" class="animated fadeIn">
                    </div>
                    <div class="digital-album">
                      <img src="@/assets/images/digital-album.svg" class="animated fadeIn">
                    </div>
                  </div>

                </div>
                <div class="right">
                  <!--歌曲信息-->
                  <div class="song-info" :class="currentSong.id===item.id?'active':''">
                    <p class="song-name">{{item.name+' - '+item.singers}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 按钮区域 -->
        <div class="player-controller">
          <div class="play" @click.stop="handleTogglePlaying">
            <van-circle v-model="playerParams.width" size="30" color="#fd4979" layer-color="#E2E2E2">
            </van-circle>
            <div class="icon">
              <i class="iconfont" :style="iconStyle" :class="playIcon"></i>
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
    import Swiper from 'swiper'
    import {
        DEFAULT_IMAGE
    } from 'common/js/config.js'
    import {
        mapMutations,
        mapGetters,
        mapState,
        mapActions
    } from 'vuex'
    let vm = null
    export default {
        data() {
            return {
                isLoop: false
            }
        },
        inject: ['playerParams'],
        computed: {
            ...mapGetters(['currentSong']),
            ...mapState(['playing', 'audio', 'sequenceList', 'currentPlayIndex']),
            playIcon() {
                return this.playing ? 'icon-zanting' : 'icon-bofang'
            },
            cdCls() {
                return this.playing ? 'play' : 'play pause'
            },
            iconStyle() {
                return {
                    marginLeft: this.playing ? '0.03rem' : '0.07rem'
                }
            }
        },
        mounted() {
            this.$nextTick(() => {
                // 初始化轮播图组件
                this.initSwiper()
                console.log(this.sequenceList)
            })
        },
        created() {
            vm = this
        },
        watch: {
            currentSong() {
                if (this.currentSong) {
                    let index = this.sequenceList.findIndex(item => item.id === this.currentSong.id)
                    this.swiper.slideTo(index, 0, false)
                }
            }
        },

        methods: {
            ...mapMutations(['setPlayerFullScreen', 'setIsPlayerClick', 'setTogglePlayList']),
            ...mapActions([
                'next',
                'prev',
                'handleTogglePlaying'
            ]),
            handleShowFullPlay() {
                this.setPlayerFullScreen(true)
                this.setIsPlayerClick(false)
            },
            // 查看歌曲列表
            handlePlayList() {
                this.setTogglePlayList(true)
            },
            // 初始化轮播图组件
            initSwiper() {
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
                        slidesPerView: 'auto',
                        on: {
                            sliderMove(e) {
                                e.stopPropagation()
                            },
                            slidePrevTransitionEnd() {
                                vm.prev()
                            },

                            slideNextTransitionEnd() {
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
            box-shadow: 0 0rem 0.3rem rgba(0, 0, 0, 0.12);
            .player-swiper {
                flex: 1;
                .swiper-slide {
                    .swiper-list-item {
                        display: flex;
                        width: 100%;
                        height: 100%;
                        .left {
                            position: relative;
                            margin: 0 0.4rem 0 0.3rem;
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
                                    margin-top: 0.1rem;
                                    line-height: $font-size-smaller-x;
                                    font-size: $font-size-smaller-x;
                                    font-weight: 400;
                                    no-wrap();
                                }
                            }
                        }
                    }
                }
            }
            .player-controller {
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
                        font-size: 0.7rem;
                    }
                }
                .play {
                    position: relative;
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
                            font-size: 0.3rem;
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