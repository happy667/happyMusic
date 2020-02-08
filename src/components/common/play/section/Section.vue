<template>
  <section class="section-container"
           @click="toggleImage">
    <div class="song-index"
         v-show="playerShowImage">
      <div class="song-image">
        <div class="image"
             :class="cdCls">
          <img v-lazy="currentSong.picUrl">
          <div class="img-linght"></div>
        </div>
      </div>
      <div class="current-play-lyric">
        <p class="text">{{currentPlayLyric}}</p>
      </div>
    </div>
    <transition enter-active-class="animated fadeIn faster">
      <div class="lyric"
           v-show="!playerShowImage">
        <scroll ref="lyricList"
                v-if="!nolyric||currentLyric">
          <div class="lyric-list-container">
            <ul class="lyric-list">
              <li ref="lyricLine"
                  class="lyric-list-item"
                  :class="index===currentLineNum?'active':''"
                  v-for="(line,index) in currentLyric.lines"
                  :key="index">
                {{line.txt}}</li>
            </ul>
          </div>
        </scroll>
        <div class="no-result"
             v-else>
          <no-result text="该歌曲暂无歌词"></no-result>
        </div>
      </div>
    </transition>
  </section>
</template>
<script>
import Lyric from 'lyric-parser'
import songApi from '@/api/song.js'
import Scroll from '@/components/common/Scroll'
import NoResult from '@/components/common/NoResult'
import {
  ERR_OK
} from '@/api/config.js'
import { mapGetters, mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      nolyric: true
    }
  },
  computed: {
    ...mapState(['playing', 'playerShowImage', 'currentLyric', 'currentLineNum', 'currentPlayLyric']),
    ...mapGetters(['currentSong']),
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    }
  },
  methods: {
    ...mapMutations(['setPlayerShowImage', 'setCurrentLyric', 'setCurrentLineNum', 'setCurrentPlayLyric']),
    // 获取歌词
    getLyric (id) {
      songApi.getSongLyric(id).then(res => {
        res = res.data
        if (res.code === ERR_OK) {
          // if (res.klyric.lyric) {
          //   this.setCurrentLyric(new Lyric(res.klyric.lyric, this.handleLyric))
          // } else if (res.lrc.lyric) {
          //   this.setCurrentLyric(new Lyric(res.lrc.lyric, this.handleLyric))
          // }
          if (res.nolyric) {
            this.nolyric = res.nolyric
            this.setCurrentLyric(null)
          } else {
            this.setCurrentLyric(new Lyric(res.lrc.lyric, this.handleLyric))
          }
          if (this.playing) { // 如果是播放状态
            this.currentLyric.play()
          }
        }
      }).catch(() => {
        this.setCurrentLyric(null)
        this.setCurrentLineNum(0)
      })
    },
    // 处理歌词
    handleLyric ({ lineNum, txt }) {
      this.setCurrentLineNum(lineNum)
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]// 滚动到元素
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)// 滚动到顶部
      }
      this.setCurrentPlayLyric(txt)
    },
    // 歌词和图片
    toggleImage () {
      this.setPlayerShowImage(!this.playerShowImage)
    }
  },
  components: {
    Scroll,
    NoResult
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.section-container>>>.scroll {
  height: 100%;
  overflow: hidden;
}

.section-container>>>.no-result-container {
  color: #fff;
  font-size: $font-size-smaller;
  line-height: 1rem;
}

.section-container {
  position: relative;
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .song-index {
    .song-image {
      .image {
        position: relative;
        width: 6rem;
        height: 6rem;
        border-radius: 50%;
        padding: 1.5rem;
        background: transparent url('http://s3.music.126.net/mobile-new/img/disc-plus.png?b700b62e1971b351dcb8b8ce1c9ceea3=') center center;
        background-size: 100% 100%;
        border-radius: 50%;

        &.play {
          animation: rotate 20s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }

        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: $color-common-b;
        }

        .img-linght {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: transparent url('http://s3.music.126.net/mobile-new/img/disc_light-plus.png?4392c8c9a8a33d4b2b2c33d3995503c9=') center center;
          background-size: 100% 100%;
        }
      }
    }

    .current-play-lyric {
      margin-top: 0.5rem;
      position: relative;
      padding: 0.5rem;
      height: 0;
      width: 8rem;
      text-align: center;
      font-size: $font-size-smaller;

      .text {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        height: 1.1rem;
        line-height: 1.1rem;
        no-wrap();
      }
    }
  }
}

.lyric {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  padding-top: 0.5rem;

  .lyric-list-container {
    width: 100%;

    .lyric-list {
      padding: 0 1rem;

      .lyric-list-item {
        line-height: 0.6rem;
        margin-bottom: 0.3rem;
        text-align: center;
        color: $color-common;
        font-size: $font-size-smaller-x;

        &.active {
          color: #fff;
          font-size: $font-size-smaller;
          transition: all 0.4s;
        }
      }
    }
  }

  .no-result {
    height: 100%;
    display: flex;
    align-items: center;
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