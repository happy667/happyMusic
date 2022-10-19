<template>
  <div class="video-item-container">
    <div class="container">
      <div class="video-image" @click="goToVideoInfo">
        <div class="cover-image">
          <img v-lazy="videoParams.coverUrl" class="animated fadeIn">
        </div>
        <div class="cover-controller">
          <div class="top-controller">
            <div class="controller-box">
              <div class="play-controller">
                <div class="play-right">
                  <!-- 播放次数 -->
                  <div class="play-count">
                    <i class="iconfont icon-bofang"></i>
                    {{videoParams.playCount|convertCount}}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 播放按钮 -->
          <div class="big-btn">
            <van-icon name="play-circle-o" />
          </div>

        </div>

      </div>
      <div class="video-info">
        <div class="info-top van-hairline--bottom" @click="goToVideoInfo">
          <!-- 视频标题 -->
          <div class="title">
            <div class="name">{{videoParams.name}}</div>
          </div>
        </div>

        <!-- 视频出处 -->
        <div class="info-bottom" @click="selectSinger(videoParams.artist)">
          <div class="play-source-img">
            <my-image :src="videoParams.artist.avatarUrl" class="animated fadeIn" />
          </div>
          <div class="play-source-author">
            {{videoParams.artist.name}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    import MyImage from '@/components/common/img/Image'
    import 'common/js/convert.js'
    import {
        mapMutations
    } from 'vuex'
    export default {
        props: {
            videoParams: {
                type: Object,
                default: () => {}
            }

        },
        methods: {
            ...mapMutations(['setSingerCurrentIndex']),
            // 跳转到video详情页
            goToVideoInfo() {
                // 说明不是视频详情页
                if (!this.moreInfo) {
                    this.$router.push(`/videoInfo/${this.videoParams.id}`)
                } else { // 切换显示更多信息
                    this.$emit('toggleInfo')
                }
            },

            // 选择歌手
            selectSinger(item) {
                this.setSingerCurrentIndex(0)
                this.$router.push(`/singerInfo/${item.id}`)
            }
        },
        components: {
            MyImage
        }
    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    .video-item-container {
        padding-bottom: 0.3rem;
        background: $color-common-b;
        .container {
            padding: 0.3rem 0.4rem 0;
            background: $color-common-background;
            .video-image {
                position: relative;
                width: 100%;
                height: 5rem;
                .cover-image {
                    width: 100%;
                    height: 100%;
                    border-radius: 0.2rem;
                    background: $color-common-b;
                    img {
                        display: block;
                        width: 100%;
                        height: 100%;
                        border-radius: 0.2rem;
                    }
                }
                .cover-controller {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    z-index: 10;
                    .top-controller {
                        position: absolute;
                        width: 100%;
                        top: 0;
                        left: 0;
                        .controller-box {
                            width: 100%;
                            height: 1.3rem;
                            padding: 0 0.3rem;
                            box-sizing: border-box;
                            .play-count {
                                font-size: $font-size-smaller-x;
                            }
                            .play-controller {
                                text-align: right;
                                line-height: 1.3rem;
                                color: #fff;
                            }
                        }
                    }
                    .big-btn {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        margin-left: -1rem;
                        margin-top: -1rem;
                        width: 2rem;
                        height: 2rem;
                        background: rgba(255, 255, 255, 0);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        .van-icon {
                            display: block;
                            color: #fff;
                            font-size: 2rem;
                            opacity: 0.7;
                        }
                    }
                }
            }
            .video-info {
                .info-top {
                    padding: 0.1rem 0.2rem;
                    .title {
                        width: 100%;
                        line-height: 1rem;
                        no-wrap();
                        .name {
                            font-size: $font-size-smaller;
                            no-wrap();
                        }
                    }
                }
                .info-bottom {
                    padding: 0.2rem;
                    display: flex;
                    align-items: center;
                    .play-source-img {
                        margin-right: 0.3rem;
                    }
                    .play-source-author {
                        font-size: $font-size-smaller;
                    }
                }
            }
        }
    }
</style>