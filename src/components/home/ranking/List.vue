<template>
  <div class="list-container">
    <ul class="list">
      <li class="list-item"
          @click="selectItem(item)"
          v-for="(item,index) in rankingList"
          :key="index">
        <div class="list-item-img">
          <img v-lazy="item.coverImgUrl"
               :key="item.coverImgUrl"
               class="animated fadeIn" />
        </div>
        <div class="list-item-title">{{item.name}}</div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    rankingList: Array
  },
  methods: {
    // 选择排行榜进入歌单详情
    selectItem (item) {
      this.$router.push({ path: `/songSheetDisc/${item.id}`, query: { rank: true } })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.list-container {
  .list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .list-item {
      height: 2.9rem;
      padding: 0.22rem;
      background: $color-common-background;
      box-shadow: 0 0.1rem 0.8rem rgba(0, 0, 0, 0.1);
      border-radius: 0.2rem;
      margin-bottom: 0.3rem;

      /* 选择最后一排 */
      &:nth-last-child(-n+3) {
        margin-bottom: 0;
      }

      .list-item-img {
        margin: 0 auto;
        width: 2.2rem;
        height: 2.2rem;
        border-radius: 0.2rem;
        margin-bottom: 0.22rem;
        background-color: $color-common-b;

        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 0.2rem;
        }
      }

      .list-item-title {
        width: 2.2rem;
        line-height: 0.5rem;
        no-wrap();
        text-align: center;
      }
    }
  }

  .list:after {
    content: '';
    width: 2.64rem;
  }
}
</style>