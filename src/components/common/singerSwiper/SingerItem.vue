<template>
  <div class="singer-swiper-item-container"
       @click="handleClick">
    <div class="singer-swiper-item">
      <div class="image animated fadeIn"
           :style="loadBgStyle">
        <img :data-src="item.avatar"
             class="swiper-lazy"
             :key="item.avatar">
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
  computed: {
    loadBgStyle () {
      return !this.item.avatar ? "background:#f2f3f5" : ''
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

.singer-swiper-item-container {
  margin: 0 0.3rem;
  box-sizing: border-box;

  .singer-swiper-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .image {
      position: relative;
      margin-bottom: 0.2rem;
      padding-bottom: 100%;
      border-radius: 50%;
      box-shadow: 0.06rem 0.06rem 0.14rem rgba(0, 0, 0, 0.3);

      img {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .name {
      width: 100%;
      line-height: 0.5rem;
      font-size: $font-size-smaller-x;
      text-align: center;
      no-wrap();
    }
  }
}
</style>