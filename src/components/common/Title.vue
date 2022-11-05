<template>
  <div class="title-container" :class="borderLeft?'border-left':''" :style="styleInfo">
    <h2 class="title">{{title}}</h2>
    <router-link tag="div" :to="path" class="viewMore" v-if="loadMore">
      更多
      <van-icon name="arrow" />
    </router-link>
  </div>
</template>
<script>
    export default {
        props: {
            title: String,
            // 显示更多
            loadMore: {
                type: Boolean,
                default: () => false
            },
            borderLeft: {
                type: Boolean,
                default: () => false
            },
            styleInfo: String,
            path: String
        }
    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    .border-left {
        padding-left: 0.2rem;
        border-left: 0.08rem solid $color-common;
    }
    
    .title-container {
        display: flex;
        justify-content: space-between;
        background: $color-common-background;
        .title {
            height: 1rem;
            line-height: 1rem;
            font-weight: bold;
            font-size: $font-size-smaller-x;
        }
        .viewMore {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: $font-size-smaller-x;
            color: $color-common-b2;
            a {
                margin-right: 0.1rem;
            }
        }
    }
</style>