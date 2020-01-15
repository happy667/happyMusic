<template>
  <div class="title-container">
    <p class="songs-title">{{title}}</p>
    <div class="viewMore"
         v-if="isShowLoadMore">
      <router-link :to="path">
        更多
      </router-link>
      <van-icon name="arrow" />
    </div>
  </div>
</template>
<script>

export default {
  props: {
    title: String,
    isShowLoadMore: Boolean, // 是否显示更多
    path: String
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.title-container {
  padding: 0 0.4rem;
  display: flex;
  justify-content: space-between;
  font-size: $font-size-small-x;
  height: 1.1rem;
  line-height: 1.1rem;
  font-family: $font-common-title;

  .songs-title {
    height: 1.1rem;
    line-height: 1.1rem;
    font-weight: bold;
  }

  .viewMore {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $font-size-smaller;
    color: #999;

    a {
      margin-right: 0.1rem;
    }
  }
}
</style>