<template>
  <div class="video-list-container">
    <div class="video-list">
      <template v-for="item in list"
                :key="item.id">
        <video-item @select-video="handleSelectVideo"
                    :video="item"></video-item>
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
    handleSelectVideo (video) {
      this.$emit('select', video)
    }
  },
  components: {
    VideoItem
  }
}
</script>
<style lang="stylus" scoped>
.video-list-container :deep(.video-list-item-container) {
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
