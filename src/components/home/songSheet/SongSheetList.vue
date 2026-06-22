<template>
  <div class="song-sheet-list-container">
    <slot></slot>

    <ul v-if="list && list.length !== 0" class="songs-sheet-list">
      <li
        @click.stop="selectItem(item)"
        class="songs-sheet-list-item"
        v-for="item in list"
        :key="item.id"
      >
        <song-sheet-item :song-sheet="item"></song-sheet-item>
      </li>
    </ul>

    <no-result v-else-if="list && list.length === 0" text="暂无相关歌单"></no-result>
  </div>
</template>
<script>
import NoResult from "@/components/common/NoResult";
import SongSheetItem from "./SongSheetItem";
export default {
  props: {
    list: Array, // 列表
  },
  methods: {
    // 选择歌单进入歌单详情
    selectItem(item) {
      console.log(item.id);
      this.$router.push(`/songSheetDisc/${item.id}`);
    },
  },

  components: {
    SongSheetItem,
    NoResult,
  },
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.song-sheet-list-container {
  width: 100%;

  .songs-sheet-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 0.4rem;

    .songs-sheet-list-item {
      width: 46%;
      margin-bottom: 0.5rem;
    }
  }
}
</style>
