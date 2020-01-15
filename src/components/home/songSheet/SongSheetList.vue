<template>
  <div class="songs-sheet-list-container">

    <slot></slot>
    <ul class="songs-sheet-list">
      <li @click="selectItem(item)"
          class="songs-sheet-list-item"
          v-for="item in songSongList"
          :key="item.id">
        <song-sheet-item :song-sheet="item"></song-sheet-item>
      </li>
    </ul>
  </div>
</template>
<script>

import SongSheetItem from './SongSheetItem'
import { mapActions } from 'vuex'
export default {
  props: {
    title: String, // 标题
    list: Array// 列表
  },
  data () {
    return {
      newList: []// 新查询的列表
    }
  },
  computed: {
    songSongList () {
      return this.title ? this.newList : this.list
    }
  },
  methods: {
    ...mapActions(['getSongSheet']),
    // 选择歌单进入歌单详情
    selectItem (item) {
      this.$router.push({ path: `/songSheetDisc/${item.id}` })
    }
  },
  mounted () {
    if (this.title) {
      // 根据名称获取列表
      this.getSongSheet({ name: this.title }).then((res) => {
        this.newList = res
      })
    }
  },

  components: {
    SongSheetItem
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.songs-sheet-list-container {
  width: 100%;
  background: $color-common-background;

  .songs-sheet-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 0.4rem;

    .songs-sheet-list-item {
      width: 46%;
      margin-bottom: 0.6rem;
    }
  }
}
</style>