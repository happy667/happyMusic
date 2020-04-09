<template>
  <div class="song-swiper-container">
    <slot></slot>
    <div class="swiper-container sw-song">
      <div class="swiper-wrapper">
        <div class="swiper-slide"
             :data-index="index"
             v-for="(item,index) in recommendNewSong"
             :key="item.id"
             @click="handleSelect(item,index)">
          <song-item :showImage="true"
                     :song="item"></song-item>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from 'swiper'
import SongItem from './SongItem'
import { getData, getParentByClassName } from '@/assets/common/js/dom.js'
export default {
  props: {
    recommendNewSong: Array
  },
  methods: {
    // 初始化轮播图组件
    initSwiper () {
      // 这里的this是vue对象，提前声明(需要在swiper中应用)
      let _this = this
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
            },
            // 解决阻止事件传播点击事件失效
            // 利用自定义属性获取点击歌曲索引，再使用handleSelect与父组件通信
            click (e) {
              console.log(e.target)
              let target = getParentByClassName(e.target, 'swiper-slide')
              let index = getData(target, 'index')
              console.log(index)
              if (index) { // 如果获取到index就播放歌曲
                let song = _this.recommendNewSong[index]
                _this.handleSelect(song, index)
              }
            }
          }
        })
      }, 0)
    },
    handleSelect (item, index) {
      this.$emit('select', item, index)
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
  border-radius: 0.2rem;
  padding: 0.2rem;
  box-shadow: 0 0.1rem 0.35rem rgba(0, 0, 0, 0.1);
}

.song-swiper-container {
  .swiper-container {
    .swiper-wrapper {
      .swiper-slide {
        width: 100%;
        box-sizing: border-box;
        padding: 0.3rem 0.4rem;
      }
    }
  }
}
</style>