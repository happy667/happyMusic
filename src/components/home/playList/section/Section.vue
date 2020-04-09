<template>
  <section class="section-container">
    <scroll ref="section_scroll">
      <div class="container"
           ref="container">
        <!-- 播放列表 -->
        <ul class="play-list"
            ref="list">
          <li class="play-list-item"
              ref="listGroup"
              @click.stop="selectItem($event,item,index)"
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
                   v-show="item.id===currentSong.id ">
                <i class="iconfont icon-ziyuanldpi"></i>
              </div>
            </div>

            <div class="right delete"
                 @click.stop="handleDelete(item)">
              <div class="icon">
                <i class="iconfont icon-cha"></i>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </scroll>
  </section>
</template>
<script>
import Scroll from '@/components/common/Scroll'
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState(['currentPlayIndex', 'togglePlayList']),
    ...mapGetters(['currentSong']),
    playList: {
      get () {
        return this.$store.state.sequenceList
      },
      set (list) {
        this.$nextTick(() => {
          this.$store.commit('setSequenceList', list)
        })
      }
    }
  },
  watch: {
    playList (newList) {
      // 如果播放列表为空就隐藏
      if (newList.length === 0) {
        this.setTogglePlayList(false)
      }
    },
    togglePlayList: {
      immediate: true,
      handler (newVal) {
        if (newVal) {
          this.$nextTick(() => { // 获取更新后的dom,防止报错
            this.scrollList()
          })
        }
      }

    }
  },
  methods: {
    ...mapMutations(['setCurrentPlayIndex', 'setPlayerFullScreen', 'setTogglePlayList']),
    ...mapActions(['deleteSong']),
    // 移动元素
    scrollList () {
      if (this.playList.length === 0) return
      let element = this.$refs.listGroup[this.currentPlayIndex - 3]
      if (element) {
        this.$refs.section_scroll.scrollToElement(element, 0)
      } else {
        // 移动到第一个元素
        element = this.$refs.listGroup[0]
        this.$refs.section_scroll.scrollToElement(element, 0)
        this.$refs.section_scroll.refresh()
      }
    },
    // 选择歌曲
    selectItem (e, item, index) {
      // 引入vue原型上的utils
      this.$utils.playMusic(item, null, index)
    },

    // 移除歌曲
    handleDelete (song) {
      // 移除该歌曲
      this.deleteSong(song)
    }

  },
  components: {
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.section-container >>> .scroll {
  height: 9rem;
  overflow: hidden;
}

.section-container {
  width: 100%;

  .container {
    .play-list {
      .play-list-item {
        display: flex;
        justify-content: space-between;
        height: 1rem;
        line-height: 1rem;
        padding-left: 0.4rem;

        .left {
          display: flex;

          .song-desc {
            display: flex;
            width: 6.5rem;

            .text {
              no-wrap();
              color: $color-common-b2;

              .song-name {
                font-size: $font-size-smaller;
                color: $color-common-x;

                .song-singer {
                  font-size: $font-size-smaller-x;
                  color: $color-common-b2;
                }
              }
            }
          }
        }

        .icon {
          width: 1rem;
          text-align: center;

          i {
            font-size: $font-size-smaller;
          }
        }

        &.active {
          .left {
            color: $color-common;

            .song-desc {
              margin-right: 0.3rem;

              .text {
                color: $color-common;

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