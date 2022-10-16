<template>
  <div class="song-sheet-item-container">
    <div class="sons-img">
      <img v-lazy="picUrl" class="animated fadeIn" :key="picUrl">
    </div>
    <div class="songs-desc">{{songSheet.name}}</div>
    <div class="songs-playCount" v-if="playCount">
      <i class="iconfont icon-bofang"></i> {{playCount|convertCount}}
    </div>
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
        padding: 0.1rem 0.46rem 0.2rem;
        box-shadow: 0 0.25rem 0.6rem rgba(0, 0, 0, 0.1);
        border-radius: 0.3rem;
        height: 5.2rem;
        .sons-img {
            width: 100%;
            padding: 0 0.17rem;
            height: 3rem;
            box-sizing: border-box;
            border-radius: 0.3rem;
            margin-bottom: 0.15rem;
            img {
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 0.3rem;
                background: $color-common-b;
            }
        }
        .songs-desc {
            margin-bottom: 0.1rem;
            width: 100%;
            line-height: 0.55rem;
            word-wrap: break-word;
            font-size: $font-size-smaller-x;
            no-wrap2();
        }
        .songs-playCount {
            height: 0.5rem;
            line-height: 0.5rem;
            width: 100%;
            color: #999;
            font-size: $font-size-smaller-x;
            no-wrap();
        }
    }
</style>