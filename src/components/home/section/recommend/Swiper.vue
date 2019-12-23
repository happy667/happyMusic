<template>
  <div class="swiper-wrapper">
    <swiper :options="swiperOption">
      <!-- slides -->
      <swiper-slide>
        <div class="swiper-item">
          <img class="swiper-image"
               src="https://static.iamxk.com/wp-content/uploads/2019/11/cc2e90af-e935-4c46-b1c0-53f489824bf6-1-600x400.jpg" />
        </div>
      </swiper-slide>
      <div class="swiper-pagination"
           slot="pagination"></div>
    </swiper>
  </div>
</template>
<script>
export default {
  props: {
    swiperList: Array
  },
  data () {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        autoplay: true,
        loop: true
      }
    }
  },
  computed: {
    showSwiper () {
      return this.swiperList.length
    }
  }
}
</script>
<style lang="stylus" scoped>
.swiper-wrapper >>> .swiper-pagination-bullet-active {
  background: #fff !important;
}

.swiper-wrapper >>> .swiper-pagination-bullet {
  background: rgba(255, 255, 255, 1) !important;
}

.swiper-wrapper {
  .swiper-item {
    width: 5rem;
    height: 7rem;
    padding: 0.5rem;
  }

  .swiper-container {
    padding-bottom: 5rem;
    height: 0;
  }

  .swiper-image {
  }
}
</style>
