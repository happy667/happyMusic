<template>
  <div class="song-sheet-mini-list-container">
    <div class="list">
      <template v-for="item in list">
        <song-sheet-mini-item :item="item"
                              :key="item.id"></song-sheet-mini-item>
      </template>

    </div>
  </div>
</template>
<script>
import SongSheetMiniItem from './SongSheetMiniItem'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  components: {
    SongSheetMiniItem
  }
}
</script>
<style lang="stylus" scoped>
.song-sheet-mini-list-container>>>.song-sheet-mini-item-container {
  &:last-child {
    margin-bottom: 0;
  }
}

.song-sheet-mini-list-container {
  width: 100%;
  background: $color-common-background;
}
</style>