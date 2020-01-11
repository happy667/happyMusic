<template>
  <div class="singer-album-container">
    <!-- loading -->
    <van-loading v-show="singerAlbum.length===0"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <div class="singer-album-wrapper">
      <ul class="singer-album-list">
        <li class="singer-album-list-item"
            @click="selectItem(item)"
            v-for="item in singerAlbum"
            :key="item.id">
          <div class="item-img">
            <img v-lazy="item.picUrl" />
          </div>
          <div class="item-name">{{item.name}}</div>
          <div class="item-pub-time">{{item.publishTime|convertTime}}</div>
        </li>

      </ul>
    </div>
  </div>
</template>
<script>
import 'common/js/convert.js'
export default {
  props: {
    singerAlbum: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 选择歌单进入歌单详情
    selectItem (item) {
      console.log(item)
      this.$router.push({ path: `/songSheetDisc/${item.id}` })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-album-container {
  padding: 0.4rem;

  .singer-album-wrapper {
    .singer-album-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .singer-album-list-item {
        padding: 0.2rem 0.4rem;
        background: #fff;
        box-shadow: 0 0.1rem 0.8rem rgba(0, 0, 0, 0.1);
        border-radius: 0.2rem;
        margin-bottom: 0.3rem;
        width: 2.7rem;
        height: 3.2rem;
        box-sizing: border-box;

        /* 选择最后一排 */
        &:nth-last-child(-n+3) {
          margin-bottom: 0;
        }

        .item-img {
          width: 1.9rem;
          height: 1.8rem;
          border-radius: 0.3rem;

          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 0.3rem;
          }
        }

        .item-name {
          no-wrap();
          height: 0.5rem;
          line-height: 0.5rem;
        }

        .item-pub-time {
          height: 0.5rem;
          line-height: 0.5rem;
          color: #777;
        }
      }
    }

    .singer-album-list:after {
      content: '';
      width: 2.7rem;
    }
  }
}
</style>