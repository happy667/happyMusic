<template>
  <div class="mv-list-container">
    <div class="mv-list">
      <template v-for="item in list">
        <mv-item :mv="item"
                 :key="item.id"></mv-item>
      </template>

    </div>
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
  components: {
    MvItem
  }
}
</script>
<style lang="stylus" scoped>
.mv-list-container>>>.mv-list-item-container {
  &:last-child {
    margin-bottom: 0;
  }
}

.mv-list-container {
  width: 100%;
  background: $color-common-background;
}
</style>