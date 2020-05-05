<template>
  <div class="singer-swiper-container">
    <slot></slot>
    <div class="swiper-container singer-swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide"
             v-for="item in list"
             :key="item.id">
          <singer-item :item="item"
                       @select="selectItem"></singer-item>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from 'swiper'
import SingerItem from './SingerItem'

export default {
  props: {
    list: Array
  },
  methods: {

    // 初始化轮播图组件
    initSwiper () {
      // eslint-disable-next-line no-unused-vars
      var mySwiper = new Swiper('.singer-swiper', {
        slidesPerView: 4,
        resistanceRatio: 0, // 解决左滑留白问题
        touchRatio: 1.2,
        // 使用图片懒加载
        lazy: {
          loadPrevNext: true,
          loadOnTransitionStart: true,
          loadPrevNextAmount: 5
        },
        on: {
          sliderMove (e) {
            e.stopPropagation()
          }
        }
      })
    },

    selectItem (item) {
      this.$emit('selectItem', item)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initSwiper()
    })
  },
  components: {
    SingerItem
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-swiper-container {
  margin-bottom: 0.4rem;
}
</style>