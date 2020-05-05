<template>
  <div class="song-list-container">
    <template v-if="loading">
      <!-- loading -->
      <loading :loading="loading" />
    </template>

    <!-- 歌曲数量 -->
    <template v-else-if="list&&list.length!==0">
      <play-all :length="list.length"
                @play="playAllSong(list)"></play-all>
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
import PlayAll from '@/components/common/PlayAll'
import { mapGetters } from 'vuex'
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
    selectSong (item, index) {
      // 比较两首歌曲
      let result = this.$utils.compareSong(this.currentSong, item)
      if (!result) {
        // 引入vue原型上的utils
        this.$utils.playMusic(item, this.list, index)
      }
    },

    playAllSong (list) {
      // 引入vue原型上的utils
      this.$utils.playAllSong(list)
    },
    handleNoLike (song) {
      this.$emit('noLike', song)
    }
  },
  components: {
    SongList,
    NoResult,
    PlayAll
  }
}
</script>