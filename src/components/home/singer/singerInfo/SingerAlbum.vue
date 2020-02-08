<template>
  <div class="singer-album-container">
    <!-- loading -->
    <van-loading v-if="singerAlbum.length===0"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <template v-show="singerAlbum.length!==0">
      <div class="singer-album-wrapper">
        <van-list v-model="loading"
                  :finished="finished"
                  finished-text="没有更多专辑了"
                  :immediate-check='false'
                  @load="handlePullingUp">
          <ul class="singer-album-list">
            <li class="singer-album-list-item"
                @click="selectItem(item)"
                v-for="item in singerAlbum"
                :key="item.id">
              <div class="item-img">
                <img v-lazy="item.picUrl" />
              </div>
              <div class="item-name">{{item.name}}</div>
              <div class="item-pub-time">{{item.publishTime|convertDate}}</div>
            </li>
          </ul>

        </van-list>
      </div>
    </template>
  </div>
</template>
<script>
import 'common/js/convert.js'
export default {
  props: {
    singerAlbum: {
      type: Array,
      default: () => []
    },
    finished: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      loading: false
    }
  },
  watch: {
    singerAlbum () {
      // 没有加载完
      this.loading = false
    }
  },
  methods: {
    // 选择歌单进入歌单详情
    selectItem (item) {
      this.$router.push(`/singerAlbum/${item.id}`)
    },
    // 加载更多
    handlePullingUp () {
      this.$emit('pullingUp')
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-album-container>>>.van-list__loading .van-loading {
  height: 1rem;
}

.singer-album-container {
  padding: 0 0.4rem 0 0.4rem;
  min-height: calc(100vh - (1.22667rem + 6rem + 1.18rem + 0.4rem));

  .singer-album-wrapper {
    .singer-album-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .singer-album-list-item {
        padding: 0.2rem 0.3rem;
        background: #fff;
        box-shadow: 0 0.1rem 0.8rem rgba(0, 0, 0, 0.1);
        border-radius: 0.2rem;
        margin-bottom: 0.3rem;
        box-sizing: border-box;

        /* 选择最后一排 */
        &:nth-last-child(-n+3) {
          margin-bottom: 0;
        }

        .item-img {
          width: 2.2rem;
          height: 2rem;
          border-radius: 0.3rem;

          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 0.3rem;
          }
        }

        .item-name {
          width: 2rem;
          no-wrap();
          height: 0.5rem;
          line-height: 0.5rem;
        }

        .item-pub-time {
          color: #777;
          height: 0.5rem;
          line-height: 0.5rem;
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