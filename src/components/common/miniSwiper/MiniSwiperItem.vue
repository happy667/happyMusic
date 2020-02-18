<template>
  <div class="mini-swiper-item-container"
       @click="handleClick">
    <div class="mini-swiper-item">
      <div class="image-wrapper">
        <div class="image">
          <img :src="item.picUrl"
               :key="item.picUrl">
          <div class="icon">
            <van-icon name="play-circle-o" />
          </div>
        </div>
      </div>
      <div class="name">{{item.name}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object
  },
  methods: {
    handleClick () {
      console.log(123)
      this.$emit('select', this.item)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.mini-swiper-item-container {
  background: $color-common-background;

  .mini-swiper-item {
    box-sizing: border-box;
    padding: 0.3rem 0.2rem;
    width: 2.8rem;
    background: $color-common-background;
    box-shadow: 0 0.25rem 0.6rem rgba(0, 0, 0, 0.1);
    border-radius: 0.3rem;

    .image-wrapper {
      width: 100%;
      height: 2rem;
      padding: 0 0.17rem;
      border-radius: 0.3rem;
      margin-bottom: 0.2rem;
      box-sizing: border-box;

      .image {
        position: relative;
        background: #f4f4f4;

        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 0.3rem;
        }
      }

      .icon {
        position: absolute;
        right: 0.25rem;
        bottom: 0rem;
        font-size: 0.8rem;
        color: #fff;
      }
    }

    .name {
      width: 100%;
      line-height: 0.5rem;
      word-wrap: break-word;
      font-size: $font-size-smaller;
      font-family: $font-common-title;
      text-align: center;
      no-wrap();
    }
  }
}
</style>