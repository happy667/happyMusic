<template>
  <div class="songs-sheet-small-container">
    <slot></slot>
    <ul class="songs-sheet-list">
      <li @click="selectItem(item)"
          class="songs-sheet-list-item"
          v-for="item in recommendList"
          :key="item.id">
        <div class="sons-img">
          <img v-lazy="item.picUrl">
        </div>
        <div class="songs-desc">{{item.name}}</div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    recommendList: Array// 推荐列表
  },
  methods: {
    // 选择歌单进入歌单详情
    selectItem (item) {
      this.$router.push({ path: `/songSheetInfo/${item.id}` })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.songs-sheet-small-container {
  width: 100%;
  background: $color-common-background;

  .songs-sheet-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 0.4rem;

    .songs-sheet-list-item {
      box-sizing: border-box;
      padding: 0.2rem;
      margin-bottom: 0.3rem;
      width: 31%;
      background: $color-common-background;
      box-shadow: 0 0.25rem 0.6rem rgba(0, 0, 0, 0.1);
      border-radius: 0.3rem;

      .sons-img {
        width: 100%;
        padding: 0 0.17rem;
        height: 2.2rem;
        box-sizing: border-box;
        border-radius: 0.3rem;
        margin-bottom: 0.2rem;

        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 0.3rem;
        }
      }

      .songs-desc {
        margin-bottom: 0.1rem;
        width: 100%;
        line-height: 0.5rem;
        word-wrap: break-word;
        font-size: $font-size-smaller;
        font-family: $font-common-title;
        text-align: center;
        no-wrap();
      }
    }
  }
}
</style>