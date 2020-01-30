<template>
  <div class="singer-song-container">
    <!-- loading -->
    <van-loading v-if="singerSong.length===0"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <!-- 歌曲数量 -->
    <template v-if="singerSong.length!==0">
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
                 :songsList="singerSong" />
    </template>
  </div>
</template>
<script>
import SongList from '@/components/home/song/SongList'
import 'common/js/utils.js'
import { mapMutations, mapGetters } from 'vuex'
export default {
  props: {
    singerSong: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    ...mapGetters(['currentSong'])
  },
  methods: {
    ...mapMutations(['setPlayerFullScreen']),
    // 选择歌曲
    handleSelect (item, index) {
      // 判断点击的是否是当前播放的歌曲
      if (this.currentSong.id === item.id) {
        this.setPlayerFullScreen(true)
        return
      }
      // 引入vue原型上的utils
      this.utils.playMusic(item, this.singerSong, index)
    }
  },
  components: {
    SongList
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