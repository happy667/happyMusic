<template>
  <div class="mini-swiper-container">
    <slot></slot>
    <div class="swiper mini-swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide"
             v-for="item in list"
             :key="item.id">
          <mini-swiper-item :item="item"
                            :showPlayCount="showPlayCount"
                            :showIcon="showIcon"
                            ref="item"
                            @select="selectItem"></mini-swiper-item>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from "swiper";
import MiniSwiperItem from "./MiniSwiperItem";

export default {
  props: {
    list: Array,
    showPlayCount: {
      type: Boolean,
      default: false,
    },
    showIcon: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 初始化轮播图组件
    initSwiper () {
      setTimeout(() => {
        var mySwiper = new Swiper(".mini-swiper", {
          slidesPerView: "auto",
          slidesPerGroup: 1,
          touchRatio: 1.2,
          nested: true, // capture阶段监听document touchmove，先于Vant处理
          loop: true,
        });
        // 解决 Swiper 12 与 Vant Swipe 的滑动冲突
        // 仅水平滑动时 stopPropagation 阻断 Vant，垂直滑动不拦截
        const swiperEl = mySwiper.el;
        let startX = 0,
          startY = 0;
        swiperEl.addEventListener(
          "touchstart",
          (e) => {
            if (e.touches.length === 1) {
              startX = e.touches[0].clientX;
              startY = e.touches[0].clientY;
            }
          },
          { passive: true }
        );
        swiperEl.addEventListener(
          "touchmove",
          (e) => {
            if (e.touches.length !== 1) return;
            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;
            if (Math.abs(dx) > Math.abs(dy)) {
              e.stopPropagation(); // 水平滑动：阻断 Vant track
            }
            // 垂直滑动不拦截，允许 BetterScroll/Vant 正常处理
          },
          { passive: false, capture: true }
        );
      }, 0);
    },

    // 选择专辑进入专辑页面
    selectItem (item) {
      this.$router.push({
        path: `/singerAlbum/${item.id}`,
      });
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.initSwiper();
    });
  },
  components: {
    MiniSwiperItem,
  },
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.mini-swiper-container {
  .swiper {
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
