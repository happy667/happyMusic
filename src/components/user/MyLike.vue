<template>
  <div class="my-like-container" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar :title="$route.meta.title" ref="navBar" left-arrow @click-left="routerBack" />
    </van-sticky>

    <section>
      <scroll ref="my_like_scroll">
        <div class="container" ref="container">
          <!-- loading -->
          <loading :loading="pageLoading" />
          <template v-if="songList&&songList.length!==0">
            <play-all :length="songList.length" @play="handlePlayAll(songList)"></play-all>
            <song-list @select="selectSong" ref="songList" :songsList="songList"></song-list>
          </template>

<template v-if="!pageLoading&&songList.length===0">
            <no-result text="暂无收藏的歌曲"></no-result>
          </template>

</div>
</scroll>
<!-- 定位 -->
<position v-show="isShowPosition" @click="handlePosition"></position>
</section>
</div>
</template>
<script>
    import PlayAll from '@/components/common/PlayAll'
    import Scroll from '@/components/common/Scroll'
    import Position from '@/components/common/Position'
    import SongList from '@/components/home/song/SongList'
    import Singer from '@/assets/common/js/singer.js'
    import Song from '@/assets/common/js/song.js'
    import NoResult from '@/components/common/NoResult'
    import Album from '@/assets/common/js/album.js'
    import songApi from '@/api/song.js'
    import {
        ERR_OK
    } from '@/api/config.js'
    import {
        mapState,
        mapActions,
        mapGetters
    } from 'vuex'
    import {
        playlistMixin
    } from '@/assets/common/js/mixin.js'
    export default {
        name: 'myLike',
        data() {
            return {
                songList: null, // 歌曲列表
                loading: true,
                showPosition: false
            }
        },
        mixins: [playlistMixin],
        computed: {
            ...mapState(['user', 'userLikeList', 'currentPlayIndex']),
            ...mapGetters(['currentSong']),
            // 是否显示定位
            isShowPosition() {
                if (!this.songList) return
                    // 判断当前歌曲列表是否有正在播放的歌曲（-1表示没有)
                let index = this.$utils.findIndex(this.songList, this.currentSong)
                return this.showPosition && index !== -1
            },
            pageLoading() {
                return !this.songList
            }
        },
        watch: {
            userLikeList() {
                if (this.user) {
                    this.getSongDetail()
                }
            }
        },
        methods: {
            ...mapActions(['getUserLikeList']),
            // 返回上一个路由
            routerBack() {
                this.$utils.routerBack()
            },
            handleNoLike(song) {
                // 移除歌曲
                this.$utils.removeItem(this.songList, song)
            },
            // 获取歌曲详情
            async getSongDetail() {
                if (this.userLikeList.length === 0) {
                    this.songList = []
                    this.loading = false
                    return
                }
                let ids = this.userLikeList.join(',')
                const {
                    data: res
                } = await songApi.getSongDetail(ids)
                if (res.code === ERR_OK) {
                    let songList = []
                    res.songs.forEach((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
                        let singers = item.ar.map(item => item.name).join('/')
                        let singersList = []
                            // 处理歌手
                        item.ar.forEach(item => {
                            singersList.push(new Singer({
                                id: item.id,
                                name: item.name
                            }))
                        })
                        let song = new Song({
                            id: item.id,
                            name: item.alia.length > 0 ? `${item.name} (${item.alia.join('/')})` : item.name,
                            singers,
                            singersList,
                            picUrl: item.al.picUrl,
                            st: item.st,
                            mv: item.mv,
                            album: new Album({
                                id: item.al.id,
                                name: item.al.name,
                                picUrl: item.al.picUrl
                            })
                        })
                        songList.push(song)
                    })
                    this.songList = songList
                    this.loading = false
                }
            },

            handlePosition() {
                // 说明有歌曲在播放
                if (this.currentSong) {
                    let index = this.songList.findIndex(item => item.id === this.currentSong.id)
                    let element = this.$refs.songList.$refs.listGroup[index]
                    this.$refs.my_like_scroll.scrollToElement(element, 0)
                    this.$refs.my_like_scroll.refresh()
                    this.$toast('已定位到当前歌曲')
                }
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
                const bottom = playList.length > 0 ? '1.5rem' : ''
                this.$nextTick(() => {
                    this.$refs.container.style.paddingBottom = bottom
                    this.$refs.my_like_scroll.refresh()
                })
            },
            // 选择歌曲
            async selectSong(item, index) {
                this.$emit('closeList')
                    // 比较两首歌曲
                let result = this.$utils.compareSong(this.currentSong, item)
                if (!result) {
                    // 引入vue原型上的utils
                    this.$utils.playMusic(item, this.songList, index)
                }
            },
            // 播放全部歌曲
            handlePlayAll(list) {
                // 引入vue原型上的utils
                this.$utils.playAllSong(list)
            },
        },
        mounted() {
            if (this.user) {
                this.getUserLikeList(this.user.userId)
            }
        },
        components: {
            SongList,
            Position,
            Scroll,
            NoResult,
            PlayAll
        }
    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    .my-like-container>>>.scroll {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    
    .my-like-container {
        position: fixed;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: $color-common-background;
        section {
            position: relative;
            flex: 1;
            .container {
                padding-top: 0.3rem;
            }
        }
    }
</style>