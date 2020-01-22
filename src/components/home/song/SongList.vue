<template>
  <div class="songs-list-containter">
    <ul class="songs-list">
      <li class="songs-list-item"
          :class="index===currentIndex?'active':''"
          v-for="(item,index) in songsList"
          @click="selectItem(item,index)"
          :key="item.id">
        <song-item :song="item"
                   :top="index<3&&rank"
                   :index="index+1"></song-item>
      </li>
    </ul>
  </div>
</template>
<script>
import SongItem from './SongItem'
import { mapState } from 'vuex'
export default {
  props: {
    songsList: Array,
    currentIndex: Number
  },
  computed: {
    ...mapState(['rank'])
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
        border-left: 3px solid $color-common;
      }
    }
  }
}
</style>