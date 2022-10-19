<template>
  <div class="singer-list-container">
    <ul class="singer-list">
      <li v-for="item in list" :key="item.id">
        <singer-item :singer="item"  :imageSize="imageSize"  @select="handleSelect" />
      </li>
    </ul>
  </div>
</template>
<script>
    import SingerItem from './SingerItem'
    import {
        mapMutations
    } from 'vuex'
    export default {
        props: {
            list: {
                type: Array,
                default: () => []
            },
            imageSize: {
                type: String,
                default: () => 'normal'
            }
        },
        methods: {
            ...mapMutations(['setSingerCurrentIndex']),
            // 选择歌手
            handleSelect(item) {
                this.$emit('select', item)
            }
        },
        components: {
            SingerItem
        }
    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    .singer-list-container {
        .singer-list {
            .singer-list-item {
                ul {
                    display: flex;
                    flex-direction: column;
                    flex-wrap: wrap;
                    justify-content: space-between;
                }
            }
        }
    }
</style>