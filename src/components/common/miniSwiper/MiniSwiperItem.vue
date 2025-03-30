<template>
  <div class="mini-swiper-item-container"
       @click.stop="handleClick">
    <div class="mini-swiper-item">
      <div class="image-wrapper">
        <div class="image animated fadeIn">
          <img :data-src="picUrl"
               class="swiper-lazy"
               :key="picUrl">
          <div class="playCount"
               v-if="showPlayCount">
            <i class="iconfont icon-bofang"></i> {{ item.playCount | convertCount }}
          </div>
          <div class="icon"
               v-if="showIcon">
            <van-icon name="play-circle-o" />
          </div>
        </div>
      </div>
      <div class="name">{{ item.name }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
    showPlayCount: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    picUrl () {
      return this.item.picUrl || this.item.coverImgUrl
    }
  },
  methods: {
    handleClick () {
      this.$emit('select', this.item)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.mini-swiper-item-container {
  position: relative;
  width: 2.8rem;
  height: 0;
  padding-bottom: 3.3rem;
  border-radius: 0.3rem;

  .mini-swiper-item {
    position: absolute;
    left: 0;
    top: 0;
    box-sizing: border-box;
    padding: 0.3rem 0.2rem;
    width: 2.8rem;
    height: 3.3rem;
    background: $color-common-background;
    box-shadow: 0 0.06rem 0.16rem rgba(0, 0, 0, 0.07);
    border-radius: 0.3rem;

    .image-wrapper {
      width: 100%;
      height: 2rem;
      padding: 0 0.2rem;
      border-radius: 0.3rem;
      margin-bottom: 0.2rem;
      box-sizing: border-box;

      .image {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 0.3rem;
        background: $color-common-b;

        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 0.3rem;
        }
      }

      .playCount {
        position: absolute;
        right: 0;
        top: 0.1rem;
        color: #fff;
        height: 0.4rem;
        padding: 0.07rem 0.15rem;
        display: flex;
        align-items: center;
        border-radius: 0 0.3rem 0 0.3rem;
        font-size: 0.35rem;

        i {
          font-size: $font-size-smaller-x;
        }
      }

      .icon {
        position: absolute;
        right: 0.1rem;
        bottom: 0rem;
        font-size: 0.8rem;
        color: #fff;
      }
    }

    .name {
      width: 100%;
      line-height: 0.5rem;
      word-wrap: break-word;
      font-size: $font-size-smaller-x;
      text-align: center;
      no-wrap();
      color: $color-common-x;
    }
  }
}
</style>