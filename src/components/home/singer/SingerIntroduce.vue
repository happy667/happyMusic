<template>
  <article class="singer-introduce-container"
           ref="container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar :title="$route.meta.title"
                   ref="navBar"
                   left-arrow
                   :z-index="99"
                   @click-left="routerBack" />
    </van-sticky>
    <!-- loading -->
    <loading :loading="loading"></loading>
    <template v-if="!loading">
      <div class="container">
        <div class="singer-synopsis-title">
          <div class="title">
            <Title title="歌手简介"
                   borderLeft></Title>
          </div>

        </div>
        <div class="singer-synopsis">
          <article class="context">
            {{articleObj.briefDesc}}
          </article>
        </div>
        <div class="singer-introduction"
             v-for="item in articleObj.introduction"
             :key="item.ti">
          <div class="title">
            <Title :title="item.ti"
                   borderLeft></Title>
          </div>
          <article class="context"
                   v-html="item.txt"></article>
        </div>
      </div>
    </template>
  </article>
</template>

<script>
import Title from '@/components/common/Title'
import singerApi from '@/api/singer.js'
import {
  ERR_OK
} from '@/api/config.js'
import { playlistMixin } from '@/assets/common/js/mixin.js'
export default {
  name: 'singerIntroduce',
  props: {
    id: String
  },
  mixins: [playlistMixin],
  data () {
    return {
      articleObj: null,
      loading: true
    }
  },
  mounted () {
    this.getSingerDetail(this.id)
  },
  methods: {
    routerBack () {
      this.$utils.routerBack()
    },
    // 获取歌手详情
    async getSingerDetail (id) {
      const { data: res } = await singerApi.getSingerDetail(id)
      if (res.code === ERR_OK) { // 成功 获取歌手详情
        this.articleObj = {
          briefDesc: res.briefDesc,
          introduction: res.introduction,
          topicData: res.topicData
        }
        this.loading = false
      }
    },
    handlePlaylist (playList) {
      // 适配播放器与页面底部距离
      const bottom = playList.length > 0 ? '1.6rem' : ''
      this.$nextTick(() => {
        this.$refs.container.style.paddingBottom = bottom
      })
    }
  },
  components: {
    Title
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-introduce-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: $color-common-background;

  .container {
    padding: 0.4rem;

    .context {
      margin: 0.4rem 0;
      line-height: 0.5rem;
      white-space: pre-wrap;
    }
  }
}
</style>