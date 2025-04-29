<template>
  <section class="section-container"
           @click="toggleImage">
    <div class="song-index"
         v-show="playerShowImage">
      <div class="song-image">
        <div class="image-box"
             :class="cdCls">
          <div class="image">
            <img v-lazy="picUrl"
                 :key="picUrl">
          </div>
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
                v-if="currentLyric">
          <div class="lyric-list-container">
            <ul class="lyric-list">
              <li ref="lyricLine"
                  class="lyric-list-item"
                  :class="index===currentLineNum?'active':''"
                  v-for="(line,index) in currentLyric.lines"
                  :key="index">
                <p class="txt">{{line.txt}}</p>
                <p class="translateLyric"
                   v-if="line.translateText">{{line.translateText}}</p>
              </li>
            </ul>
          </div>
        </scroll>
        <div class="no-result"
             v-else>
          {{text}}
        </div>
      </div>
    </transition>
  </section>
</template>
<script>
import Lyric from 'lyric-parser'
import songApi from '@/api/song.js'
import Scroll from '@/components/common/Scroll'
import {
  DEFAULT_IMAGE
} from '@/assets/common/js/config.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  mapGetters,
  mapState,
  mapMutations
} from 'vuex'

export default {
  data () {
    return {
      nolyric: true,
      text: '歌词加载中...',
    }
  },
  inject: ['playerParams'],
  computed: {
    ...mapState(['playing', 'playerShowImage', 'currentLyric', 'currentLineNum', 'currentPlayLyric', 'playerFullScreen']),
    ...mapGetters(['currentSong']),
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    picUrl () {
      return this.currentSong.album ? this.currentSong.album.picUrl : DEFAULT_IMAGE
    },
    lyric () {
      return this.currentLyric
    }

  },
  methods: {
    ...mapMutations(['setPlayerShowImage', 'setCurrentLyric', 'setCurrentLineNum', 'setCurrentPlayLyric']),


    // 获取歌词
    getLyric (id) {
      this.text = '歌词加载中...'
      songApi.getSongLyric(id).then(res => {
        res = res.data

        if (res.code === ERR_OK) {
          // 没有歌词
          if (res.nolyric || !res.lrc.lyric) {
            this.text = '暂无歌词'
            this.setCurrentLyric(null)
          } else {
            // 先解析歌词
            let lyric = res.lrc.lyric
            // 创建lyric对象对歌词进行处理
            let currentLyric = new Lyric(lyric, this.handleLyric)
            if (res.tlyric) { //翻译歌词
              let tlyric = res.tlyric.lyric
              let translateLyric = new Lyric(tlyric, this.handleLyric)
              //同步歌词和翻译
              this.handleSynchronousTranslation(currentLyric, translateLyric)
            }
            this.setCurrentLyric(currentLyric)
            // 若解析出来没有歌词说明该歌曲没有歌词
            if (currentLyric.lines.length === 1) {
              this.text = currentLyric.lines[0].txt
              this.setCurrentLyric(null)
            }

            if (this.playing && this.currentLyric) {
              this.currentLyric.play()
            }
            setTimeout(() => {
              this.refresh()
            }, 20)
          }
        } else {
          this.$toast(res.data.message)
        }
      }).catch((e) => {
        console.log(e)
        this.text = '暂无歌词'
        this.setCurrentLyric(null)
        this.setCurrentLineNum(0)
      })
    },
    // lyric-parse中的方法
    handleLyric ({
      lineNum,
      txt
    }) {
      this.setCurrentLineNum(lineNum)
      if (lineNum > 4) {
        if (this.currentLyric) {
          let lineEl = this.$refs.lyricLine[lineNum - 4] // 滚动到元素
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        }
      } else {
        if (this.currentLyric) {
          this.$refs.lyricList.scrollTo(0, 0, 1000) // 滚动到顶部
        }
      }
      this.setCurrentPlayLyric(txt)
    },
    refresh () {
      if (this.$refs.lyricList) {
        this.$nextTick(() => {
          this.$refs.lyricList.refresh()
        })
      }
    },
    // 歌词和图片
    toggleImage () {
      this.setPlayerShowImage(!this.playerShowImage)
    },
    //同步歌词和翻译
    handleSynchronousTranslation (lyric, tlyric) {
      lyric.lines.forEach(item => {
        item.translateText = ''
      })
      tlyric.lines.forEach(item1 => {
        lyric.lines.forEach((item2, index) => {
          if (item1.time == item2.time) {
            lyric.lines[index].translateText = item1.txt
            return false
          }
        })
      })
    }
  },
  components: {
    Scroll
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

  .song-index {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    .song-image {
      margin-top: 0.5rem;
      width: 6.9rem;
      height: 6.9rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(#fff, 0.09);
      border-radius: 50%;

      .image-box {
        margin: 0 auto;
        width: 4.3rem;
        height: 4.3rem;
        padding: 1.1rem;
        background: transparent url('../../../../../src/assets/images/cover-bg.svg') center center;
        background-size: 100% 100%;

        .image {
          width: 100%;
          height: 100%;
          border-radius: 50%;

          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        &.play {
          animation: rotate 20s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .current-play-lyric {
      position: relative;
      padding: 0.6rem 0.5rem 1.6rem 0.5rem;
      height: 0;
      width: 8rem;
      text-align: center;
      font-size: $font-size-smaller;
      box-sizing: border-box;

      .text {
        position: absolute;
        padding-top: 1rem;
        box-sizing: border-box;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        width: 100%;
        line-height: 0.6rem;
        no-wrap2();
        color: #fff;
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
        margin-bottom: 0.4rem;
        text-align: center;
        font-size: $font-size-smaller;
        color: hsla(0, 0%, 100%, 0.6);

        &.active {
          color: #fff;
          transition: all 0.4s;
        }

        .translateLyric {
          font-size: $font-size-smaller-x;
        }
      }
    }
  }

  .no-result {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 100%;
    color: #e4e4e4;
    font-size: $font-size-smaller;
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