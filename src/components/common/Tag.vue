<template>
  <div class="tag-list-container">
    <ul class="list">
      <li class="item"
          :style="[bgColorStyle,colorStyle]"
          v-for="(item,index) in tags"
          :key="index">
        <span>{{item}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    tags: {
      type: Array,
      default: () => []
    },
    color: {
      type: String,
      default: () => '#fff'
    },
    bgColor: {
      type: String,
      default: () => '#FD4979'
    }
  },
  computed: {
    bgColorStyle () {
      return {
        backgroundColor: this.bgColor
      }
    },
    colorStyle () {
      return {
        color: this.color
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.tag-list-container {
  .list {
    display: flex;

    .item {
      margin-right: 0.15rem;
      padding: 0 0.3rem;
      border-radius: 0.5rem;
      line-height: 0.6rem;

      span {
        font-size: $font-size-mini;
      }
    }
  }
}
</style>