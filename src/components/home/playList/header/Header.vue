<template>
  <header class="header">
    <!-- 左侧播放类型 -->
    <div class="left" @click="changeMode">
      <div class="play-type icon">
        <i class="iconfont" :class="playModeIcon"></i>
      </div>
      <div class="type-name">{{playModeText}}</div>
      <div class="list-num">({{sequenceList.length}}首)</div>
    </div>
    <div class="right" @click="clearPlayList">
      <div class="play-type icon">
        <i class="iconfont icon-shanchu"></i>
      </div>
    </div>
  </header>
</template>
<script>
    import {
        mapState,
        mapMutations,
        mapGetters,
        mapActions
    } from 'vuex'
    import {
        PLAY_MODE
    } from '@/assets/common/js/config.js'
    export default {
        computed: {
            ...mapState(['playMode', 'sequenceList', 'currentPlayIndex']),
            ...mapGetters(['currentSong']),
            playModeIcon() {
                return this.playMode === PLAY_MODE.sequence ? 'icon-xunhuanbofang' : this.playMode === PLAY_MODE.loop ? 'icon-danquxunhuan' : 'icon-suijibofang'
            },
            playModeText() {
                return this.playMode === PLAY_MODE.sequence ? '列表循环' : this.playMode === PLAY_MODE.loop ? '单曲循环' : '随机播放'
            }
        },
        methods: {
            ...mapMutations(['setPlayMode', 'setCurrentPlayIndex', 'setPlayList']),
            ...mapActions(['deleteSongList']),
            clearPlayList() {
                this.$Dialog.confirm({
                    message: '确定要清空播放列表?',
                    confirmButtonColor: '#FD4979',
                    width: '265px'
                }).then(() => {
                    this.deleteSongList()
                }).catch(() => {

                })
            },
            // 切换播放类型
            changeMode() {
                const mode = (this.playMode + 1) % 3
                this.setPlayMode(mode)
                let list = null
                if (mode === PLAY_MODE.random) { // 随机播放
                    list = this.$utils.randomList(this.sequenceList)
                } else {
                    list = this.sequenceList
                }
                this.resetCurrentIndex(list)
                this.setPlayList(list)
            },
            // 重置当前索引
            resetCurrentIndex(list) {
                let index = list.findIndex(item => item.id === this.currentSong.id)
                this.setCurrentPlayIndex(index)
            }
        }
    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    .header {
        width: 100%;
        padding: 0 0.2rem 0 0.4rem;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        font-size: $font-size-smaller-x;
        border-bottom: 0.02rem solid #efefef;
        i {
            font-size: $font-size-smaller;
        }
        .left {
            height: 1.2rem;
            line-height: 1.2rem;
            display: flex;
            .icon {
                color: $color-common-b2;
                margin-right: 0.1rem;
            }
        }
        .right {
            display: flex;
            justify-content: center;
            width: 0.8rem;
            color: $color-common-b2;
            height: 1.2rem;
            line-height: 1.2rem;
        }
    }
</style>