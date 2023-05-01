<template>
  <div class="song-sheet-item-container">
    <div class="sons-img">
      <div class="songs-playCount" v-if="playCount">
        <i class="iconfont icon-bofang"></i> {{playCount|convertCount}}
      </div>
      <img v-lazy="picUrl" class="animated fadeIn" :key="picUrl">
    </div>
    <div class="songs-desc">{{songSheet.name}}</div>

  </div>
</template>
<script>
    import 'common/js/convert.js'
    export default {
        props: {
            songSheet: Object
        },
        computed: {
            picUrl() {
                return this.songSheet.picUrl ? this.songSheet.picUrl : this.songSheet.coverImgUrl
            },
            playCount() {
                return this.songSheet.playCount ? this.songSheet.playCount : this.songSheet.playcount
            }
        }
    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    .song-sheet-item-container {
        display: flex;
        align-content: space-between;
        flex-wrap: wrap;
        width: 100%;
        box-sizing: border-box;
        padding: 0.1rem 0.48rem 0.3rem;
        box-shadow: 0 0.06rem 0.16rem rgba(0, 0, 0, 0.07);
        border-radius: 0.3rem;
        height: 5.2rem;
        .sons-img {
            position: relative;
            width: 100%;
            padding: 0 0.17rem;
            height: 3rem;
            box-sizing: border-box;
            border-radius: 0.3rem;
            .songs-playCount {
                position: absolute;
                padding: 0.07rem 0.15rem;
                right: 0.17rem;
                height: 0.5rem;
                line-height: 0.5rem;
                border-radius: 0 0.3rem 0 0.3rem;
                color: #fff;
                font-size: $font-size-mini;
                no-wrap();
                z-index: 1;
                background-color: rgba(0, 0, 0, .45);
                i {
                    font-size: $font-size-mini;
                }
            }
            img {
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 0.3rem;
                background: $color-common-b;
            }
        }
        .songs-desc {
            margin-bottom: 0.2rem;
            width: 100%;
            line-height: 0.55rem;
            word-wrap: break-word;
            font-size: $font-size-smaller-x;
            no-wrap2();
        }
    }
</style>