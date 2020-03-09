<template>
  <div class="search-box-container">
    <!-- 历史搜索 -->
    <div class="oldSearch"
         v-if="localSearchList&&localSearchList.length!==0">
      <!-- 搜索头部 -->
      <div class="search-list-header">
        <p class="title">历史搜索</p>
        <div class="icon"
             @click="clearLocalList">
          <i class="iconfont icon-shanchu"></i>
        </div>

      </div>
      <!-- 搜索列表 -->
      <ul class="old-search-list">
        <li class="old-search-list-item"
            v-for="(item,index) in localSearchList"
            @click="selectItem(item)"
            :key="index">{{item}}</li>
      </ul>
    </div>
    <!-- 热门搜索 -->
    <section class="recommend-Search">
      <!-- 搜索头部 -->
      <div class="search-list-header">
        <p class="title">热门搜索</p>
      </div>
      <van-loading v-if="load"
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
               :class="index < 3 ? 'top' : ''">
            <div class="index">{{index+1}}</div>
            <div class="search-info">
              <div class="top">
                <div class="name">{{item.searchWord}}</div>
                <div class="icon"
                     v-if="item.iconUrl">
                  <img :src="item.iconUrl">
                </div>
              </div>
              <div class="bottom">{{item.content}}</div>
            </div>
          </div>
          <div class="right">{{item.score}}</div>
        </li>
      </ul>
    </section>

  </div>
</template>
<script>
import searchApi from '@/api/search.js'
import { ERR_OK } from '@/api/config.js'
import { mapState, mapMutations } from 'vuex'
import { getLocalList, clearLocalList, addLocalSearch } from '@/assets/common/js/localStorage.js'
export default {
  name: 'searchPage',
  data () {
    return {
      hotSearchList: [], // 热搜列表
      localSearchList: [], // 历史搜索列表
      load: false
    }
  },
  computed: {
    ...mapState(['searchKeywords', 'showSearchList'])
  },
  mounted () {
    // 获取热门搜索
    this.getHotSearchList()
    if (getLocalList()) { this.localSearchList = getLocalList() }// 如果本地存在历史记录就赋值
  },
  methods: {
    ...mapMutations(['setSearchKeywords', 'setSearchCurrentIndex', 'selectSearchItem', 'setShowSearchList']),
    // 获取热门搜索
    async getHotSearchList () {
      this.load = true
      const { data: res } = await searchApi.getHotSearchList()
      if (res.code === ERR_OK) {
        this.hotSearchList = res.data
        this.load = false
      }
    },
    // 选择搜索名称
    selectItem (item) {
      this.closeSearchList()
      // 重置标签页到第一个
      this.setSearchCurrentIndex(0)
      this.setSearchKeywords(item.searchWord || item)
      // 将搜索的内容保存在本地
      addLocalSearch(this.searchKeywords)
      this.$router.push('/search/searchResult')
    },
    // 清空历史搜索记录
    clearLocalList () {
      this.$Dialog.confirm({
        message: '确定要清空历史搜索?',
        confirmButtonColor: '#FD4979',
        width: '265px'
      }).then(() => {
        clearLocalList()
        this.localSearchList = []// 清空当前数组
      }).catch(() => {

      })
    },
    // 关闭搜索列表
    closeSearchList () {
      if (this.showSearchList) {
        this.setShowSearchList(false)
      }
    }
  },
  activated () {
    if (getLocalList()) { this.localSearchList = getLocalList() }// 如果本地存在历史记录就赋值
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.search-box-container {
  height: 100%;
  padding: 0 0.5rem;

  .search-list-header {
    display: flex;
    justify-content: space-between;

    .title {
      font-weight: bold;
      line-height: 1rem;
      font-size: $font-size-smaller-x;
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
      padding: 0 0.2rem;
      word-break: break-all;
      height: 0.8rem;
      border-radius: 0.25rem;
      line-height: 0.8rem;
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
        color: $color-common-b2;

        .left {
          display: flex;

          &.top {
            .index {
              font-weight: 600;
              color: $color-common;
            }

            .search-info {
              .top {
                .name {
                  font-weight: 600;
                }
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
              display: flex;

              .name {
                color: $color-common-x;
                font-size: $font-size-smaller-x;
                margin-right: 0.15rem;
              }

              .icon {
                height: 0.5rem;
                padding: 0.08rem 0;
                box-sizing: border-box;

                img {
                  display: block;
                  width: 32%;
                }
              }
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