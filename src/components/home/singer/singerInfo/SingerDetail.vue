<template>
  <div class="singer-detail-container">
    <!-- loading -->
    <van-loading v-if="isLoad"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <!-- 歌手简介 -->
    <template v-if="!isLoad">
      <div class="singer-synopsis-title">
        <h2 class="title">歌手简介</h2>
      </div>
      <template v-if="!singerDetail.briefDesc&&singerDetail.introduction.length===0">
        <no-result text="暂无歌手简介"></no-result>
      </template>
      <template v-else>
        <div class="singer-synopsis">
          <p class="context">
            {{singerDetail.briefDesc}}
          </p>
        </div>
        <div class="singer-introduction"
             v-for="item in singerDetail.introduction"
             :key="item.ti">
          <h2 class="title">{{item.ti}}</h2>
          <p class="context"
             v-html="item.txt"></p>
        </div>
      </template>
    </template>
  </div>

</template>
<script>
import NoResult from '@/components/common/NoResult'
export default {
  props: {
    singerDetail: {
      type: Object,
      default: () => { }
    }
  },
  computed: {
    isLoad () {
      return Object.keys(this.singerDetail).length === 0
    }
  },
  components: {
    NoResult
  }
}
</script>
<style lang="stylus" scoped>
.singer-detail-container {
  @import '~common/stylus/variable';

  padding: 0 0.4rem 0.4rem 0.4rem;
  min-height: calc(100vh - (1.22667rem + 7.4rem + 1.18rem + 0.4rem));
  box-sizing: border-box;

  .title {
    margin-bottom: 0.2rem;
    font-size: $font-size-smaller;
    font-weight: bold;
    padding-left: 0.1rem;
    border-left: 0.08rem solid $color-common;
  }

  .context {
    line-height: 0.5rem;
    white-space: pre-wrap;
  }

  .singer-introduction {
    margin-top: 0.4rem;
  }
}
</style>