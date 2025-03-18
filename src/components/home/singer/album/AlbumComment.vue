<template>
  <div class="album-comment-container">
    <header class="header">
      <van-sticky>
        <van-nav-bar :title="$route.meta.title"
                     left-arrow
                     @click-left="routerBack" />
      </van-sticky>

    </header>
    <section class="container"
             ref="container">

      <template v-if="!commentList">
        <!-- loading -->
        <loading />
      </template>
      <template v-else>
        <van-sticky :offset-top="46">
          <div class="section">
            <!-- 专辑头部 -->
            <div class="album-header">
              <div class="album-info">
                <div class="container">
                  <div class="left-img">
                    <div class="album-image animated fadeIn"
                         :style="loadBgStyle">
                      <img v-lazy="album.picUrl"
                           :key="album.picUrl" />
                    </div>
                  </div>
                  <div class="right-info">
                    <div class="album-name">{{album.name}}</div>
                    <div class="album-singer">歌手:{{album.singers}}
                    </div>
                  </div>
                </div>
                <div class="bg"
                     v-lazy:background-image="this.album.blurPicUrl"
                     v-if="album.blurPicUrl">
                </div>
              </div>
            </div>
          </div>
        </van-sticky>
      </template>
      <!-- 评论列表 -->
      <template v-if="commentList">
        <div class="comment"
             ref="container">
          <div class="comment-title">精彩评论 {{commentText}}</div>
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

    </section>
  </div>
</template>
<script>
import NoResult from '@/components/common/NoResult'
import CommentList from '@/components/home/comment/CommentList'
import AlbumDetail from '@/assets/common/js/albumDetail.js'
import singerApi from '@/api/singer.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  playlistMixin
} from '@/assets/common/js/mixin.js'
export default {
  name: 'albumComment',
  props: {
    id: String
  },
  mixins: [playlistMixin],
  data () {
    return {
      loading: false, // 加载中
      finished: false, // 加载完所有数据
      commentList: null, // 评论列表
      commentCount: 0, // 评论数量
      album: {} // 专辑
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
    },
    loadBgStyle () {
      return !this.album.picUrl ? "background:#f2f3f5" : ''
    },
  },
  methods: {
    // 返回上一个路由
    routerBack () {
      this.$route.meta.isBack = true
      this.$utils.routerBack()
    },
    goToAlbum () {
      this.$route.meta.isBack = false
      this.$router.push(`/singerAlbum/${this.id}`)
    },
    // 获取专辑详情
    async getAlbumInfo (id) {
      const {
        data: res
      } = await singerApi.getAlbumInfo(id)
      if (res.code === ERR_OK) {
        // 处理专辑歌手名称
        let singers = res.album.artists.map(item => item.name).join('/')
        let album = new AlbumDetail({
          id: res.album.id,
          name: res.album.alias.length > 0 ? `${res.album.name} (${res.album.alias.join('/')})` : res.album.name,
          publishTime: res.album.publishTime,
          picUrl: res.album.picUrl,
          blurPicUrl: res.album.blurPicUrl,
          singers
        })
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
    },
    handlePlaylist (playList) {
      // 适配播放器与页面底部距离
      const bottom = playList.length > 0 ? '1.5rem' : ''
      this.$nextTick(() => {
        this.$refs.container.style.paddingBottom = bottom
      })
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

.album-comment-container>>>.song-list-item-containter {
  border-radius: 0.2rem;
  padding: 0.2rem;
  box-shadow: 0 0.1rem 0.8rem rgba(0, 0, 0, 0.1);
}

.album-comment-container>>>.comment {
  padding: 0.1rem 0.4rem;
}

.bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-color: #161824;
  width: 100%;
  height: 100%;
  transition: background-image 0.6s;
  background: no-repeat 50% / cover;
  transform-origin: center center;
  filter: blur(10px);
  transform: scale(1.2);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.35);
  }
}

.album-comment-container {
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  overflow-x: hidden;
  background: $color-common-background;

  &::-webkit-scrollbar {
    display: none;
  }

  .container {
    .section {
      .album-header {
        position: relative;
        height: 0;
        padding-bottom: 2.3rem;
        overflow: hidden;

        .album-info {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          padding: 0.3rem;
          z-index: 99;

          .container {
            position: relative;
            display: flex;

            .left-img {
              position: relative;
              margin-right: 0.5rem;

              .album-image {
                width: 1.7rem;
                height: 1.7rem;
                border-radius: 0.3rem;
                box-shadow: 0.06rem 0.06rem 0.14rem rgba(0, 0, 0, 0.3);

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
          }
        }
      }

      .song {
        margin-bottom: 0.5rem;
      }
    }

    .comment {
      .comment-title {
        font-size: $font-size-smaller-x;
        font-weight: bold;
        height: 1rem;
        line-height: 1rem;
      }
    }
  }
}
</style>