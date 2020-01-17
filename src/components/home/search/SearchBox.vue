<template>
  <div class="search-box-container">
    <!-- 历史搜索 -->
    <div class="oldSearch">
      <!-- 搜索头部 -->
      <div class="search-list-header">
        <p class="title">历史搜索</p>
        <div class="icon">
          <i class="iconfont icon-shanchu"></i>
        </div>

      </div>
      <!-- 搜索列表 -->
      <ul class="old-search-list">
        <li class="old-search-list-item">Popular Music</li>
        <li class="old-search-list-item">Popular Music</li>
        <li class="old-search-list-item">水电费的说法是否的发1231231</li>
      </ul>
    </div>
    <!-- 热门搜索 -->
    <div class="recommend-Search">
      <!-- 搜索头部 -->
      <div class="search-list-header">
        <p class="title">热门搜索</p>
      </div>
      <van-loading v-if="this.hotSearchList.length===0"
                   size="24px"
                   color="#FD4979"
                   class="load"
                   vertical>加载中...</van-loading>
      <!-- 搜索列表 -->
      <ul class="hot-search-list"
          v-if="this.hotSearchList.length!==0">
        <li class="hot-search-list-item"
            @click="selectItem(item)"
            v-for="(item,index) in hotSearchList"
            :key="item.searchWord">
          <div class="left"
               :class="index<3?'top':''">
            <div class="index">{{index+1}}</div>
            <div class="search-info">
              <div class="top">{{item.searchWord}}</div>
              <div class="bottom">{{item.content}}</div>
            </div>
          </div>
          <div class="right">{{item.score}}</div>
        </li>
      </ul>
    </div>

  </div>
</template>
<script>
import searchApi from '@/api/search.js'
import { ERR_OK } from '@/api/config.js'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      hotSearchList: []// 热搜列表
    }
  },
  computed: {
    ...mapState(['searchKeywords'])
  },
  methods: {
    ...mapMutations(['setSearchKeywords', 'setSearchCurrentIndex']),
    // 获取热门搜索
    async getHotSearchList () {
      const { data: res } = await searchApi.getHotSearchList()
      if (res.code === ERR_OK) {
        this.hotSearchList = res.data
      }
    },
    selectItem (item) {
      // 重置标签页到第一个
      this.setSearchCurrentIndex(0)
      this.setSearchKeywords(item.searchWord)
      this.$router.push({ name: 'search/searchResult', params: { 'keywords': this.searchKeywords } })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getHotSearchList()
    })
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.search-box-container {
  height: 100%;
  padding: 0 0.5rem 0.5rem 0.5rem;

  .search-list-header {
    display: flex;
    justify-content: space-between;

    .title {
      font-weight: 300;
      line-height: 1rem;
      font-size: $font-size-smaller;
    }

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #999;
    }
  }

  .old-search-list {
    display: flex;
    flex-wrap: wrap;
    max-height: 10rem;
    font-size: $font-size-smaller-x;

    .old-search-list-item {
      margin-bottom: 0.3rem;
      margin-right: 0.2rem;
      padding: 0.08rem 0.15rem;
      word-break: break-all;
      height: 0.7rem;
      border-radius: 0.4rem;
      line-height: 0.73rem;
      color: #868e94;
      background: #f2f2f2;
      no-wrap();
    }
  }

  .recommend-Search {
    padding: 0;

    .hot-search-list {
      .hot-search-list-item {
        padding: 0.15rem 0;
        display: flex;
        justify-content: space-between;
        height: 1rem;
        color: $color-common-b;

        .left {
          display: flex;

          &.top {
            .index {
              color: $color-common;
            }

            .search-info {
              .top {
                font-weight: 600;
              }
            }
          }

          .index {
            line-height: 1rem;
            margin-right: 0.5rem;
          }

          .search-info {
            display: flex;
            flex-direction: column;
            line-height: 0.5rem;
            no-wrap();

            .top {
              color: $color-common-x;
              font-size: $font-size-smaller-x;
            }

            .bottom {
            }
          }
        }

        .right {
          line-height: 1rem;
        }
      }
    }
  }
}
</style>