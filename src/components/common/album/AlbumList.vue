<template>
  <div class="albumList-container">
    <slot></slot>
    <div class="list-container">
      <ul class="list">
        <li class="item" v-for="item in list" :key="item.id" @click="handleClick(item)">
          <album :showFunctions="showFunctions" :item="item" @removeAlbumItem="removeAlbumItem" :showSinger="showSinger"
            :showSongSize="showSongSize" :showTime="showTime" />
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
            },
            showFunctions: {
                type: Boolean,
                default: () => false
            }
        },
        methods: {
            handleClick(item) {
                this.$emit('select', item)
            },
            removeAlbumItem(id) {
                let index = this.list.findIndex(item => item.id = id)
                this.list.splice(index, 1)
            }
        },
        components: {
            Album
        }
    }
</script>