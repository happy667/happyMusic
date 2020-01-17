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
    <router-view></router-view>
  </div>
</template>
<script>
import searchApi from '@/api/search.js'
import { ERR_OK } from '@/api/config.js'
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      searchDefault: '' // 搜索默认关键词
    }
  },
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
      this.$router.back()
    },
    // 获取默认关键词
    async  getSearchDefault () {
      const { data: res } = await searchApi.getSearchDefault()
      if (res.code === ERR_OK) {
        this.searchDefault = res.data.realkeyword
      }
    },
    // 搜索
    async handleSearch () {
      // 重置标签页到第一个
      this.setSearchCurrentIndex(0)
      if (this.searchKeywords.trim().length === 0) {
        this.setSearchKeywords(this.searchDefault)
      }// 没有输入按默认搜索关键词搜索
      if (this.$route.path !== '/search/searchResult') {
        this.$router.push('/search/searchResult')
      }
    },
    handleInput () {
      if (this.searchKeywords.trim().length === 0) {
        this.$router.push('/search/searchPage')
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.van-tabs {
  height: 100% !important;
}

.van-cell {
  padding: 0.2rem 0.3rem;
}

.van-search__content {
  background-color: #fff;
  border: 0.03rem solid #e3e3e3;
}

.van-search {
  height: 1.8rem;
}

.search-container {
  width: 100%;
  background: #fff;
  min-height: 100vh;
}
</style>