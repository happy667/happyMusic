<template>
  <div class="songs-list-containter">
    <ul class="songs-list">
      <li class="songs-list-item"
          :class="currentSong.id === item.id ? 'active' : ''"
          v-for="(item,index) in songsList"
          @click="selectItem(item,index)"
          :key="item.id">
        <song-item :showImage="showImage"
                   :song="item"
                   :top="index<3&&rank"
                   :index="index+1"></song-item>
      </li>
    </ul>
  </div>
</template>
<script>
import SongItem from './SongItem'
import { mapState, mapGetters } from 'vuex'
export default {
  props: {
    songsList: Array,
    showImage: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    ...mapState(['rank']),
    ...mapGetters(['currentSong'])
  },

  methods: {
    // 跳转到mv详情页
    goToVideoInfo () {
      this.$router.push('/videoInfo')
    },
    // 选择歌曲
    selectItem (song, index) {
      this.$emit('select', song, index)
    }
  },
  components: {
    SongItem
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.songs-list-containter {
  .songs-list {
    .songs-list-item {
      &.active>>>.songs-list-item-containter {
        .sg-info, .song-name, .song-index {
          color: $color-common;
        }

        &::after {
          position: absolute;
          top: 50%;
          left: 0;
          content: '';
          display: block;
          margin-top: -0.65rem;
          width: 3px;
          height: 1.3rem;
          background: $color-common;
        }
      }
    }
  }
}
</style>