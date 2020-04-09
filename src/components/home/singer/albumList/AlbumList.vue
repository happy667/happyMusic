<template>
  <div class="album-container">
    <ul class="album-list">
      <li class="album-list-item"
          @click="selectItem(item)"
          v-for="item in list"
          :key="item.id">
        <album :item="item"></album>
      </li>
    </ul>
  </div>
</template>
<script>

import Album from './AlbumItem'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 选择歌单
    selectItem (item) {
      this.$emit('select', item)
    }
  },
  components: {
    Album
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.album-container {
  .album-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .album-list-item {
      margin-bottom: 0.4rem;
    }
  }

  .album-list:after {
    content: '';
    width: 2.7rem;
  }
}
</style>