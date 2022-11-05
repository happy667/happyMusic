<template>
  <div class="search-list-container">
    <!-- 搜索列表 -->
    <ul class="list">
      <li class="list-item" v-for="(item,index) in list" @click="handleSearch(item)" :key="index">{{item}}</li>
    </ul>
  </div>
</template>
<script>
    export default {
        props: {
            list: {
                type: Array,
                default: () => []
            }
        },
        methods: {
            handleSearch(item) {
                this.$emit('select', item)
            }

        }
    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    .list {
        padding: 0.15rem 0;
        display: flex;
        flex-wrap: wrap;
        max-height: 10rem;
        font-size: $font-size-smaller-x;
        .list-item {
            margin-bottom: 0.3rem;
            margin-right: 0.2rem;
            padding: 0 0.2rem;
            word-break: break-all;
            height: 0.8rem;
            border-radius: 0.25rem;
            line-height: 0.8rem;
            color: $color-common-x;
            background: #f7f8fa;
            no-wrap();
            /* 选择最后一排 */
            &:nth-last-child(-n+3) {
                margin-bottom: 0;
            }
        }
    }
</style>