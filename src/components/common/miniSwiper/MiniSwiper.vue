<template>
  <div class="mini-swiper-container">
    <slot></slot>
    <div class="swiper-container mini-swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide"
             v-for="item in list"
             :key="item.id">
          <mini-swiper-item :item="item"
                            ref="item"
                            @select="selectItem"></mini-swiper-item>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from 'swiper'
import MiniSwiperItem from './MiniSwiperItem'

export default {
  props: {
    list: Array
  },
  methods: {

    // 初始化轮播图组件
    initSwiper () {
      // eslint-disable-next-line no-unused-vars
      var mySwiper = new Swiper('.mini-swiper', {
        slidesPerView: 'auto',
        slidesPerGroup: 1,
        resistanceRatio: 0, // 解决左滑留白问题
        // 解决与vant标签页切换冲突问题
        observer: true,
        observeParents: true,
        loop: true,
        touchRatio: 1.2,
        // 使用图片懒加载
        lazy: {
          loadPrevNext: true,
          loadOnTransitionStart: true,
          loadPrevNextAmount: 3
        },
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        on: {
          sliderMove (e) {
            e.stopPropagation()
          }
        }
      })
    },

    // 选择专辑进入专辑页面
    selectItem (item) {
      this.$router.push({ path: `/singerAlbum/${item.id}` })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initSwiper()
    })
  },
  components: {
    MiniSwiperItem
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.mini-swiper-container {
  min-height: 3.5rem;

  .swiper-container {
    .swiper-wrapper {
      width: 100%;
      padding: 0 0.4rem 0.5rem;
      box-sizing: border-box;

      .swiper-slide {
        width: auto;
        margin-right: 0.3rem;
        box-sizing: border-box;
      }
    }
  }
}
</style>