<template>
  <div class="video-container">
    <!-- 播放器区域 -->
    <div class="player"
         ref="player"
         @click.stop="handlFirstPlay">
      <van-loading class="load"
                   size="1rem"
                   color="#FD4979"
                   v-show="videoLoad" />
      <video :src="videoParams.videoUrl"
             preload='metadata'
             ref="video"
             muted
             :id="videoParams.id"
             playsinline="true"
             x-webkit-airplay="allow"
             x5-video-player-type='h5'
             x5-video-orientation="portraint"
             x5-video-player-fullscreen='true'
             x5-video-ignore-metadata='true'
             :poster="videoParams.cover"></video>

      <!-- 播放按钮 -->
      <div class="big-btn"
           v-show="isFirstPlay">
        <van-icon name="play-circle-o" />
      </div>
      <template v-if="isFirstPlay">
        <transition-group enter-active-class="animated fadeIn faster"
                          leave-active-class="animated fadeOut faster">
          <div class="big-btn"
               key="btn"
               v-show="isClickScreen">
            <van-icon @click.stop="handleTogglePlay"
                      :name="icon" />
          </div>
        </transition-group>
      </template>
      <template v-else>
        <div class="big-btn"
             key="btn"
             v-show="isClickScreen">
          <van-icon @click.stop="handleTogglePlay"
                    :name="icon" />
        </div>
      </template>
      <div class="play-controller"
           :style="isClickScreen?'bottom:.13rem':''">
        <div class="play-left">
          <!-- 播放次数，未播放时显示 -->
          <div class="play-count"
               v-show="isFirstPlay">
            <i class="iconfont icon-bofang"></i>
            {{videoParams.playCount|convertPlayCount}}
          </div>
          <transition-group enter-active-class="animated fadeIn faster"
                            leave-active-class="animated fadeOut faster">
            <!-- 播放时长，点击屏幕后显示 -->
            <div class="play-time"
                 key="play-time"
                 v-show="isClickScreen">
              {{currenTime|convertPlayTime}}/{{videoParams.duration|convertPlayTime}}
            </div>
          </transition-group>
        </div>
        <!-- 播放时长 未播放时显示-->
        <div class="play-right">
          <div class="play-time"
               v-show="isFirstPlay">
            <i class="iconfont icon-shichang"></i>
            {{videoParams.duration|convertPlayTime}}
          </div>
          <template v-if="isFirstPlay">
            <div class="full"
                 key="full"
                 v-show="isClickScreen"
                 @click.stop="handleFullScreen">
              <i class="iconfont icon-amplification_icon"></i>
            </div>
          </template>
          <template v-else>
            <transition-group enter-active-class="animated fadeIn faster"
                              leave-active-class="animated fadeOut faster">
              <!-- 放大图标 点击屏幕时显示-->
              <div class="full"
                   key="full"
                   v-show="isClickScreen"
                   @click.stop="handleFullScreen">
                <i class="iconfont icon-amplification_icon"></i>
              </div>
            </transition-group>
          </template>
        </div>
        <!-- 进度条 点击屏幕时显示-->
        <div class="progress"
             key="progress">
          <van-slider active-color="#FD4979"
                      @input="handleSlideChange"
                      v-model="slideVal">
            <div slot="button"
                 key="button2"
                 v-show="isClickScreen"
                 :class="isClickScreen?'button':''">
            </div>
          </van-slider>
        </div>
      </div>
    </div>
    <!-- 视频描述 -->
    <div class="play-info">
      <!-- 视频标题 -->
      <div class="play-title"
           @click="goToVideoInfo">{{videoParams.name}}</div>
      <!-- 视频出处 -->
      <div class="play-source"
           @click="selectSinger(videoParams.artist)">
        <div class="play-source-img">
          <music-img :avatar="this.videoParams.artist.img1v1Url"></music-img>
        </div>
        <div class="play-source-author">
          {{videoParams.artistName}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MusicImg from '../img/MusicImg'
import 'common/js/convert.js'
import { mapMutations, mapState } from 'vuex'
export default {
  props: {
    videoParams: {
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      slideVal: 0,
      isFirstPlay: true, // 是否是第一次播放
      isPlay: false, // 是否播放
      isFullScreen: false, // 是否全屏
      isClickScreen: false, // 是否点击了播放器
      currenTime: 0, // 当前播放时长
      videoLoad: true// video是否加载
    }
  },
  mounted () {
    // 获取播放时长时间
    this.$nextTick(() => {
      this.video = this.$refs.video
      this.video.oncanplay = () => { // 可以播放了
        setTimeout(() => {
          // 修改时间
          this.videoParams.duration = this.video.duration
          this.videoLoad = false
        }, 20)
      }
      // 更新时间
      this.updateTime()
    })
  },
  computed: {
    ...mapState(['oldVideo']),
    icon () {
      return this.isPlay ? 'pause-circle-o' : 'play-circle-o'
    }
  },
  watch: {
    currenTime () {
      if (this.currenTime === this.video.duration) { // 播放完了
        this.initVideo(this.video)
      }
    }
  },

  methods: {
    ...mapMutations(['setSinger', 'setSelectVideo', 'setOldVideo', 'setSingerCurrentIndex']),
    // 跳转到mv详情页
    goToVideoInfo () {
      // 因为该组件用到了多个地方，但是在mv详情页不需要做跳转，所以需要判断当前路由地址
      if (this.$route.path !== '/videoInfo') {
        this.setSelectVideo(this.videoParams)
        this.$router.push('/videoInfo')
      }
    },
    // 更新时间
    updateTime () {
      this.video.ontimeupdate = () => {
        // 更新滚动条
        let width = (this.video.currentTime / this.video.duration) * 100
        this.currenTime = this.video.currentTime
        this.slideVal = width
      }
    },
    // 重置视频
    initVideo (video) {
      // 重置播放
      video.currentTime = 0
      video.slideVal = 0
      video.load()
      video.isFirstPlay = true
      video.isPlay = false
      video.isClickScreen = false
    },
    // 暂停上一个视频
    pauseOldVideo (obj) {
      if (this.oldVideo && this.oldVideo.video) {
        if (this !== this.oldVideo) {
          if (obj.isPlay) {
            obj.isPlay = false
            obj.video.pause()
          }
          obj.isFirstPlay = true
          obj.isClickScreen = false
        }
      }
    },
    // 滑动进度条
    handleSlideChange () {
      this.video.currentTime = this.slideVal * this.video.duration / 100
    },
    // 点击屏幕
    handleClickScreen () {
      console.log('屏幕')
      this.isClickScreen = !this.isClickScreen
      this.hideBtn()
    },
    // 隐藏按钮
    hideBtn () {
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => { // 超过三秒如果没有操作就关掉控件
        if (this.isClickScreen) {
          // 判断是否为播放状态,如果是就隐藏
          if (this.isPlay) this.isClickScreen = false
        }
      }, 3000)
    },
    // 点击播放暂停
    handleTogglePlay () {
      this.isPlay = !this.isPlay
      if (this.isPlay) {
        this.video.play()
      } else {
        this.video.pause()
      }
      this.hideBtn()
    },
    // 是否为第一次播放
    handlFirstPlay () {
      if (this.videoLoad) return
      // 关闭静音
      // 静音 告诉谷歌浏览器, 这个视频是安全的, 可以默默播放.
      this.video.muted = false
      // 暂停上一次正在播放的video
      this.pauseOldVideo(this.oldVideo)
      if (this !== this.oldVideo) {
        this.setOldVideo(this)
      }
      if (this.isFirstPlay) {
        console.log('first')
        this.isFirstPlay = false
        this.handleTogglePlay()
      } else {
        this.handleClickScreen()
      }
    },

    // 切换全屏播放
    handleFullScreen () {
      this.isFullScreen = !this.isFullScreen
      this.isFullScreen ? this.$refs.player.webkitRequestFullScreen() : document.webkitCancelFullScreen()
    },
    // 选择歌手
    selectSinger (item) {
      this.setSinger(item)
      this.setSingerCurrentIndex(0)
      this.$router.push('/singerInfo')
    }
    // 视频宽高设置为手机宽高
    // videoFullScreen () {
    //   let player = this.$refs.player
    //   let width = document.documentElement.clientWidth
    //   let height = document.documentElement.clientHeight
    //   player.style.height = width + 'px'
    //   player.style.width = height + 'px'
    //   player.className = 'full'
    // }
  },
  components: {
    MusicImg
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.video-container {
  margin-bottom: 0.5rem;
  width: 100%;
  height: 8rem;
  box-shadow: 0 0.05rem 1rem rgba(0, 0, 0, 0.1);
  border-radius: 0 0 0.3rem 0.3rem;
  touch-action: none;

  .player {
    position: relative;
    width: 100%;
    height: 5rem;
    margin-bottom: 0.2rem;

    .load {
      position: absolute;
      width: 100%;
      height: 5rem;
      line-height: 5rem;
      z-index: 99;
      text-align: center;
      background: $color-common-b;
    }

    video {
      display: block;
      width: 100%;
      height: 5rem;
      background: $color-common-b;
      object-fit: fill;
      object-position: center center;
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
      z-index: 10;

      .van-icon {
        display: block;
        color: #fff;
        font-size: 2rem;
        opacity: 0.7;
      }
    }

    .play-controller {
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 0 0.3rem;
      width: 100%;
      box-sizing: border-box;
      height: 1.3rem;
      line-height: 1.3rem;
      color: #fff;
      display: flex;
      justify-content: space-between;

      .play-right {
        .full {
          position: absolute;
          top: 0;
          right: 0.3rem;
          font-size: $font-size-small;
        }
      }

      .progress {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;

        .button {
          width: 0.25rem;
          height: 0.25rem;
          border-radius: 50%;
          background: $color-common;
        }
      }
    }
  }

  .play-info {
    .play-title {
      padding: 0.1rem 0.2rem;
      margin-bottom: 0.2rem;
      line-height: 1rem;
      font-size: $font-size-smaller;
      no-wrap();
      border-bottom: 0.02rem solid #efefef;
    }

    .play-source {
      padding: 0.1rem 0.2rem;
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
</style>