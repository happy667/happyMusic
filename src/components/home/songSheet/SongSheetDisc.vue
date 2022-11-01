<template>

  <div class="song-sheet-desc-container"
       @touchstart="handleTouchStart"
       @touchmove="handleTouchMove"
       @touchend="handleTouchEnd">

    <div class="container"
         ref="container">
      <!-- 头部导航栏 -->
      <div class="nav-bar-container"
           ref="navBar"
           v-show="!loading">
        <van-nav-bar :title="title"
                     class="nav-bar"
                     left-arrow
                     @click-left="routerBack">
          <template #right>
            <div class="share"
                 @click="handleClickShare"
                 ref="share">
              <div class="icon">
                <i class="iconfont icon-fenxiang"></i>
              </div>
            </div>
          </template>
</van-nav-bar>
<div class="bg-layer" ref="bgLayer"></div>
</div>
<header class="header-container animated fadeIn" ref="headerContainer">
    <!-- 背景 -->
    <div class="bg">
        <div class="filter"></div>
        <div class="image">
            <img v-lazy="image" class="animated fadeIn" :key="image" />
        </div>
    </div>
    <!-- 歌单头部 -->
    <section class="song-sheet-header" v-if="!loading">
        <div class="song-sheet-info">
            <div class="container header">
                <div class="left-img" @click="openOverlay">
                    <div class="song-sheet-image">
                        <div class="image">
                            <img v-lazy="songSheetDisc.picUrl" class="animated fadeIn" :key="songSheetDisc.picUrl" />
                        </div>
                        <div class="playCount">
                            <i class="iconfont icon-bofang"></i> {{songSheetDisc.playCount|convertCount}}
                        </div>
                    </div>

                </div>
                <article class="right-info">
                    <div class="creator">
                        <img class="avatar animated fadeIn" v-lazy="songSheetDisc.creator.avatarUrl" />
                        <span class="name">{{songSheetDisc.creator.nickname}}</span>
                    </div>
                    <div class="func">
                        <div class="func-item" v-if="songSheetDisc.creator.userId!==userId" @click="handleClickFollow">
                            <div class="icon" :class="followCls">
                                <van-icon :name="followIcon" />
                            </div>
                            {{followText}}
                        </div>
                        <div class="func-item" @click="goToSongSheetComment">
                            <div class="icon">
                                <van-icon name="more-o" />
                            </div>
                            <div class="num">{{songSheetDisc.commentCount|convertCount}}</div>
                        </div>
                    </div>
                </article>
            </div>
            <div class="bottom tags" v-if="songSheetDisc.tags&&songSheetDisc.tags.length!==0">
                <tag-list bgColor="#000" :tags="songSheetDisc.tags" />
            </div>
        </div>
    </section>
</header>

<!-- loading -->
<loading :loading="loading"></loading>
<div v-if="!loading" class="section-container" ref="sectionBox">
    <!-- 歌单描述 -->
    <article class="songs-desc" @click="openOverlay">
        <p class="desc">{{songSheetDisc.description}}</p>
        <div class="songs-nt">
            <span class="songs-num">{{songSheetDisc.songs.length}}首</span>
            <span class="songs-time" v-if="songSheetDisc.songs.length!==0">{{songSheetDisc.updateTime|convertDate}}</span>
        </div>
        <!-- 播放按钮 -->
        <div class="playBtn" @click.stop="playAllSong(songSheetDisc.songs)">
            <i class="iconfont icon-bofang"></i>
        </div>
    </article>

    <!-- 歌曲列表 -->
    <songs-list :songsList="songSheetDisc.songs" ref="songList" :showImage="!rank" :showIndex="rank" :top="rank" @select="selectSong" />

    <no-result v-if="songSheetDisc.songs.length===0" text="暂无相关资源"></no-result>
</div>

</div>
<!-- 定位 -->
<position v-show="isShowPosition" @click="handlePosition"></position>
<!-- 遮罩层 -->
<van-overlay :show="showOverlay" v-if="songSheetDisc" class="overlay-container">
    <div class="container" @click="closeOverlay" @touchmove.stop>
        <div class="top">
            <div class="image-container">
                <div class="image">
                    <img v-lazy="songSheetDisc.picUrl" class="animated fadeIn">
                </div>
            </div>

            <p class="title">{{songSheetDisc.name}}</p>
        </div>
        <div class="bottom">
            <article class="description">
                <div class="tags" v-if="songSheetDisc.tags&&songSheetDisc.tags.length!==0">
                    <span class="title">标签:</span>
                    <tag-list bgColor="#000" :tags="songSheetDisc.tags" />
                </div>
                <div class="content" v-html="songSheetDisc.description"></div>
            </article>
        </div>

    </div>
    <!-- 背景 -->
    <div class="bg" v-if="image">
        <div class="filter"></div>
        <div class="image" :style="bgImage"></div>
    </div>
    <div class="close" @click="closeOverlay">
        <div class="icon">
            <i class="iconfont icon-cha"></i>
        </div>
    </div>
</van-overlay>
</div>
</template>
<script>
    import Clipboard from 'clipboard'
    import recommendApi from '@/api/recommend.js'
    import userApi from '@/api/user.js'
    import {
        ERR_OK
    } from '@/api/config.js'
    import Song from '@/assets/common/js/song.js'
    import Singer from '@/assets/common/js/singer.js'
    import SongsList from '@/components/home/song/SongList'
    import SongSheetDetail from '@/assets/common/js/songSheetDetail.js'
    import User from '@/assets/common/js/user.js'
    import Album from '@/assets/common/js/album.js'
    import NoResult from '@/components/common/NoResult'
    import Position from '@/components/common/Position'
    import TagList from '@/components/common/Tag'
    import {
        playlistMixin
    } from '@/assets/common/js/mixin.js'
    import {
        mapMutations,
        mapGetters,
        mapActions,
        mapState
    } from 'vuex'

    export default {
        name: 'songSheetDisc',
        props: {
            id: String
        },
        mixins: [playlistMixin],
        data() {
            return {
                songSheetDisc: {},
                showPosition: false,
                loading: true,
                showOverlay: false // 是否显示遮罩层
            }
        },
        mounted() {
            this.getSongSheetById(this.id)
                // 初始化分享
            this.initShare()
                // 监听页面滚动
            this.addScrollListner()
        },

        activated() {
            // 监听页面滚动
            this.addScrollListner()
        },
        deactivated() {
            // 取消监听页面滚动
            this.removeScrollListner()
        },
        destroyed() {
            // 取消监听页面滚动
            this.removeScrollListner()
        },
        computed: {
            ...mapState(['user', 'hideMiniPlayer', 'currentPlayIndex']),
            ...mapGetters(['currentSong']),
            // 是否显示定位
            isShowPosition() {
                if (!this.songSheetDisc.songs) return
                    // 判断当前歌曲列表是否有正在播放的歌曲（-1表示没有)
                let index = this.$utils.findIndex(this.songSheetDisc.songs, this.currentSong)
                return this.showPosition && index !== -1
            },
            rank() {
                return Boolean(this.$route.query.rank)
            },
            followIcon() {
                return this.followed ? 'like' : 'like-o'
            },
            followCls() {
                return this.followed ? 'followed' : ''
            },
            followText() {
                return this.followed ? '已收藏' : '收藏'
            },
            followed() {
                return this.songSheetDisc ? this.songSheetDisc.followed : false
            },
            image() {
                let bgImage = this.songSheetDisc.backgroundCoverUrl ? this.songSheetDisc.backgroundCoverUrl : this.songSheetDisc.picUrl
                return bgImage
            },
            bgImage() {
                return {
                    backgroundImage: `url(${this.image})`
                }
            },
            title() {
                return this.songSheetDisc ? this.songSheetDisc.name : ''
            },
            userId() {
                return this.user ? this.user.userId : null
            }
        },
        methods: {
            ...mapMutations(['setRank', 'setHideMiniPlayer']),
            ...mapActions(['setSelectPlay']),
            // 返回上一个路由
            routerBack() {
                this.$route.meta.isBack = true
                this.$utils.routerBack()
            },
            // 根据id获取歌单列表
            async getSongSheetById(id) {
                this.loading = true
                try {
                    const {
                        data: res
                    } = await recommendApi.getSongSheetById(id)
                    if (res.code === ERR_OK) {
                        let playlist = res.playlist
                        let songList = []
                        playlist.tracks.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
                            let singerName = item.ar.map(item => item.name).join('/')
                            let singersList = []
                                // 处理歌手
                            item.ar.forEach(item => {
                                singersList.push(new Singer({
                                    id: item.id,
                                    name: item.name,
                                    aliaName: item.alias.join(' / '),
                                    avatar: item.img1v1Url,
                                    picUrl: item.picUrl
                                }))
                            })
                            songList.push(new Song({
                                id: item.id,
                                name: item.name,
                                singers: singerName,
                                singersList,
                                picUrl: item.al.picUrl,
                                album: new Album({
                                    id: item.al.id,
                                    name: item.al.name,
                                    picUrl: item.al.picUrl
                                }),
                                mv: item.mv
                            }))
                        })
                        res.privileges.map(item => {
                            let song = songList.find(item2 => item2.id === item.id)
                            song.st = item.st
                        })
                        let creator = playlist.creator
                        this.songSheetDisc = new SongSheetDetail({
                            id: playlist.id,
                            picUrl: playlist.coverImgUrl,
                            backgroundCoverUrl: playlist.backgroundCoverUrl,
                            songs: songList,
                            name: playlist.name,
                            description: playlist.description,
                            updateTime: playlist.updateTime,
                            followed: playlist.subscribed,
                            tags: playlist.tags,
                            creator: new User({
                                userId: creator.userId,
                                nickname: creator.nickname,
                                avatarUrl: creator.avatarUrl
                            }),
                            commentCount: playlist.commentCount,
                            playCount: playlist.playCount
                        })
                        this.loading = false
                    } else {
                        this.$router.replace('/')
                    }
                } catch (e) {
                    console.log(e)
                    this.$toast(e.data.message)
                    this.$router.replace('/')
                }
            },
            selectSong(item, index) {
                // 比较两首歌曲
                let result = this.$utils.compareSong(this.currentSong, item)
                if (!result) {
                    // 引入vue原型上的utils
                    this.$utils.playMusic(item, this.songSheetDisc.songs, index)
                }
            },
            // 播放所有歌曲
            playAllSong(list) {
                // 引入vue原型上的utils
                this.$utils.playAllSong(list)
            },
            // 收藏歌单
            handleClickFollow() {
                if (this.user) { // 说明已经登录
                    this.follow()
                } else {
                    this.$utils.alertLogin(this.$router.currentRoute.fullPath)
                }
            },

            follow() {
                let follow = !this.followed
                follow = follow ? 1 : 0 // 1代表收藏，0代表不收藏
                if (follow) { // 收藏
                    userApi.updateFollowSongSheet(this.id, follow).then(res => {
                        if (res.data.code === ERR_OK) {
                            this.songSheetDisc.followed = true
                            this.$toast('收藏成功')
                        }
                    }).catch(err => {
                        this.$toast(err.data.message)
                    })
                } else {
                    this.$utils.alertConfirm({
                        message: '确定不再收藏该歌单',
                        confirmButtonText: '不再收藏'
                    }).then(async() => {
                        userApi.updateFollowSongSheet(this.id, follow).then(res => {
                            if (res.data.code === ERR_OK) {
                                this.songSheetDisc.followed = false
                                this.$toast('已不再收藏')
                            }
                        }).catch(err => {
                            this.$toast(err.data.message)
                        })
                    }).catch(() => {})
                }
            },
            handlePosition() {
                // 说明有歌曲在播放
                if (this.currentSong) {
                    // 获取当前歌曲索引
                    let listNode = this.$refs.songList.$refs.list
                    let song = this.currentSong
                    let otherHeight = this.$refs.navBar.offsetHeight
                    this.$utils.positionSong({
                        listNode,
                        list: this.songSheetDisc.songs,
                        song,
                        otherHeight
                    })
                    this.$toast('已定位到当前歌曲')
                }
            },
            // 分享
            handleClickShare() {
                this.clipboard.on('success', e => {
                    this.$toast('已复制到剪贴板')
                })
                this.clipboard.on('error', e => {
                    this.$toast('浏览器不支持自动复制')
                })
            },
            // 初始化分享
            initShare() {
                // 分享
                this.clipboard = new Clipboard(this.$refs.share, {
                    text: () => {
                        if (this.user) {
                            return `分享${this.songSheetDisc.creator.nickname}的歌单《${this.songSheetDisc.name}》: \rhttps://music.163.com/#/playlist/${this.songSheetDisc.id}/?userid=${this.user.userId}(来自@网易云音乐)`
                        } else {
                            return `分享${this.songSheetDisc.creator.nickname}的歌单《${this.songSheetDisc.name}》:\rhttps://music.163.com/#/playlist/${this.songSheetDisc.id}(来自@网易云音乐)`
                        }
                    }
                })
            },
            // 跳转到歌单评论列表
            goToSongSheetComment() {
                this.$route.meta.isBack = false
                this.$router.push(`/songSheetComment/${this.id}`)
            },
            // 打开遮罩层
            openOverlay() {
                this.showOverlay = true
                this.setHideMiniPlayer(true)
                    // 不让页面滚动
                document.body.style.overflow = 'hidden'
            },
            // 关闭遮罩层
            closeOverlay() {
                this.showOverlay = false
                this.setHideMiniPlayer(false)
                document.body.style.overflow = ''
            },
            // 监听页面滚动
            handleScroll() {
                let bgLayer = this.$refs.bgLayer
                let navBar = this.$refs.navBar
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
                let height = this.$refs.headerContainer.offsetHeight - navBar.offsetHeight
                if (scrollTop >= 0 && scrollTop <= height) { // 滚动大于0的时候
                    let opacity = scrollTop / height
                    if (opacity <= 0.8) {
                        bgLayer.style.opacity = opacity
                    }
                } else {
                    bgLayer.style.opacity = 0.8
                }
            },
            // 监听页面滚动
            addScrollListner() {
                window.addEventListener('scroll', this.handleScroll)
            },
            // 取消监听页面滚动
            removeScrollListner() {
                window.removeEventListener('scroll', this.handleScroll)
            },
            handleTouchStart() {
                clearTimeout(this.timer)
            },
            handleTouchMove() {
                this.showPosition = true
            },
            handleTouchEnd() {
                this.timer = setTimeout(() => {
                    this.showPosition = false
                }, 5000)
            },
            handlePlaylist(playList) {
                // 适配播放器与页面底部距离
                const bottom = playList.length > 0 ? '1.6rem' : ''
                this.$nextTick(() => {
                    this.$refs.container.style.paddingBottom = bottom
                })
            }

        },
        components: {
            SongsList,
            NoResult,
            Position,
            TagList
        }
    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    .song-sheet-desc-container>>>.image .van-image {
        width: 100%;
    }
    
    .nav-bar>>>.van-nav-bar__title,
    .nav-bar>>>.van-icon {
        color: #fff !important;
    }
    
    .nav-bar {
        background-color: transparent;
        &:after {
            border: none;
        }
    }
    
    .song-sheet-desc-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: $color-common-background;
        display: flex;
        flex-direction: column;
        .container {
            .nav-bar-container {
                position: fixed;
                width: 100%;
                left: 0;
                top: 0;
                z-index: 90;
                .bg-layer {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                    opacity: 0;
                    z-index: 0;
                    background: #000;
                }
                .share {
                    color: #fff;
                }
            }
            .header-container {
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 55%;
                overflow: hidden;
                .bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                    .filter {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background-image: linear-gradient(transparent, rgb(189, 189, 189));
                        opacity: 0.4;
                        z-index: 1;
                    }
                    .image {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        z-index: 0;
                        overflow: hidden;
                        background-size: cover;
                        background-position: 50%;
                        filter: blur(20px);
                        transform: scale(1.5);
                        img {
                            transform: translate3d(0, -20%, 0);
                            display: block;
                            width: 100%;
                            border-radius: 0.1rem;
                        }
                    }
                }
                .song-sheet-header {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                    padding: 1rem 0.4rem 0 0.4rem;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    z-index: 10;
                    .song-sheet-info {
                        color: #fff;
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-evenly;
                        .header {
                            display: flex;
                            .left-img {
                                position: relative;
                                margin-right: 0.5rem;
                                .song-sheet-image {
                                    position: relative;
                                    width: 2.5rem;
                                    height: 2.5rem;
                                    .image {
                                        position: absolute;
                                        left: 0;
                                        top: 0;
                                        width: 100%;
                                        height: 100%;
                                        z-index: 3;
                                        background: $color-common-b;
                                        border-radius: 0.1rem;
                                        img {
                                            display: block;
                                            width: 100%;
                                            height: 100%;
                                            border-radius: 0.1rem;
                                        }
                                    }
                                    .playCount {
                                        position: absolute;
                                        top: 0;
                                        right: 0.1rem;
                                        height: 0.7rem;
                                        line-height: 0.7rem;
                                        color: #fff;
                                        font-size: $font-size-smaller-x;
                                        z-index: 10;
                                        i {
                                            font-size: $font-size-smaller-x;
                                        }
                                    }
                                }
                            }
                            .right-info {
                                display: flex;
                                flex-direction: column;
                                justify-content: space-evenly;
                                width: 100%;
                                color: #fff;
                                font-size: $font-size-smaller-x;
                                no-wrap();
                                .creator {
                                    display: flex;
                                    height: 0.7rem;
                                    line-height: 0.7rem;
                                    .avatar {
                                        margin-right: 0.3rem;
                                        display: block;
                                        width: 0.7rem;
                                        height: 0.7rem;
                                        border-radius: 50%;
                                        background: $color-common-b;
                                    }
                                    .name {
                                        color: #fff;
                                        no-wrap();
                                        font-size: $font-size-smaller;
                                    }
                                }
                                .func {
                                    display: flex;
                                    .func-item {
                                        display: flex;
                                        align-items: center;
                                        margin-right: 0.5rem;
                                        &:last-child {
                                            margin-right: 0;
                                        }
                                        .icon {
                                            margin-right: 0.05rem;
                                            &.followed {
                                                color: $color-common;
                                            }
                                        }
                                    }
                                    .icon,
                                    .iconfont {
                                        font-size: 0.65rem;
                                    }
                                }
                            }
                        }
                        .tags {
                            opacity: 0.4;
                        }
                    }
                }
            }
            .section-container {
                position: relative;
                flex: 1;
                .songs-desc {
                    padding: 0.4rem 0.4rem 0 0.4rem;
                    position: relative;
                    .desc {
                        margin-right: 2.3rem;
                        line-height: 0.65rem;
                        font-weight: 500;
                        font-size: $font-size-small-x;
                        no-wrap2();
                    }
                    .songs-nt {
                        margin-top: 0.3rem;
                        display: flex;
                        justify-content: space-between;
                        color: $color-common-b2;
                        height: 0.6rem;
                        line-height: 0.6rem;
                        .songs-num {
                            font-size: $font-size-smaller;
                        }
                        .songs-time {
                            font-size: $font-size-smaller-x;
                        }
                    }
                    .playBtn {
                        position: absolute;
                        right: 0.6rem;
                        top: -0.8rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: red;
                        background: linear-gradient(to bottom right, #f48faa, #f57f9e);
                        width: 1.5rem;
                        height: 1.5rem;
                        border-radius: 50%;
                        box-shadow: 0 0 0.2rem #f57f9e;
                        i {
                            margin-left: 0.1rem;
                            color: #fff;
                            font-size: 0.7rem;
                        }
                    }
                }
            }
        }
        .overlay-container {
            top: 0;
            bottom: 0;
            overflow-y: scroll;
            overflow-x: hidden;
            z-index: 99;
            &::-webkit-scrollbar {
                display: none;
            }
            .container {
                position: absolute;
                top: 0;
                left: 0;
                padding: 1.2rem 0.5rem 1rem;
                width: 100%;
                min-height: 100%;
                box-sizing: border-box;
                color: #fff;
                .top {
                    margin-bottom: 0.5rem;
                    width: 100%;
                    .image-container {
                        margin-bottom: 0.5rem;
                        .image {
                            margin: 0 auto;
                            width: 4.5rem;
                            height: 4.5rem;
                            border-radius: 0.1rem;
                            img {
                                display: block;
                                width: 100%;
                                height: 100%;
                                border-radius: 0.1rem;
                            }
                        }
                    }
                    .title {
                        font-weight: bold;
                        line-height: 0.7rem;
                        text-align: center;
                        font-size: $font-size-smaller-x;
                    }
                }
                .bottom {
                    font-size: $font-size-mini;
                    .tags {
                        display: flex;
                        margin-bottom: 0.5rem;
                        opacity: 0.4;
                        .title {
                            line-height: 0.6rem;
                            margin-right: 0.4rem;
                        }
                    }
                    .content {
                        line-height: 0.55rem;
                        white-space: pre-wrap;
                    }
                }
            }
            .bg {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: -1;
                .filter {
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    background: $color-common-b2;
                }
                .image {
                    width: 100%;
                    height: 100%;
                    background: no-repeat 50% / cover;
                    filter: blur(140px);
                }
            }
            .close {
                position: fixed;
                right: 0.5rem;
                top: 0.5rem;
                .icon {
                    width: 1rem;
                    height: 1rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    i {
                        color: #fff;
                        font-size: $font-size-smaller;
                    }
                }
            }
        }
    }
</style>