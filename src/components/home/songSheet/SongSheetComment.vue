<template>
  <div class="song-sheet-comment-container">
    <header class="header">
      <van-sticky>
        <van-nav-bar :title="$route.meta.title" left-arrow @click-left="routerBack" />
      </van-sticky>

    </header>
    <section class="container" ref="container">

      <template v-if="!commentList">
        <!-- loading -->
        <loading />
      </template>
<template v-else-if="songSheet">
        <van-sticky :offset-top="46">
          <div class="section">
            <!-- 歌单头部 -->
            <div class="song-sheet-header">
              <div class="song-sheet-info">
                <div class="container">
                  <div class="left-img">
                    <div class="song-sheet-image">
                      <img v-lazy="songSheet.picUrl" :key="songSheet.picUrl" class="animated fadeIn" />
                    </div>
                  </div>
                  <div class="right-info">
                    <div class="song-sheet-name">{{songSheet.name}}</div>
                    <div class="song-sheet-singer">创作者:{{songSheet.creator.nickname}}
                    </div>
                  </div>
                </div>
                <div class="bg" v-lazy:background-image="bgImage" v-if="songSheet.picUrl">
                </div>
              </div>
            </div>
          </div>
        </van-sticky>
      </template>
<!-- 评论列表 -->
<template v-if="commentList">
        <div class="comment" ref="container">
          <div class="comment-title">精彩评论 {{commentText}}</div>
          <van-list v-model="loading" :immediate-check='false' :finished="finished"
            :finished-text="commentCount===0?'':'没有更多了'" @load="handlePullingUp">
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
    import SongSheetDetail from '@/assets/common/js/songSheetDetail.js'
    import User from '@/assets/common/js/user.js'
    import NoResult from '@/components/common/NoResult'
    import CommentList from '@/components/home/comment/CommentList'
    import recommendApi from '@/api/recommend.js'
    import {
        ERR_OK
    } from '@/api/config.js'
    import {
        playlistMixin
    } from '@/assets/common/js/mixin.js'
    export default {
        name: 'songSheetComment',
        props: {
            id: String
        },
        mixins: [playlistMixin],
        data() {
            return {
                loading: false, // 加载中
                finished: false, // 加载完所有数据
                commentList: null, // 评论列表
                commentCount: 0, // 评论数量
                songSheet: {} // 歌单
            }
        },
        mounted() {
            // 获取歌单详情
            this.getSongSheetInfo(this.id)
            this.getSongSheetComment(this.id)
        },
        computed: {
            commentText() {
                return this.commentCount === 0 ? '' : this.commentCount
            },
            bgImage() {
                let bgImage = this.songSheet.backgroundCoverUrl ? this.songSheet.backgroundCoverUrl : this.songSheet.picUrl
                return bgImage
            }
        },
        methods: {
            // 返回上一个路由
            routerBack() {
                this.$route.meta.isBack = true
                this.$utils.routerBack()
            },
            // 获取歌单详情
            async getSongSheetInfo(id) {
                const {
                    data: res
                } = await recommendApi.getSongSheetById(id)
                if (res.code === ERR_OK) {
                    // 处理歌单创作者名称
                    let playlist = res.playlist
                    let creator = res.playlist.creator
                    let songSheet = new SongSheetDetail({
                        id: playlist.id,
                        picUrl: playlist.coverImgUrl,
                        backgroundCoverUrl: playlist.backgroundCoverUrl,
                        name: playlist.name,
                        creator: new User({
                            userId: creator.userId,
                            nickname: creator.nickname,
                            avatarUrl: creator.avatarUrl
                        })
                    })
                    this.songSheet = songSheet
                    this.commentCount = playlist.commentCount
                }
            },
            // 获取该歌单评论
            async getSongSheetComment(id) {
                let offset = this.commentList ? this.commentList.length : 0
                let list = this.commentList ? this.commentList : []
                const {
                    data: res
                } = await recommendApi.getSongSheetComment(id, offset)
                if (res.code === ERR_OK) {
                    this.commentCount = res.total
                    this.commentList = list.concat(res.comments)
                }
            },

            // 上拉加载
            handlePullingUp() {
                setTimeout(async() => {
                    await this.getSongSheetComment(this.id)
                    if (this.commentList.length >= this.commentCount) {
                        this.finished = true
                    }
                    this.loading = false
                }, 500)
            },
            handlePlaylist(playList) {
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
    .song-sheet-comment-container>>>.songs-list-item-containter {
        border-radius: 0.2rem;
        padding: 0.2rem;
        box-shadow: 0 0.1rem 0.8rem rgba(0, 0, 0, 0.1);
    }
    
    .song-sheet-comment-container>>>.comment {
        padding: 0.2rem 0.4rem 0.4rem 0.4rem;
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
            background-color: rgba(0, 0, 0, .35);
        }
    }
    
    .song-sheet-comment-container {
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
                .song-sheet-header {
                    position: relative;
                    height: 0;
                    padding-bottom: 2.3rem;
                    overflow: hidden;
                    .song-sheet-info {
                        position: absolute;
                        left: 0;
                        right: 0;
                        top: 0;
                        bottom: 0;
                        padding: 0.3rem 0.4rem;
                        z-index: 99;
                        background: $color-common-background;
                        .container {
                            position: relative;
                            display: flex;
                            .left-img {
                                position: relative;
                                margin-right: 0.4rem;
                                .song-sheet-image {
                                    width: 1.7rem;
                                    height: 1.7rem;
                                    border-radius: 0.3rem;
                                    background: $color-common-b;
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
                                .song-sheet-name {
                                    height: 0.8rem;
                                    line-height: 0.8rem;
                                    font-weight: bold;
                                    font-size: $font-size-smaller;
                                    no-wrap();
                                }
                                .song-sheet-singer {
                                    height: 0.8rem;
                                    line-height: 0.8rem;
                                    no-wrap();
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