<template>
  <div class="album-comment-container">
    <header class="header">
      <van-sticky>
        <van-nav-bar :title="$route.meta.title"
                     left-arrow
                     @click-left="routerBack" />
      </van-sticky>

    </header>
    <template v-if="!commentList">
      <van-loading size="24px"
                   color="#FD4979"
                   vertical>加载中...</van-loading>
    </template>
    <template v-else>
      <section class="section">
        <!-- 专辑头部 -->
        <div class="album-header"
             @click="goToAlbum">
          <section class="album-info">
            <div class="top">
              <div class="left-img">
                <div class="album-image">
                  <img v-lazy="album.picUrl"
                       :key="album.picUrl" />
                </div>
              </div>
              <div class="right-info">
                <div class="album-name">{{album.name}}</div>
                <div class="album-singer">歌手:{{album.singers}}
                </div>
              </div>
              <div class="icon">
                <van-icon name="arrow" />
              </div>
            </div>
          </section>
        </div>

        <!-- 评论列表 -->
        <template v-if="commentList">
          <div class="comment">
            <div class="comment-title">精彩评论{{commentText}}</div>
            <van-list v-model="loading"
                      :immediate-check='false'
                      :finished="finished"
                      :finished-text="commentCount===0?'':'没有更多了'"
                      @load="handlePullingUp">
              <template v-if="commentList.length!==0">
                <comment-list :commentList="commentList"></comment-list>
              </template>
              <template v-else>
                <no-result text="暂无评论"></no-result>
              </template>
            </van-list>
          </div>
        </template>
        <template v-else>
          <van-loading size="24px"
                       color="#FD4979"
                       vertical>加载中...</van-loading>
        </template>
      </section>
    </template>

  </div>
</template>
<script>
import NoResult from '@/components/common/NoResult'
import CommentList from '@/components/home/comment/CommentList'
import singerApi from '@/api/singer.js'
import { mapMutations } from 'vuex'
import {
  ERR_OK
} from '@/api/config.js'
export default {
  name: 'albumComment',
  props: {
    id: String
  },
  data () {
    return {
      loading: false, // 加载中
      finished: false, // 加载完所有数据
      commentList: null, // 评论列表
      commentCount: 0, // 评论数量
      album: {}// 专辑
    }
  },
  mounted () {
    // 获取专辑详情
    this.getAlbumInfo(this.id)
    this.getSongComment(this.id)
  },
  computed: {
    commentText () {
      return this.commentCount === 0 ? '' : this.commentCount
    }
  },
  methods: {
    ...mapMutations(['setIsAdvance']),
    // 返回上一个路由
    routerBack () {
      this.$route.meta.isBack = true
      this.$utils.routerBack()
    },
    goToAlbum () {
      this.$route.meta.isBack = false
      // 设置为前进页面
      this.setIsAdvance(true)
      this.$router.push(`/singerAlbum/${this.id}`)
    },
    // 获取专辑详情
    async getAlbumInfo (id) {
      const { data: res } = await singerApi.getAlbumInfo(id)
      if (res.code === ERR_OK) {
        // 处理专辑歌手名称
        let singers = res.album.artists.map(item => item.name).join('/')
        let album = res.album
        album.singers = singers
        console.log(album)
        this.album = album
        this.commentCount = res.album.info.commentCount
      }
    },
    // 获取该mv评论
    async getSongComment (id) {
      let offset = this.commentList ? this.commentList.length : 0
      let list = this.commentList ? this.commentList : []
      const {
        data: res
      } = await singerApi.getAlbumComment(id, offset)
      if (res.code === ERR_OK) {
        this.commentCount = res.total
        this.commentList = list.concat(res.comments)
        console.log(this.commentList)
      }
    },

    // 上拉加载
    handlePullingUp () {
      setTimeout(async () => {
        await this.getSongComment(this.id)
        if (this.commentList.length >= this.commentCount) {
          this.finished = true
        }
        this.loading = false
      }, 500)
    }
  },
  components: {
    CommentList,
    NoResult
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.album-comment-container>>> .songs-list-item-containter {
  border-radius: 0.2rem;
  padding: 0.2rem;
  box-shadow: 0 0.1rem 0.8rem rgba(0, 0, 0, 0.1);
}

.album-comment-container>>>.comment {
  padding: 0.3rem 0.5rem;
}

.album-comment-container {
  width: 100%;
  min-height: 100vh;
  background: $color-common-background;

  .section {
    .album-header {
      position: relative;
      height: 0;
      background-image: linear-gradient(-20deg, #f794a4 0%, #fdd6bd 100%);
      padding-bottom: 2.3rem;

      .album-info {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        padding: 0.3rem;

        .top {
          display: flex;

          .left-img {
            position: relative;
            margin-right: 0.5rem;

            .album-image {
              width: 1.7rem;
              height: 1.7rem;
              border-radius: 0.3rem;

              img {
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 0.3rem;
              }
            }
          }

          .right-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 100%;
            color: #fff;
            font-size: $font-size-smaller-x;
            no-wrap();

            .album-name {
              height: 0.8rem;
              line-height: 0.8rem;
              font-weight: bold;
              font-size: $font-size-smaller;
            }

            .album-singer {
              height: 0.8rem;
              line-height: 0.8rem;

              a {
                color: #fff;
              }
            }
          }

          .icon {
            display: flex;
            align-items: center;
            font-size: 1rem;
            color: $color-common-b;
          }
        }
      }
    }

    .song {
      margin-bottom: 0.5rem;
    }

    .comment {
      .comment-title {
        font-size: $font-size-smaller;
        font-weight: bold;
        height: 1rem;
        line-height: 1rem;
      }
    }
  }
}
</style>