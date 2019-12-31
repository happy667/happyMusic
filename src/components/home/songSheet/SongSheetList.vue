<template>
  <div class="songs-sheet-list-container">
    <song-sheet-title :isShowLoadMore="true"
                      :title="title"></song-sheet-title>
    <ul class="songs-sheet-list">
      <li @click="selectItem(item)"
          class="songs-sheet-list-item"
          v-for="item in recommendList"
          :key="item.id">
        <song-sheet-item :song-sheet="item"></song-sheet-item>
      </li>
    </ul>
  </div>
</template>
<script>

import SongSheetTitle from '@/components/common/Title'
import SongSheetItem from './SongSheetItem'
export default {
  props: {
    title: String, // 标题
    recommendList: Array// 推荐列表
  },
  methods: {
    // 选择歌单进入歌单详情
    selectItem (item) {
      this.$router.push({ path: `/songSheetDisc/${item.id}` })
    }
  },
  components: {
    SongSheetTitle,
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