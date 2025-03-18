<template>
  <div class="song-sheet-square-swiper-container">
    <div class="swiper-container square-swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide"
             :data-id="item.id"
             v-for="item in list"
             :key="item.id">
          <div class="swiper-list-item"
               @click="selectItem(item)">
            <song-Sheet-swiper-item :item="item"
                                    :key="item.id"></song-Sheet-swiper-item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from 'swiper'
import SongSheetSwiperItem from '@/components/common/miniSwiper/MiniSwiperItem'
import { getData, getParentByClassName } from '@/assets/common/js/dom.js'
export default {
  props: {
    list: Array
  },
  mounted () {
    this.$nextTick(() => {
      // 初始化轮播图组件
      this.initSwiper()
    })
  },
  methods: {
    // 初始化轮播图组件
    initSwiper () {
      // 这里的this是vue对象，提前声明(需要在swiper中应用)
      let _this = this
      // 通过settimeout 解决数据还没有完全加载的时候就已经渲染swiper，导致loop失效。
      setTimeout(() => {
        // eslint-disable-next-line no-new
        new Swiper('.square-swiper', {
          slidesPerView: 3,
          spaceBetween: 30,
          centeredSlides: true,
          initialSlide: 1,
          // 解决与vant标签页切换冲突问题
          observer: true,
          observeParents: true,
          loop: true,
          // 使用图片懒加载
          lazy: {
            loadPrevNext: true,
            loadOnTransitionStart: true,
            loadPrevNextAmount: 3
          },
          watchSlidesProgress: true,
          watchSlidesVisibility: true,
          on: {
            touchStart (e) {
              e.stopPropagation()
            },
            touchEnd (e) {
              e.stopPropagation()
            },
            // 解决阻止事件传播点击事件失效
            // 利用自定义属性获取id
            click (e) {
              let target = getParentByClassName(e.target, 'swiper-slide')
              let id = getData(target, 'id')
              if (id) {
                _this.selectItem(id)
              }
            }
          }
        })
      }, 0)
    },
    // 选择歌单进入歌单详情
    selectItem (id) {
      this.$router.push({ path: `/songSheetDisc/${id}` })
    }
  },
  components: {
    SongSheetSwiperItem
  }
}
</script>
<style lang="stylus" scoped>
.song-sheet-square-swiper-container {
  .swiper-container {
    padding: 0.5rem 0.3rem 0.4rem;

    .swiper-slide {
      display: flex;
      align-items: center;
      transition: 300ms;
      transform: scale(0.9);
    }

    .swiper-slide-active, .swiper-slide-duplicate-active {
      transform: scale(1.1);
    }
  }
}
</style>