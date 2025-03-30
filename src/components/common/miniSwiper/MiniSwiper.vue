<template>
  <div class="mini-swiper-container">
    <slot></slot>
    <div class="swiper-container mini-swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="item in list" :key="item.id">
          <mini-swiper-item :item="item" :showPlayCount="showPlayCount" :showIcon="showIcon" ref="item"
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
    list: Array,
    showPlayCount: {
      type: Boolean,
      default: false
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  methods: {

    // 初始化轮播图组件
    initSwiper () {
      setTimeout(() => {
        var mySwiper = new Swiper('.mini-swiper', {
          slidesPerView: 'auto',
          slidesPerGroup: 1,
          touchRatio: 1.2,
          // 解决与vant标签页切换冲突问题
          observer: true,
          observeParents: true,
          loop: true,
          // 使用图片懒加载
          lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 3
          },
          on: {
            sliderMove (e) {
              e.stopPropagation()
            }
          }
        })
      }, 0)

    },

    // 选择专辑进入专辑页面
    selectItem (item) {
      this.$router.push({
        path: `/singerAlbum/${item.id}`
      })
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