<template>
  <div class="song-swiper-container">
    <slot></slot>
    <div class="swiper-container sw-song">
      <div class="swiper-wrapper">
        <div class="swiper-slide"
             v-for="item in recommendNewSong"
             :key="item.id">
          <song-item :song="item"></song-item>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from 'swiper'
// import SongImgItem from './SongImgItem'
import SongItem from './SongItem'
export default {
  props: {
    recommendNewSong: Array
  },
  methods: {
    // 初始化轮播图组件
    initSwiper () {
      // 通过settimeout 解决数据还没有完全加载的时候就已经渲染swiper，导致loop失效。
      setTimeout(() => {
        // eslint-disable-next-line no-unused-vars
        var mySwiper = new Swiper('.sw-song', {
          slidesPerView: 1,
          slidesPerGroup: 1,
          touchRatio: 1.2,
          // 解决与vant标签页切换冲突问题
          observer: true,
          observeParents: true,
          loop: true,
          on: {
            touchStart (e) {
              e.stopPropagation()
            },
            touchEnd (e) {
              e.stopPropagation()
            }
          }
        })
      }, 0)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initSwiper()
    })
  },
  components: {
    // SongImgItem,
    SongItem
  }
}
</script>
<style lang="stylus" scoped>
.song-swiper-container>>>.swiper-container .swiper-wrapper .swiper-slide .songs-list-item-containter {
  padding: 0.2rem;
  border-radius: 0.2rem;
  box-shadow: 0 0.1rem 0.8rem rgba(0, 0, 0, 0.1);
}

.song-swiper-container {
  .swiper-container {
    .swiper-wrapper {
      .swiper-slide {
        width: 100%;
        box-sizing: border-box;
        padding: 0.45rem 0.4rem;
      }
    }
  }
}
</style>