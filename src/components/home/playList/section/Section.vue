<template>
  <section class="section-container">
    <!-- 播放列表 -->
    <ul class="play-list">
      <li class="play-list-item"
          @click.stop="selectItem($event,item,index)"
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
             @click.stop="handleDelete(index)">
          <div class="icon">
            <i class="iconfont icon-cha"></i>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>
<script>
import 'common/js/utils.js'
import { mapGetters, mapMutations, mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['currentPlayIndex']),
    ...mapGetters(['currentSong']),
    playList: {
      get () {
        return this.$store.state.playList
      },
      set (list) {
        this.$nextTick(() => {
          this.$store.commit('setPlayList', list)
        })
      }
    }
  },
  watch: {
    playList (newList) {
      // 如果播放列表为空就隐藏
      if (newList.length === 0) this.setTogglePlayList(false)
    }
  },
  methods: {
    ...mapMutations(['setCurrentPlayIndex', 'setPlayerFullScreen', 'setTogglePlayList']),
    // 选择歌曲
    selectItem (e, item, index) {
      if (e.target.className !== 'right delete') {
        // 引入vue原型上的utils
        this.utils.playMusic(item, null, index)
      }
    },

    // 移除歌曲
    handleDelete (index) {
      // 如果删除的是当前的歌曲就播放下一首
      if (index === this.currentPlayIndex) {
        let list = this.playList
        list.splice(index, 1)
        this.playList = list
        if (index >= this.playList.length - 1) {
          console.log(11111)
          index = 0
        }
      } else {
        index++
      }
      this.setCurrentPlayIndex(index)
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