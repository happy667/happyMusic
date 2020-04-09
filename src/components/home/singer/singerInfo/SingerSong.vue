<template>
  <div class="song-list-container">
    <template v-if="loading">
      <!-- loading -->
      <loading :loading="loading" />
    </template>

    <!-- 歌曲数量 -->
    <template v-else-if="list&&list.length!==0">
      <div class="play">
        <div class="play-icon">
          <van-icon name="play-circle-o" />
        </div>
        <div class="play-all"
             @click="playAllSong(list[0],list)">
          播放全部({{list.length}})
        </div>
      </div>
      <!-- 歌曲列表 -->
      <song-list @noLike="handleNoLike"
                 @select="selectSong"
                 ref="songList"
                 :showImage="true"
                 :songsList="list" />

    </template>
    <template v-else-if="list&&list.length===0">
      <no-result :text="noResult"></no-result>
    </template>

  </div>
</template>
<script>
import NoResult from '@/components/common/NoResult'
import SongList from '@/components/home/song/SongList'

import { mapMutations, mapGetters } from 'vuex'
export default {
  props: {
    list: {
      type: Array,
      default: () => null
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    noResult: {
      type: String,
      default: () => '暂无相关歌曲'
    }
  },

  computed: {
    ...mapGetters(['currentSong'])
  },
  methods: {
    ...mapMutations(['setPlayerFullScreen']),

    selectSong (item, index) {
      // 比较两首歌曲
      let result = this.$utils.compareSong(this.currentSong, item)
      if (!result) {
        // 引入vue原型上的utils
        this.$utils.playMusic(item, this.list, index)
      }
    },
    // 比较两首歌曲
    playAllSong (item, list) {
      let result = this.$utils.compareSong(this.currentSong, item)
      if (!result) {
        // 引入vue原型上的utils
        this.$utils.playAllSong(list)
      }
    },
    handleNoLike (song) {
      this.$emit('noLike', song)
    }
  },
  components: {
    SongList,
    NoResult

  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.song-list-container {
  box-sizing: border-box;

  .play {
    display: flex;
    padding-left: 0.4rem;

    .play-icon {
      font-size: $font-size-small;
      color: $color-common;
      margin-right: 0.2rem;

      i {
        line-height: 0.8rem;
      }
    }

    .play-all {
      font-size: $font-size-smaller;
      height: 0.8rem;
      line-height: 0.8rem;
    }
  }
}
</style>