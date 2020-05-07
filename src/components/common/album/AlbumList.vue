<template>
  <div class="albumList-container">
    <slot></slot>
    <div class="list-container">
      <ul class="list">
        <li class="item"
            v-for="item in list"
            :key="item.id"
            @click="handleClick(item)">
          <album :item="item"
                 :showSinger="showSinger"
                 :showSongSize="showSongSize"
                 :showTime="showTime" />
        </li>

      </ul>
    </div>
  </div>
</template>
<script>
import Album from './AlbumItem'
export default {
  props: {
    list: {
      type: Array
    },
    showSinger: {
      type: Boolean,
      default: () => true
    },
    showSongSize: {
      type: Boolean,
      default: () => false
    },
    showTime: {
      type: Boolean,
      default: () => true
    }
  },
  methods: {
    handleClick (item) {
      this.$emit('select', item)
    }
  },
  components: {
    Album
  }
}
</script>