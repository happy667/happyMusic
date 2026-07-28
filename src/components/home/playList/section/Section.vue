<template>
  <section class="section-container">
    <div class="scroll-wrapper"
         ref="scrollWrapper"
         @scroll="handleScroll">
      <div class="content">
        <ul class="play-list">
          <li class="play-list-item"
              @click.prevent
              @touchstart="onTouchStart($event)"
              @touchend="onTouchEnd($event, item, index)"
              :class="item.id===currentSong.id ? 'active':''"
              v-for="(item,index) in playList"
              :key="item.id">
            <div class="left">
              <div class="song-desc">
                <div class="text">
                  <span class="song-name">{{item.name+' - '}} <span class="song-singer">{{item.singers}}</span></span>
                </div>
              </div>
              <div class="icon"
                   v-if="item.id===currentSong.id">
                <img src="@/assets/images/loading.svg">
              </div>
            </div>

            <div class="right delete"
                 @click.stop="handleDelete(item)">
              <div class="icon">
                <van-icon name="cross"
                          size="16" />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
<script>
import { mapWritableState, mapState, mapActions } from 'pinia'

import { usePlayerStore } from '@/stores'
export default {
  data () {
    return {
      touchStartY: 0,
      touchMoved: false
    }
  },
  computed: {
    ...mapState(usePlayerStore, ['currentSong']),
    ...mapWritableState(usePlayerStore, ['togglePlayList', 'playList', 'sequenceList']),
    playList: {
      get () {
        return this.sequenceList
      },
      set (list) {
        this.sequenceList = list
      }
    }
  },
  watch: {
    playList (newList) {
      if (newList.length === 0) {
        this.togglePlayList = false
      }
      this.$nextTick(() => {
        setTimeout(() => this.refresh(), 20)
      })
    },
    togglePlayList: {
      immediate: true,
      handler (newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.scrollList()
          })
        }
      }
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['deleteSong']),
    onTouchStart (e) {
      this.touchStartY = e.touches[0].clientY
      this.touchMoved = false
    },
    onTouchEnd (e, item, index) {
      const endY = e.changedTouches[0].clientY
      const moved = endY !== this.touchStartY
      if (!moved) {
        this.$utils.playMusic(item, null, index)
      }
    },
    handleScroll () {
      // native scroll fallback - not active with better-scroll
    },
    scrollList () {
      if (this.playList.length === 0) return
      const playIndex = this.playList.findIndex(item => item.id === this.currentSong.id)
      if (playIndex === -1) return
      const wrapper = this.$refs.scrollWrapper
      if (!wrapper) return
      const items = wrapper.querySelectorAll('.play-list-item')
      if (items.length === 0) return
      // 第一个直接滚到顶部，否则当前歌曲上方留 3 首作为上下文
      const target = playIndex <= 2 ? 0 : playIndex - 3
      if (items[target]) {
        items[target].scrollIntoView({ behavior: 'instant', block: 'start' })
      }
    },
    handleDelete (song) {
      this.deleteSong(song)
    },
    refresh () {
      this.$nextTick(() => {
        if (this.$refs.scrollWrapper) {
          // no-op with native scroll, kept for API compatibility
        }
      })
    }
  },
  components: {
  }
}
</script>
<style lang="stylus" scoped>
.scroll-wrapper {
  position: relative;
  height: 9rem;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
}

.section-container {
  width: 100%;

  .content {
    .play-list {
      .play-list-item {
        display: flex;
        justify-content: space-between;
        height: 1rem;
        line-height: 1rem;
        padding-left: 0.4rem;

        .left {
          display: flex;
          flex: 1;
          overflow: hidden;

          .song-desc {
            overflow: hidden;

            .text {
              no-wrap();
              color: $color-common-b2;

              .song-name {
                font-size: $font-size-smaller-x;
                color: $color-common-x;

                .song-singer {
                  font-size: $font-size-mini;
                  color: $color-common-b2;
                }
              }
            }
          }

          .icon {
            width: 0.6rem;
            height: 100%;
            padding-left: 0.2rem;

            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }
        }

        .right {
          .icon {
            color: $color-common-b2;
            width: 1.15rem;
            height: 100%;
            text-align: center;

            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }
        }

        &.active {
          .left {
            .song-desc {
              .text {
                .song-name {
                  color: $color-common;

                  .song-singer {
                    color: $color-common;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
