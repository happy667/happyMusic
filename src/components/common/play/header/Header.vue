<template>
  <header class="header-container">
    <div class="back" @click="handleBack">
      <div class="icon">
        <van-icon name="arrow-down" />
      </div>
    </div>
    <div class="song-info">
      <div class="song-name">{{currentSong.name}}</div>
      <div class="singer" @click="handleClick">{{currentSong.singers}}</div>
    </div>
    <div class="share" ref="share" @click="handleClickShare()">
      <div class="icon">
        <i class="iconfont icon-fenxiang"></i>
      </div>
    </div>
    <singer-popup :list="currentSong.singersList" :showPopup="showSingerPopup" @showPopup="showSingerPopup=true"
      @closePopup="showSingerPopup=false" @clickListItem="clickListItem" @finishedLoadImage="handleFinished"
      :isLoadImage="isLoadImage"></singer-popup>
  </header>

</template>
<script>
    import Clipboard from 'clipboard'
    import SingerPopup from '@/components/common/SingerPopup'
    import {
        mapState,
        mapGetters,
        mapMutations
    } from 'vuex'
    export default {
        data() {
            return {
                // 显示歌手弹出层
                showSingerPopup: false
            }
        },
        computed: {
            ...mapState(['currentPlayIndex', 'user']),
            ...mapGetters(['currentSong']),
            // 是否要加载图片
            isLoadImage: {
                get() {
                    return this.$store.state.isLoadPlayerImage
                },
                set(val) {
                    this.$store.commit('setIsLoadPlayerImage', val)
                }
            }

        },
        watch: {
            currentPlayIndex() {
                if (this.currentPlayIndex !== -1) {
                    // 初始化分享
                    this.initShare()
                }
            }
        },
        methods: {
            ...mapMutations(['setPlayerFullScreen', 'setSinger', 'setSingerCurrentIndex', 'setIsPlayerClick', 'setAddNoCacheComponents', 'setIsGetSingerImage']),
            handleBack() {
                this.$store.commit('setIsPlayerClick', false)
                this.setPlayerFullScreen(false)
            },
            // 选择歌手
            handleClick() {
                let list = this.currentSong.singersList
                if (list.length === 1) { // 只有一个歌手直接跳转到歌手页面
                    let currentPath = `/singerInfo/${this.currentSong.singersList[0].id}`
                    console.log(currentPath + "===" + this.$route.path)
                    if (this.$route.path !== currentPath) {
                        this.setSingerCurrentIndex(0)
                        this.$router.push(`/singerInfo/${this.currentSong.singersList[0].id}`)
                    }
                    // 如果当前歌手详情页就是所选歌手直接隐藏全屏播放器
                    this.setIsPlayerClick(true)
                    this.setPlayerFullScreen(false)
                } else {
                    this.showSingerPopup = true
                }
                this.setIsPlayerClick(true)
            },
            // 选择列表中歌手
            clickListItem() {
                this.setIsPlayerClick(true)
                this.setPlayerFullScreen(false)
                this.showSingerPopup = false
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
                            return `分享${this.currentSong.singers}的单曲《${this.currentSong.name}》:\rhttps://music.163.com/#/song/${this.currentSong.id}/?userid=${this.user.userId}(来自@网易云音乐)`
                        } else {
                            return `分享${this.currentSong.singers}的单曲《${this.currentSong.name}》:\rhttps://music.163.com/#/song/${this.currentSong.id}(来自@网易云音乐)`
                        }
                    }
                })
            },
            // 数据获取完成
            handleFinished() {
                this.isLoadImage = false
            }

        },
        components: {
            SingerPopup
        }

    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    .header-container {
        margin: 0.4rem 0.1rem 0.1rem;
        position: relative;
        display: flex;
        font-size: $font-size-small;
        .back,
        .share {
            position: absolute;
            top: 0;
            width: 1rem;
            height: 1rem;
            line-height: 1rem;
            color: #fff;
            z-index: 999;
            text-align: center;
            i {
                font-size: $font-size-small;
            }
        }
        .back {
            left: 0;
        }
        .song-info {
            width: 100%;
            margin: 0 1.5rem;
            box-sizing: border-box;
            overflow: hidden;
            .song-name,
            .singer {
                width: 100%;
                height: 0.7rem;
                line-height: 0.7rem;
                text-align: center;
            }
            .song-name {
                color: #fff;
                no-wrap();
                font-size: $font-size-small-x;
            }
            .singer {
                no-wrap();
                color: hsla(0, 0%, 100%, .6);
                font-size: $font-size-smaller;
            }
        }
        .share {
            right: 0;
        }
    }
</style>