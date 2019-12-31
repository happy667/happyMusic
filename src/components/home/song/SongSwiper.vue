<template>
  <div class="song-swiper-container">
    <slot></slot>
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide"
             v-for="item in recommendNewSong"
             :key="item.id">
          <song-img-item :song="item"></song-img-item>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from 'swiper'
import SongImgItem from './SongImgItem'
import 'jquery'
export default {
  props: {
    recommendNewSong: Array
  },
  methods: {
    // 初始化轮播图组件
    initSwiper () {
      // eslint-disable-next-line no-unused-vars
      var mySwiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        slidesPerGroup: 1,
        allowSlidePrev: false, // 静止向左滑动
        // 解决与vant标签页切换冲突问题
        observer: true,
        observeParents: true,
        on: {
          touchStart (e) {
            e.stopPropagation()
          }
        }
      })
      // swipeRefreshLayout.measure(0, 0)
      // swipeRefreshLayout.setRefreshing(true)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initSwiper()
    })
  },
  components: {
    SongImgItem
  }
}
</script>
<style lang="stylus" scoped>
.song-swiper-container {
  .swiper-container {
    .swiper-wrapper {
      width: 100%;
      padding: 0 0.4rem;
      box-sizing: border-box;

      .swiper-slide {
        width: auto;
        margin-right: 0.3rem;
      }
    }
  }
}
</style>