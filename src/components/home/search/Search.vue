<template>
  <div class="search-container">
    <!-- 头部导航 -->
    <van-sticky>
      <van-nav-bar title="搜索"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>
    <!--搜索框-->
    <van-search left-icon=""
                right-icon="search"
                :placeholder="searchDefault"
                shape="round"
                @input="handleInput"
                v-model="searchVal"
                @search="handleSearch">
    </van-search>
    <!-- 搜索列表 -->
    <div class="search-list-container"
         v-show="showSearchList">
      <ul class="search-list">
        <li class="search-list-item"
            @click="selectItem(item)"
            v-for="(item,index) in searchList"
            :key="index">
          <div class="icon">
            <van-icon name="search" />
          </div>
          {{item}}
        </li>
      </ul>
    </div>
    <template>
      <router-view></router-view>
    </template>

  </div>
</template>
<script>
import searchApi from '@/api/search.js'
import { ERR_OK } from '@/api/config.js'
import { addLocalSearch } from '@/assets/common/js/localStorage.js'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      searchDefault: '', // 搜索默认关键词
      searchList: '', // 搜索列表
      showSearchList: false// 显示搜索列表
    }
  },
  inject: ['reload'],
  mounted () {
    this.$nextTick(() => {
      this.getSearchDefault()
    })
  },
  computed: {
    ...mapState(['searchKeywords']),
    // 搜索框的值
    searchVal: {
      get () {
        return this.searchKeywords ? this.searchKeywords : ''
      },
      set (val) {
        this.setSearchKeywords(val)
      }
    }
  },

  methods: {
    ...mapMutations(['setSearchKeywords', 'setSearchCurrentIndex']),
    // 返回上一个路由
    routerBack () {
      if (this.$route.path === '/search/searchPage') {
        this.$router.push('/home')
        return
      }
      // 清空搜索内容
      this.setSearchKeywords('')
      this.$router.back()
    },
    // 获取默认关键词
    async  getSearchDefault () {
      const { data: res } = await searchApi.getSearchDefault()
      if (res.code === ERR_OK) {
        this.searchDefault = res.data.realkeyword
      }
    },
    // 搜索综合内容
    async getSearchAll () {
      const { data: res } = await searchApi.getSearchAll(this.searchKeywords)
      if (res.code === ERR_OK) {
        if (res.result.allMatch) {
          this.searchList = res.result.allMatch.map(item => item.keyword)
        }
      }
    },
    // 搜索
    async handleSearch () {
      this.showSearchList = false
      // 重置标签页到第一个
      this.setSearchCurrentIndex(0)
      if (this.searchKeywords.trim().length === 0) {
        this.setSearchKeywords(this.searchDefault)
      }// 没有输入按默认搜索关键词搜索
      // 将搜索的内容保存在本地
      addLocalSearch(this.searchKeywords)
      if (this.$route.path === '/search/searchPage') {
        this.$router.push('/search/searchResult')
      } else {
        this.reload()
      }
    },
    // 输入搜索内容
    handleInput () {
      if (this.searchKeywords.trim().length === 0) {
        this.showSearchList = false
      } else {
        this.showSearchList = true
        this.getSearchAll()
      }
    },
    // 选择搜索名称
    selectItem (item) {
      this.setSearchKeywords(item)
      this.showSearchList = false
      // 重置标签页到第一个
      this.setSearchCurrentIndex(0)
      // 将搜索的内容保存在本地
      addLocalSearch(this.searchKeywords)
      if (this.$route.path === '/search/searchPage') {
        this.$router.push('/search/searchResult')
      } else {
        this.reload()
      }
    }

  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.van-tabs {
  height: 100% !important;
}

.van-cell {
  padding: 0.2rem 0.3rem;
}

.van-search__content {
  border: 0.03rem solid #e3e3e3;
}

.van-search {
  height: 1.8rem;
  padding: 0.25rem 0.32rem;
  box-sizing: border-box;
}

.search-container {
  width: 100%;
  background: #fff;
  min-height: 100vh;

  .search-list-container {
    position: absolute;
    background: $color-common-background;
    width: 100%;
    padding: 0 0.4rem;
    box-sizing: border-box;
    max-height: 8rem;
    z-index: 99;
    box-shadow: 0 0.25rem 0.6rem rgba(0, 0, 0, 0.1);

    .search-list {
      .search-list-item {
        display: flex;
        padding: 0 0.2rem;
        border-top: 0.02rem solid #efefef;
        line-height: 1rem;
        height: 1rem;
        font-size: $font-size-smaller-x;
        color: $color-common-x;

        .icon {
          margin-right: 0.2rem;
          font-size: 0.45rem;
        }
      }
    }
  }
}
</style>