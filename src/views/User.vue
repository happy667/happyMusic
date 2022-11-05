<template>
  <div class="user-container"
    :style="(user&&$utils.isLogin())?'':'background-image:linear-gradient(-20deg, #f794a4 0%, #fdd6bd 100%)'">
    <header>
      <div class="header-container" v-lazy:background-image="user?user.backgroundUrl:''">
        <div class="back" @click="routerBack">
          <van-icon name="arrow-left" />
        </div>
        <div class="triangle-container">
          <!-- 头像 -->
          <div class="avatar">
            <div class="image" v-if="user">
              <img v-lazy="user.avatarUrl" class="animated fadeIn">
            </div>
            <div :class="user?'icon':'nologin icon'" @click="$router.push({name:'index'})" v-else>
              <van-icon name="user-o" />
            </div>
          </div>
          <van-skeleton title :row="1" :loading="skeletonLoad" row-width="100%">
            <!-- 昵称 -->
            <div class="nikeName" v-if="user">
              <div class="text"> {{user.nickname}}</div>
            </div>
            <!-- 签名 -->
            <div class="personalSignature" v-if="user">
              <div class="text"> {{user.signature}}</div>
            </div>

            <div class="no-login" v-else>
              <router-link :to="{name:'index'}">登录/注册</router-link>
              <div class="text"> 立即登录，体验更多功能</div>
            </div>
          </van-skeleton>
        </div>

        <div class="edit" v-if="user">
          <div class="icon" @click="handleEdit">
            <van-icon name="setting-o" size="25" />
          </div>
        </div>
      </div>
      <div class="triangle"></div>
    </header>
    <section>
      <scroll ref="user_scroll">
        <div class="user-index" ref="container">
          <div class="my-list ">
            <router-link to="/user/myFollow">
              <div class="my-follow my-list-item ">
                <div class="left-image">
                  <van-icon name="star" />
                </div>
                <div class="right-info">
                  <div class="title">我的关注</div>
                  <div class="num">{{followCount}}</div>
                </div>
              </div>
            </router-link>
            <router-link to="/user/myLike">
              <div class="my-like my-list-item">
                <div class="left-image">
                  <van-icon name="like" />
                </div>
                <div class="right-info">
                  <div class="title">我的最爱</div>
                  <div class="num" v-show="userCount">{{myLikeCount}}</div>
                </div>

              </div>
            </router-link>
            <router-link to="/user/recentPlay">
              <div class="my-recentPlay my-list-item">
                <div class="left-image">
                  <van-icon name="play-circle" />
                </div>
                <div class="right-info">
                  <div class="title">最近播放</div>
                </div>
              </div>
            </router-link>
            <router-link to="/user/playRanking">
              <div class="play-music-ranking my-list-item">
                <div class="left-image">
                  <van-icon name="medal" />
                </div>
                <div class="right-info">
                  <div class="title">听歌排行</div>
                </div>
              </div>
            </router-link>

          </div>
          <template v-if="user">
            <div class="my-follow">
              <div class="my-songSheet">
                <div class="title">
                  <div class="text">我的歌单</div>
                  <span class="count">({{songSheetCount}}个)</span>
                </div>
                <song-sheet-mini-list v-if="userSongSheet" :list="userSongSheet"></song-sheet-mini-list>
                <template v-if="userSongSheet&&userSongSheet.length===0">
                  <no-result text="还没有歌单,快去收藏吧"></no-result>
                </template>
</div>
<div class="my-album">
    <div class="title" v-show="userSongSheet">
        <div class="text">我的专辑</div>
        <span class="count">({{albumCount}}个)</span>
    </div>

    <album-list :list="userAlbum" v-if="userAlbum" @select="selectItem" showSongSize showFunctions :showTime="false">
    </album-list>
    <template v-if="userAlbum&&userAlbum.length===0">
                  <no-result text="还没有专辑,快去收藏吧"></no-result>
                </template>
</div>

<div class="my-video">
    <div class="title" v-show="userAlbum">
        <div class="text">我的视频</div>
        <span class="count">({{videoCount}}个)</span>
    </div>

    <video-list @select="goToVideoInfo" :list="userVideo"></video-list>
    <template v-if="userVideo&&userVideo.length===0">
                  <no-result text="还没有视频,快去收藏吧"></no-result>
                </template>
</div>
</div>
</template>
<!-- loading -->
<loading :loading="load" />
</div>

</scroll>
</section>

</div>
</template>
<script>
    import videoList from '@/components/common/video/VideoList'
    import Video from '@/assets/common/js/video.js'
    import Album from '@/assets/common/js/album.js'
    import Scroll from '@/components/common/Scroll'
    import NoResult from '@/components/common/NoResult'
    import AlbumList from '@/components/common/album/AlbumList'
    import SongSheetMiniList from '@/components/home/songSheet/songSheetMini/SongSheetMiniList'
    import userApi from '@/api/user.js'
    import {
        playlistMixin
    } from '@/assets/common/js/mixin.js'
    import {
        ERR_OK
    } from '@/api/config.js'
    import {
        mapState,
        mapMutations
    } from 'vuex'
    export default {
        name: 'user',
        data() {
            return {
                load: this.$utils.isLogin() ? true : false,
                userCount: null,
                userSongSheet: null, // 用户歌单
                userAlbum: null, // 用户专辑
                userVideo: null, // 用户视频
                activeNames: ['1', '2', '3']
            }
        },
        mixins: [playlistMixin],
        computed: {
            ...mapState(['user', 'userLikeList', 'currentPlayIndex']),
            myLikeCount() {
                return this.userLikeList ? this.userLikeList.length + '首' : ''
            },
            followCount() {
                return this.userCount ? this.userCount.artistCount + '个收藏' : ''
            },
            songSheetCount() {
                return this.userSongSheet ? this.userSongSheet.length : 0
            },
            albumCount() {
                return this.userAlbum ? this.userAlbum.length : 0
            },
            videoCount() {
                return this.userVideo ? this.userVideo.length : 0
            },
            skeletonLoad() {
                if (this.$utils.isLogin()) {
                    return this.user ? false : true
                } else {
                    return false
                }

            }
        },
        watch: {
            user() {
                this.getAllData();
            }
        },
        mounted() {
            this.getAllData();
        },

        methods: {
            ...mapMutations(['setHideMiniPlayer']),
            // 返回上一个路由
            routerBack() {
                this.$router.push('/home')
            },
            // 选择专辑进入专辑详情
            selectItem(item) {
                this.$router.push(`/singerAlbum/${item.id}`)
            },
            betterScrollRefresh() {
                if (this.$refs.user_scroll) {
                    this.$refs.user_scroll.refresh()
                }
            },
            //获取页面所有数据
            async getAllData() {
                if (this.user) {
                    // 获取用户专辑歌单数量
                    this.getUserCount()
                        // 获取用户收藏的歌单
                    await this.getUserSongSheet(this.user.userId)
                        // 获取用户专辑
                    await this.getUserAlbum()
                        // 获取用户收藏的视频
                    await this.getUserVideo()
                }
            },
            // 获取用户信息 , 歌单，收藏，mv, dj 数量
            async getUserCount() {
                this.load = true;
                const {
                    data: res
                } = await userApi.getUserCount()
                if (res.code === ERR_OK) {
                    this.userCount = res
                    this.load = false;
                }
            },
            // 获取用户收藏的歌单
            async getUserSongSheet(id) {
                this.load = true;
                const {
                    data: res
                } = await userApi.getUserSongSheet(id)
                if (res.code === ERR_OK) {
                    this.userSongSheet = res.playlist
                    this.betterScrollRefresh()
                    this.load = false;
                }
            },
            // 获取用户收藏专辑
            async getUserAlbum() {
                this.load = true;
                const {
                    data: res
                } = await userApi.getUserAlbum()
                if (res.code === ERR_OK) {
                    let albumList = []
                    res.data.forEach(item => {
                        let album = new Album({
                            id: item.id,
                            name: item.alias.length > 0 ? `${item.name} (${item.alias.join('/')})` : item.name,
                            size: item.size,
                            picUrl: item.picUrl,
                            singerName: item.artists.map(item => item.name).join('/'),
                            publishTime: item.subTime
                        })
                        albumList.push(album)
                    })
                    this.userAlbum = albumList
                    this.betterScrollRefresh()
                    this.load = false;
                }
            },
            async getUserVideo() {
                this.load = true;
                const {
                    data: res
                } = await userApi.getUserVideo()
                if (res.code === ERR_OK) {
                    let videoList = []
                    res.data.forEach(item => {
                        let video = new Video({
                            id: item.vid,
                            coverUrl: item.coverUrl,
                            name: item.title,
                            playCount: item.playTime,
                            type: item.type,
                            duration: item.durationms,
                            creatorName: item.creator.map(item => item.userName).join('/')
                        })
                        videoList.push(video)
                    })
                    this.userVideo = videoList
                    this.betterScrollRefresh()
                    this.load = false;
                }
            },

            // 点击跳转到编辑页面
            handleEdit() {
                // 如果有歌曲播放就隐藏迷你播放器
                if (this.currentPlayIndex !== -1) {
                    this.setHideMiniPlayer(true)
                }
                this.$router.push('/user/edit')
            },
            handlePlaylist(playList) {
                // 适配播放器与页面底部距离
                const bottom = playList.length > 0 ? '1.5rem' : ''
                this.$nextTick(() => {
                    this.$refs.container.style.paddingBottom = bottom
                    this.betterScrollRefresh()
                })
            },
            goToVideoInfo(video) {
                this.$router.push(`/videoInfo/${video.id}`)
            }

        },
        components: {
            SongSheetMiniList,
            AlbumList,
            NoResult,
            Scroll,
            videoList
        }
    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    .user-container>>>.scroll {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #fff
    }
    
    .user-container>>>.album-container {
        padding: 0;
        color: $color-common-x;
    }
    
    .user-container>>>.loading-container .van-loading {
        background-color: #fff;
    }
    
    .user-container>>>.van-skeleton {
        padding: 0;
    }
    
    .user-container>>>.van-skeleton__title {
        height: 0.7rem;
        line-height: 0.7rem;
    }
    
    .user-container>>>.van-skeleton__row {
        margin-top: 0.2rem;
        width: 100% !important;
        height: 0.6rem;
        line-height: 0.6rem;
    }
    
    .user-container {
        position: fixed;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        header {
            position: relative;
            width: 100%;
            padding-bottom: 7rem;
            height: 0;
            box-sizing: border-box;
            .triangle {
                position: absolute;
                left: 0;
                bottom: -1px;
                width: 100%;
                height: 3.3rem;
                background: conic-gradient(from 100deg at 0% 0, #fff 0, #fff 135deg, transparent 45deg);
            }
            .header-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 7rem;
                padding-top: 1.5rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                background-position: center center;
                background-size: 100% 100%;
                transition: background-image 0.6s;
                box-sizing: border-box;
                .triangle-container {
                    display: flex;
                    position: absolute;
                    padding: 0 0.45rem;
                    width: 100%;
                    left: 0;
                    bottom: 5%;
                    flex-direction: column;
                    z-index: 99;
                    box-sizing: border-box;
                    .avatar {
                        margin-bottom: 0.2rem;
                        width: 2.2rem;
                        height: 2.2rem;
                        background: #f4f4f4;
                        border-radius: 50%;
                        .image,
                        .icon {
                            width: 100%;
                            height: 100%;
                            background: $color-common-b;
                            border-radius: 50%;
                            img {
                                display: block;
                                width: 100%;
                                height: 100%;
                                border-radius: 50%;
                            }
                        }
                        .icon {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 1rem;
                            color: $color-common;
                            border-radius: 50%;
                            border: 0.02rem solid #fff;
                            background: #fff;
                            &.nologin {
                                box-shadow: 0.05rem 0.08rem 0.08rem rgba(0 0 0, 7%);
                            }
                        }
                    }
                    .nikeName {
                        padding-left: 0.1rem;
                        max-width: 8rem;
                        height: 0.75rem;
                        line-height: 0.75rem;
                        no-wrap();
                        .text {
                            color: $color-common-x;
                            font-weight: bold;
                            font-size: $font-size-large-x;
                        }
                    }
                    .personalSignature {
                        padding-left: 0.1rem;
                        max-width: 8rem;
                        height: 0.75rem;
                        line-height: 0.75rem;
                        no-wrap();
                        .text {
                            color: $color-common-b2;
                            font-size: $font-size-smaller;
                        }
                    }
                }
                .edit {
                    position: absolute;
                    right: 0.5rem;
                    top: 0.5rem;
                    color: #fff;
                }
                .back {
                    position: absolute;
                    left: 0.2rem;
                    top: 0.25rem;
                    width: 1rem;
                    height: 1rem;
                    font-size: $font-size-large;
                    color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .no-login {
                    a {
                        padding-left: 0.1rem;
                        display: block;
                        height: 0.75rem;
                        line-height: 0.75rem;
                        font-size: $font-size-small-x;
                        color: #000;
                    }
                    .text {
                        padding-left: 0.1rem;
                        height: 0.75rem;
                        line-height: 0.75rem;
                        color: $color-common-b2;
                        font-size: $font-size-smaller;
                    }
                }
            }
        }
        section {
            position: relative;
            flex: 1;
            .user-index {
                .my-list {
                    .my-list-item {
                        display: flex;
                        width: 100%;
                        height: 1.7rem;
                        border-radius: 0.1rem;
                        color: $color-common-x;
                        background-color: #fff;
                        .left-image {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            width: 1.6rem;
                            height: 1.7rem;
                            font-size: $font-size-large;
                            color: $color-common;
                        }
                        .right-info {
                            display: flex;
                            justify-content: center;
                            flex-direction: column;
                            font-size: $font-size-mini;
                            .title {
                                height: 0.7rem;
                                line-height: 0.7rem;
                            }
                            .num {
                                color: $color-common-b2;
                                line-height: 0.6rem;
                            }
                        }
                    }
                }
                >.my-follow {
                    .my-songSheet,
                    .my-album,
                    .my-video {
                        padding: 0 0.4rem 0.4rem;
                        background-color: #fff;
                    }
                    .my-album,
                    .my-video {
                        margin-top: 0.2rem;
                    }
                    .title {
                        margin-bottom: 0.2rem;
                        height: 1rem;
                        line-height: 1rem;
                        display: flex;
                        .text {
                            font-size: $font-size-smaller;
                            font-weight: bold;
                            margin-right: 0.1rem;
                        }
                        .count {
                            color: $color-common-b2;
                        }
                    }
                }
            }
        }
    }
</style>