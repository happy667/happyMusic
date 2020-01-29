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
import songApi from '@/api/song.js'
import { ERR_OK } from '@/api/config.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters(['currentSong']),
    playList: {
      get () {
        return this.$store.state.playList
      },
      set (list) {
        this.$nextTick(() => {
          console.log(this.currentSong)
          this.$store.commit('setPlayList', list)
        })
      }
    }
  },
  methods: {
    ...mapMutations(['setCurrentPlayIndex']),
    ...mapActions(['checkMusic', 'setSelectPlay']),
    // 选择歌曲
    selectItem (e, item, index) {
      if (e.target.className !== 'right delete') {
        if (!item.picUrl) this.getSongDetail(item)
        if (this.currentPlayIndex === index) return
        this.playMusic(item, this.playList, index)
      }
    },
    async getSongDetail (item) {
      // 获取歌曲详情
      const { data: res } = await songApi.getSongDetail(item.id)
      if (res.code === ERR_OK) {
        item.picUrl = res.songs[0].al.picUrl
      }
    },
    // 播放歌曲
    playMusic (song, list, index) {
      // 检查音乐是否可用
      this.checkMusic(song.id).then(res => {
        if (res.success) {
          // 设置当前播放歌曲
          this.setSelectPlay({
            list,
            index
          })
        }
      }).catch((res) => {
        // 提示
        this.$toast(res.message)
      })
    },
    // 移除歌曲
    handleDelete (index) {
      console.log(index)
      this.playList.splice(index, 1)
      console.log(this.playList, index)
      // 如果删除的是当前的歌曲就播放下一首
      if (index === this.currentPlayIndex) {
        this.setCurrentPlayIndex(this.currentPlayIndex++)
      }
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