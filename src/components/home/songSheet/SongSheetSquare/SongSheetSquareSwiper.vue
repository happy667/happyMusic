<template>
  <div class="song-sheet-square-swiper-container">
    <div class="swiper square-swiper" v-swiper-nested>
      <div class="swiper-wrapper">
        <div class="swiper-slide" :data-id="item.id" v-for="item in list" :key="item.id">
          <div class="swiper-list-item">
            <song-Sheet-swiper-item
              :item="item"
              :showPlayCount="true"
              :key="item.id"
              @select="selectItem"
            ></song-Sheet-swiper-item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from "swiper";
import SongSheetSwiperItem from "@/components/common/miniSwiper/MiniSwiperItem";
export default {
  props: {
    list: Array,
  },
  mounted() {
    this.$nextTick(() => {
      // 初始化轮播图组件
      this.initSwiper();
    });
  },
  methods: {
    // 初始化轮播图组件
    initSwiper() {
      // 通过settimeout 解决数据还没有完全加载的时候就已经渲染swiper，导致loop失效。
      setTimeout(() => {
        new Swiper(".square-swiper", {
          slidesPerView: 3,
          spaceBetween: 30,
          centeredSlides: true,
          loop: true,
          lazy: true,
          nested: true,
        });
      }, 0);
    },
    // 选择歌单进入歌单详情
    selectItem({ id }) {
      this.$router.push({ path: `/songSheetDisc/${id}` });
    },
  },
  components: {
    SongSheetSwiperItem,
  },
};
</script>
<style lang="stylus" scoped>
.song-sheet-square-swiper-container {
  .swiper {
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
