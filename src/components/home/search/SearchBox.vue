<template>
  <div class="search-box-container">
    <scroll ref="search_scroll"
            @scroll="scroll"
            :listenScroll="listenScroll">
      <section class="container"
               ref="container">
        <!-- 历史搜索 -->
        <div class="oldSearch"
             v-if="localSearchList&&localSearchList.length!==0">
          <!-- 搜索头部 -->
          <div class="search-list-header">
            <p class="title">历史搜索</p>
            <div class="icon"
                 @click="clearLocalList"
                 v-fb>
              <i class="iconfont icon-shanchu"></i>
            </div>
          </div>
          <search-list :list="localSearchList"
                       @select="selectItem"></search-list>
        </div>
        <!-- 热门搜索 -->
        <div class="recommend-Search">
          <!-- 搜索头部 -->
          <div class="search-list-header">
            <p class="title">热门搜索</p>
          </div>
          <!-- loading -->
          <loading :loading="load" />
          <!-- 搜索列表 -->
          <ul class="hot-search-list"
              v-if="this.hotSearchList.length!==0">
            <li class="hot-search-list-item"
                @click="selectItem(item)"
                v-fb
                v-for="(item,index) in hotSearchList"
                :key="item.searchWord">
              <div class="left"
                   :class="index < 3 ? 'top' : ''">
                <div class="index">{{index+1}}</div>
                <div class="search-info">
                  <div class="top">
                    <span class="name">{{item.searchWord}}</span>
                    <span class="icon"
                          v-if="item.iconUrl">
                      <img :src="item.iconUrl">
                    </span>
                  </div>
                  <p class="bottom">{{item.content}}</p>
                </div>
              </div>
              <div class="right">{{item.score}}</div>
            </li>
          </ul>
        </div>
      </section>
    </scroll>
  </div>

</template>
<script>
import Scroll from '@/components/common/Scroll'
import SearchList from './SearchList'
import searchApi from '@/api/search.js'
import { ERR_OK } from '@/api/config.js'
import { mapState, mapMutations } from 'vuex'
import { getLocalList, clearLocalList, addLocalSearch } from '@/assets/common/js/localStorage.js'
import { playlistMixin } from '@/assets/common/js/mixin.js'
export default {
  name: 'searchPage',
  data () {
    return {
      hotSearchList: [], // 热搜列表
      localSearchList: [], // 历史搜索列表
      load: false
    }
  },
  mixins: [playlistMixin],
  computed: {
    ...mapState(['searchKeywords', 'showSearchList'])
  },
  created () {
    this.listenScroll = true
  },
  watch: {
    localSearchList () {
      this.handlePlaylist(this.playList)
    }
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
    },
    scroll (pos) {
      this.closeSearchList()
    },
    handlePlaylist (playList) {
      // 适配播放器与页面底部距离
      const bottom = playList.length > 0 ? '1.6rem' : ''
      this.$nextTick(() => {
        this.$refs.container.style.paddingBottom = bottom
        this.$refs.search_scroll.refresh()
      })
    }
  },
  activated () {
    if (getLocalList()) { this.localSearchList = getLocalList() }// 如果本地存在历史记录就赋值
  },
  components: {
    Scroll,
    SearchList
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.search-box-container>>> .scroll {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.search-box-container {
  position: relative;
  flex: 1;
  background: $color-common-background;
  box-sizing: border-box;

  .container {
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
            width: 1%;
            flex: 1;
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
              flex: 1;
              display: flex;
              flex-direction: column;
              line-height: 0.5rem;
              overflow: hidden;

              .top {
                display: flex;

                .name {
                  color: $color-common-x;
                  font-size: $font-size-smaller-x;
                  margin-right: 0.15rem;
                  no-wrap();
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
                no-wrap();
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
}
</style>