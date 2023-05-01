<template>
  <div class="mv-item-container">
    <div class="video-image">
      <div class="image">
        <img v-lazy="item.imgurl" class="animated fadeIn">
      </div>
      <div class="publishTime-playCount">
        <div class="publish-time">
          {{item.publishTime}}
        </div>
        <div class="play-count">
          <i class="iconfont icon-bofang"></i>
          <span>{{item.playCount|convertCount}}</span>
        </div>
      
      </div>
      <div class="layer"></div>
    </div>
    <div class="title">
      <div class="icon">
        <van-tag plain size="medium" color="#FD4979">mv</van-tag>
      </div>
      <div class="text">
        {{item.name}}
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        props: {
            item: Object
        }
    }
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable';
    .mv-item-container {
        width: 100%;
        box-sizing: border-box;
        border-radius: 0.3rem;
        height: 4.3rem;
        .video-image {
            position: relative;
            z-index: 1;
            .image {
                width: 100%;
                height: 2.7rem;
                border-radius: 0.3rem;
                background-color: $color-common-b;
                img {
                    display: block;
                    width: 100%;
                    height: 100%;
                    border-radius: 0.1rem;
                }
            }
            .publishTime-playCount {
                position: absolute;
                width: 100%;
                bottom: 0;
                left: 0;
                padding: 0 0.2rem;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                height: 0.6rem;
                line-height: 0.6rem;
                color: #fff;
                font-size: $font-size-mini;
                border-radius: 0 0 0.1rem 0.1rem;
                z-index: 99;
                i {
                    margin-right: 0.1rem;
                    font-size: $font-size-mini;
                }
            }
            .layer {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                width: 100%;
                height: 100%;
                background-image: linear-gradient(transparent 70%, rgba(0, 0, 0, 0.5));
                z-index: 90;
            }
        }
        .title {
            position: relative;
            margin-top: 0.25rem;
            display: flex;
            .text {
                text-indent: 0.8rem;
                line-height: 0.55rem;
                font-size: $font-size-mini;
                no-wrap2();
            }
            .icon {
                position: absolute;
                left: 0;
                top: 0;
            }
        }
    }
</style>