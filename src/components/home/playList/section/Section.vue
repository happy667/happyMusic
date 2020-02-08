<template>
  <section class="section-container">
    <!-- 播放列表 -->
    <ul class="play-list"
        ref="list">
      <li class="play-list-item"
          @click="selectItem($event,item,index)"
          :class="item.id===currentSong.id ? 'active':''"
          v-for="(item,index) in playList"
          :key="item.id">
        <div class="left">
          <div class="song-desc">
            <div class="song-name">{{item.name+' - '}}</div>
            <div class="singer">{{item.singers}}</div>
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
  </section>
</template>
<script>
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
      } else {
        this.$nextTick(() => { // 获取更新后的dom,防止报错
          this.scrollList()
        })
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
      // 获取当前播放的歌曲节点
      const list = this.$refs.list
      // 首先查找当前播放歌曲在播放列表中的索引
      const index = this.playList.findIndex(item => item.id === this.currentSong.id)
      // 再找到当前索引的节点
      const element = list.childNodes[index]
      // 这里减去4个歌曲节点高度是因为保持每次移动位置在元素中间
      let top = element.offsetTop - (element.offsetHeight * 4)
      // 如果大于0就移动
      if (top > 0) {
        list.scrollTo(0, top)
      }
    },
    // 选择歌曲
    selectItem (e, item, index) {
      // 引入vue原型上的utils
      this.utils.playMusic(item, null, index)
    },

    // 移除歌曲
    handleDelete (song) {
      // 移除该歌曲
      this.deleteSong(song)
    }

  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.section-container {
  width: 100%;

  .play-list {
    height: 9rem;
    overflow: scroll;

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
          no-wrap();

          .song-name {
            font-size: $font-size-smaller;
          }

          .singer {
            color: $color-common-b;
            font-size: $font-size-smaller-x;
            no-wrap();
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
        color: $color-common;

        .left {
          .song-desc {
            margin-right: 0.3rem;

            .singer {
              color: $color-common;
            }
          }
        }
      }
    }
  }
}
</style>