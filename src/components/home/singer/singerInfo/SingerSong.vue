<template>
  <div class="singer-song-container">
    <!-- loading -->
    <van-loading v-if="singerSong.length===0"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <!-- 歌曲数量 -->
    <template v-show="singerSong.length!==0">
      <div class="play">
        <div class="play-icon">
          <van-icon name="play-circle-o" />
        </div>
        <div class="play-all"
             @click="handleSelect(singerSong[0],0)">
          播放全部({{singerSong.length}})
        </div>
      </div>
      <!-- 歌曲列表 -->
      <song-list @select="handleSelect"
                 :showImage="true"
                 :currentIndex="currentPlayIndex"
                 :songsList="singerSong" />
    </template>
  </div>
</template>
<script>
import SongList from '@/components/home/song/SongList'
import { mapActions, mapState } from 'vuex'
export default {
  props: {
    singerSong: {
      type: Array,
      default: () => []
    }
  },
  components: {
    SongList
  },
  computed: {
    ...mapState(['currentPlayIndex'])
  },
  methods: {
    ...mapActions(['setSelectPlay', 'playMusic']),
    // 选择歌曲
    handleSelect (item, index) {
      if (this.currentPlayIndex === index) return
      this.playMusic({
        list: this.singerSong,
        index,
        song: item
      })
    }

  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-song-container {
  padding-top: 0.4rem;
  min-height: calc(100vh - (1.22667rem + 6rem + 1.18rem + 0.4rem));

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