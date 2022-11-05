<template>
  <article class="singer-more-desc-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar :title="$route.meta.title" left-arrow :z-index="99" @click-left="routerBack" />
    </van-sticky>
    <!-- loading -->
    <loading :loading="loading"></loading>
    <section class="section-container">
      <scroll ref="singer_more_desc_scroll">
        <div class="container" ref="container">
          <template v-if="!loading">
            <div class="singer-synopsis-title">
              <div class="title">
                <Title title="歌手简介" borderLeft></Title>
              </div>

            </div>
            <div class="singer-synopsis">
              <article class="context">
                {{articleObj.briefDesc}}
              </article>
            </div>
            <div class="singer-introduction" v-for="item in articleObj.introduction" :key="item.ti">
              <div class="title">
                <Title :title="item.ti" borderLeft></Title>
              </div>
              <article class="context" v-html="item.txt"></article>
            </div>
          </template>
        </div>
      </scroll>
    </section>
  </article>
</template>

<script>
  import Scroll from '@/components/common/Scroll'
  import {
    playlistMixin
  } from '@/assets/common/js/mixin.js'
  import Title from '@/components/common/Title'
  import singerApi from '@/api/singer.js'
  import {
    ERR_OK
  } from '@/api/config.js'
  export default {
    name: 'singerMoreDesc',
    props: {
      id: String
    },
    mixins: [playlistMixin],
    data() {
      return {
        articleObj: null,
        loading: true
      }
    },
    mounted() {
      this.getSingerDesc(this.id)
    },
    methods: {
      routerBack() {
        this.$route.meta.isBack = true
        this.$utils.routerBack()
      },
      // 获取歌手描述
      async getSingerDesc(id) {
        const {
          data: res
        } = await singerApi.getSingerDesc(id)
        if (res.code === ERR_OK) { // 成功 获取歌手详情
          this.articleObj = {
            briefDesc: res.briefDesc,
            introduction: res.introduction,
            topicData: res.topicData
          }
          this.loading = false
          this.handlePlaylist(this.playList)
        }
      },
      handlePlaylist(playList) {
        if (!this.loading) {
          // 适配播放器与页面底部距离
          const bottom = playList.length > 0 ? '1.5rem' : ''
          this.$nextTick(() => {
            this.$refs.container.style.paddingBottom = bottom
            this.refresh()
          })
        }
      },
      refresh() {
        this.$nextTick(() => {
          this.$refs.singer_more_desc_scroll.refresh()
        })
      }
    },
    components: {
      Title,
      Scroll
    }
  }
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable';

  .singer-more-desc-container>>>.scroll {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .singer-more-desc-container {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: $color-common-background;

    section {
      position: relative;
      flex: 1;

      .container {
        padding: 0.4rem;

        .context {
          margin: 0.4rem 0;
          line-height: 0.5rem;
          white-space: pre-wrap;
        }
      }
    }
  }
</style>