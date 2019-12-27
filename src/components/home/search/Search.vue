<template>
  <div class="search-container">
    <!-- 头部导航 -->
    <van-sticky>
      <van-nav-bar title="搜索"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>
    <!-- 内容区 -->
    <section>
      <!--搜索框-->
      <van-search left-icon=""
                  right-icon="search"
                  placeholder="请输入搜索关键词"
                  shape="round">

      </van-search>
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
        <ul class="search-list">
          <li class="search-list-item">Popular Music</li>
          <li class="search-list-item">Popular Music</li>
          <li class="search-list-item">水电费的说法是否的发1231231</li>
        </ul>
      </div>
      <!-- 热门搜索 -->
      <div class="recommend-Search">
        <!-- 搜索头部 -->
        <div class="search-list-header">
          <p class="title">热门搜索</p>
        </div>
        <!-- 搜索列表 -->
        <ul class="search-list">
          <li class="search-list-item">Popular Music</li>
          <li class="search-list-item">Popular Music</li>
          <li class="search-list-item">水电费的说法是否的发</li>
        </ul>
      </div>
    </section>

  </div>
</template>
<script>
export default {
  components: {

  },
  methods: {
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.search-container {
  width: 100%;
  height: 100%;
  background: #fff;

  section {
    padding: 0.5rem;

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

    .search-list {
      display: flex;
      flex-wrap: wrap;
      max-height: 10rem;
      font-size: $font-size-smaller-x;

      .search-list-item {
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

      .search-list-item {
        color: #fff;
        background: #f66d92;
        box-shadow: 0 0.2rem 0.3rem rgba(246, 105, 146, 0.3);
      }
    }

    .van-cell {
      padding: 0.2rem 0.3rem;
    }

    .van-search__content {
      background-color: #fff;
      border: 0.03rem solid #e3e3e3;
    }
  }
}
</style>