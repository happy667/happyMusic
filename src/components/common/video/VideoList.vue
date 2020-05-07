<template>
  <div class="video-list-container">
    <div class="video-list">
      <template v-for="item in list">
        <video-item @click="handleClick"
                    v-fb
                    :video="item"
                    :key="item.id"></video-item>
      </template>

    </div>
  </div>
</template>
<script>
import VideoItem from './VideoItem'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleClick (video) {
      this.$emit('select', video)
    }
  },
  components: {
    VideoItem
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.video-list-container>>>.video-list-item-container {
  &:last-child {
    margin-bottom: 0;
  }
}

.video-list-container {
  width: 100%;
  background: $color-common-background;
  box-sizing: border-box;
}
</style>