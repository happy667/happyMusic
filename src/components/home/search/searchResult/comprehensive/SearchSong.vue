<template>
  <!-- 歌曲 -->
  <div class="search"
       v-if="song&&song.songList.length!==0">
    <div class="search-song">
      <song-list @select="selectSong"
                 :showIndex="false"
                 :songsList="song.songList">
        <div class="header">
          <Title title="单曲"></Title>
          <play-all :length="song.songList.length"
                    @play="handlePlayAll(song.songList)"></play-all>
        </div>
      </song-list>
      <div class="more"
           v-if="song.moreText"
           @click="$emit('setIndex',1)"
           v-fb>
        <div class="text">
          {{song.moreText}}
        </div>
        <div class="icon">
          <van-icon name="arrow" />
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import Title from '@/components/common/Title'
import PlayAll from '@/components/common/PlayAll'
import SongList from '@/components/home/song/SongList'
import { mapGetters } from 'vuex'
export default {
  props: {
    song: Object
  },
  computed: {
    ...mapGetters(['currentSong'])
  },
  methods: {
    // 播放全部歌曲
    handlePlayAll (list) {
      // 引入vue原型上的utils
      this.$utils.playAllSong(list)
    },
    // 选择歌曲播放
    async selectSong (item, index) {
      this.$emit('closeList')
      // 比较两首歌曲
      let result = this.$utils.compareSong(this.currentSong, item)
      if (!result) {
        // 引入vue原型上的utils
        this.$utils.playMusic(item)
      }
    }
  },
  components: {
    PlayAll,
    SongList,
    Title
  }
}
</script>
<style lang="stylus" scoped>
.search>>>.play-all-container {
  padding-left: 0;
  padding-right: 0.4rem;
  height: 1.1rem;
  line-height: 1.1rem;
}

.search .search-song .header {
  display: flex;
  justify-content: space-between;
}
</style>