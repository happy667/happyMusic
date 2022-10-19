<template>
  <div class="search-container">
    <!-- 头部导航 -->
    <van-sticky>
      <van-nav-bar :title="$route.meta.title"
                   ref="navBar"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>

    <div class="container">
      <!--搜索框-->
      <van-search left-icon="search"
                  :placeholder="searchDefault.showKeyword"
                  shape="round"
                  show-action
                  @input="handleInput"
                  v-model="searchVal"
                  @search="handleSearch">
        <template #action>
          <div @click="handleSearch">搜索</div>
        </template>
      </van-search>
      <!-- 搜索列表 -->
      <section class="search-list-container"
               v-show="showSearchList">
        <ul class="search-list">
          <li class="search-list-item van-hairline--bottom"
              @click="selectItem(item)"
              v-for="(item,index) in searchList"
              :key="index">
            <div class="icon">
              <van-icon name="search" />
            </div>
            {{item}}
          </li>
        </ul>
        <div class="close-search-list" v-show="searchList&&searchList.length>0" @click="closeSearchList">关闭</div>
      </section>

      <router-view></router-view>

    </div>

  </div>

</template>
<script>
import searchApi from '@/api/search.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  addLocalSearch
} from '@/assets/common/js/localStorage.js'
import {
  mapState,
  mapMutations
} from 'vuex'
import {
  utils
} from '@/assets/common/js/utils.js'
import {
  SEARCH_TYPE
} from '@/assets/common/js/config.js'

export default {
  name: 'search',
  data () {
    return {
      searchDefault: '', // 搜索默认关键词
      searchList: null // 搜索列表
    }
  },
  inject: ['reload'],
  computed: {
    ...mapState(['searchKeywords', 'showSearchList', 'noCacheComponents', 'selectSearchWord']),
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
  watch: {
    selectSearchWord () {
      if (this.selectSearchWord) {
        this.setSearchKeywords(this.selectSearchWord)
        this.search()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getSearchDefault()
    })
    // 监听页面滚动
    this.addScrollListner()
  },
  activated () {
    // 监听页面滚动
    this.addScrollListner()
  },
  deactivated () {
    // 取消监听页面滚动
    this.removeScrollListner()
  },
  destroyed () {
    // 取消监听页面滚动
    this.removeScrollListner()
  },
  methods: {
    ...mapMutations(['setSearchKeywords', 'setSearchCurrentIndex', 'setShowSearchList', 'setAddNoCacheComponents']),
    // 返回上一个路由
    routerBack () {
      if (this.$route.path === '/search/searchPage') {
        this.$router.push('/home')
        return
      }
      // 清空搜索内容
      this.setSearchKeywords('')
      this.$utils.routerBack()
    },
    // 关闭搜索列表
    closeSearchList () {
      if (this.showSearchList) {
        this.setShowSearchList(false)
      }
    },
    // 显示搜索列表
    openSearchList () {
      this.setShowSearchList(true)
    },
    // 获取默认关键词
    async getSearchDefault () {
      const {
        data: res
      } = await searchApi.getSearchDefault()
      if (res.code === ERR_OK) {
        this.searchDefault = {
          realkeyword: res.data.realkeyword,
          searchType: res.data.searchType,
          showKeyword: res.data.showKeyword
        }
      }
    },
    // 搜索搜索建议
    async getSearchSuggest () {
      const {
        data: res
      } = await searchApi.getSearchSuggest(this.searchKeywords)
      if (res.code === ERR_OK) {
        if (res.result.allMatch) {
          this.searchList = res.result.allMatch.map(item => item.keyword)
          Promise.resolve('搜索成功')
        } else {
          this.searchList = [this.searchKeywords]
        }
      }
    },
    search (searchIndex = 0) {
      this.closeSearchList()
      // 设置搜索标签页
      this.setSearchCurrentIndex(searchIndex)
      // 将搜索的内容保存在本地
      addLocalSearch(this.searchKeywords)
      if (this.$route.path === '/search/searchPage') {
        this.$router.replace('/search/searchResult')
      } else {
        // 添加搜索组件到不需要缓存组件中
        // 添加不缓存路由
        this.setAddNoCacheComponents('search')
        this.reload()
      }
    },
    // 处理搜索索引
    handleSearchIndex (type) {
      let index = 0 // 默认为索引为0
      switch (type) {
        case SEARCH_TYPE.all:
          index = 0
          break
        case SEARCH_TYPE.song:
          index = 1
          break
        case SEARCH_TYPE.singer:
          index = 2
          break
        case SEARCH_TYPE.album:
          index = 3
          break
        case SEARCH_TYPE.songSheet:
          index = 4
          break
        case SEARCH_TYPE.mv:
          index = 5
          break
      }
      return index
    },
    // 处理搜索请求
    async handleSearch () {
      // 没有输入按默认搜索关键词搜索
      if (this.searchKeywords.trim().length === 0) {
        this.setSearchKeywords(this.searchDefault.realkeyword)
        // 设置搜索标签页
        let index = this.handleSearchIndex(this.searchDefault.searchType)
        this.search(index)
      } else {
        this.search()
      }
    },
    // 输入搜索内容
    handleInput: utils.debounce(function () {
      if (this.searchKeywords.trim().length === 0) {
        this.closeSearchList()
      } else {
        this.getSearchSuggest().then(() => {
          // 打开搜索列表
          this.openSearchList()
        })
      }
    }, 300),
    // 选择搜索名称
    selectItem (item) {
      this.setSearchKeywords(item)
      this.search()
    },
    // 监听页面滚动
    handleScroll () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 0) { // 滚动大于0的时候关闭搜索框
        this.closeSearchList()
      }
    },
    // 监听页面滚动
    addScrollListner () {
      window.addEventListener('scroll', this.handleScroll)
    },
    // 取消监听页面滚动
    removeScrollListner () {
      window.removeEventListener('scroll', this.handleScroll)
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable'
.van-search
  height 1.8rem
  padding 0.25rem 0.32rem
  box-sizing border-box
.search-container
  width 100%
  min-height 100vh
  background $color-common-background
  display flex
  flex-direction column
  .container
    display flex
    flex 1
    flex-direction column
    .search-list-container
      position absolute
      top 2.5rem
      background $color-common-background
      width 100%
      padding 0 0.4rem
      box-sizing border-box
      max-height 8rem
      z-index 99
      box-shadow 0 0.3rem 0.25rem rgba(0, 0, 0, 0.04)
      .search-list
        .search-list-item
          display flex
          line-height 1rem
          height 1rem
          font-size $font-size-smaller-x
          color $color-common-x
          .icon
            margin-right 0.2rem
            font-size 0.45rem
      .close-search-list
        text-align center
        line-height 1rem
        height 1rem
        font-size 0.35rem
        color #23203f
</style>