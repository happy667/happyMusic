<template>
  <div class="song-sheet-swiper-container">
    <slot></slot>
    <div class="swiper-container sw-song-sheet">
      <div class="swiper-wrapper">
        <div class="swiper-slide"
             v-for="item in recommendNewSongSheet"
             :key="item.id">
          <song-sheet-swiper-item :song-sheet="item"></song-sheet-swiper-item>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from 'swiper'
import SongSheetSwiperItem from './SongSheetSwiperItem'
export default {
  props: {
    recommendNewSongSheet: Array
  },
  methods: {
    // 初始化轮播图组件
    initSwiper () {
      // eslint-disable-next-line no-unused-vars
      var mySwiper = new Swiper('.sw-song-sheet', {
        slidesPerView: 'auto',
        resistanceRatio: 0, // 解决左滑留白问题
        // 解决与vant标签页切换冲突问题
        observer: true,
        observeParents: true,
        loop: true,
        on: {
          touchStart (e) {
            e.stopPropagation()
          }
        }
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initSwiper()
    })
  },
  components: {
    SongSheetSwiperItem
  }
}
</script>
<style lang="stylus" scoped>
.song-sheet-swiper-container {
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