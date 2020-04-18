<template>
  <div class="mv-list-container">
    <ul class="list">
      <li class="item"
          @click="handleClick(item)"
          v-for="item in list"
          :key="item.id">
        <mv-item :item="item" />
      </li>
    </ul>
  </div>
</template>

<script>
import MvItem from './MvItem'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleClick (item) {
      this.$emit('select', item)
    }
  },
  components: {
    MvItem
  }
}
</script>
<style lang="stylus" scoped>
.mv-list-container {
  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .item {
      width: 48%;
    }
  }
}
</style>