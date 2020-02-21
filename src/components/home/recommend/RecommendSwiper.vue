<template>
  <div class="recommend-swiper-container">
    <div class="swiper-container sw-banner">
      <div class="swiper-wrapper">
        <div class="swiper-slide"
             @click="selectItem(item)"
             v-for="item in banners"
             :key="item.id">
          <div class="image">
            <img :src="item.imageUrl">
            <div class="title"
                 :style="{backgroundColor:item.titleColor}">{{item.typeTitle}}</div>
          </div>
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>

</template>
<script>
import Swiper from 'swiper'
import Song from '@/assets/common/js/song.js'
import Singer from '@/assets/common/js/singer.js'
import songApi from '@/api/song.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  targetType
} from '@/assets/common/js/config.js'
import { mapMutations } from 'vuex'
export default {
  props: {
    // 轮播图数据
    banners: {
      type: Array
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initSwiper()
    })
  },
  methods: {
    ...mapMutations(['setIsAdvance']),
    selectItem (item) {
      console.log(item)
      let id = item.targetId
      switch (item.targetType) {
        case targetType.song:// 歌曲
          // 获取歌曲
          this.getSongDetail(id).then(res => {
            // 引入vue原型上的utils
            this.utils.playMusic(res)
          })
          break
        case targetType.video:// 视频
          this.$router.push(`/videoInfo/${id}`)
          break
        case targetType.album:// 专辑
          // 设置为前进页面
          this.setIsAdvance(true)
          this.$router.push(`/singerAlbum/${id}`)
          break
        case targetType.songSheet:// 歌单
          this.$router.push(`/songSheetDisc/${id}`)
          break
      }
    },
    async getSongDetail (id) {
      // 获取歌曲详情
      const {
        data: res
      } = await songApi.getSongDetail(id)
      if (res.code === ERR_OK) {
        let item = res.songs[0]
        let singers = item.ar.map(item => item.name).join('/')
        // 处理歌手
        let singersList = []
        // 处理歌手
        item.ar.forEach(item => {
          singersList.push(new Singer({
            id: item.id,
            name: item.name
          }))
        })
        let song = new Song({ id: item.id, name: item.name, singers, singersList, picUrl: item.al.picUrl })
        return Promise.resolve(song)
      }
    },
    // 初始化轮播图组件
    initSwiper () {
      // 通过settimeout 解决数据还没有完全加载的时候就已经渲染swiper，导致loop失效。
      setTimeout(() => {
        // eslint-disable-next-line no-unused-vars
        var mySwiper = new Swiper('.sw-banner', {
          pagination: {
            el: '.swiper-pagination'
          },
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
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.recommend-swiper-container>>>.swiper-pagination-bullet-active {
  background: $color-common;
}

.recommend-swiper-container {
  width: 100%;
  padding: 0.2rem 0;
  box-sizing: border-box;
  border-radius: 0.3rem;

  .swiper-container {
    .swiper-wrapper {
      width: 100%;
      border-radius: 0.3rem;

      .swiper-slide {
        padding: 0 0.3rem;
        height: 4.2rem;
        box-sizing: border-box;
        border-radius: 0.3rem;

        .image {
          position: relative;
          width: 100%;
          height: 100%;

          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 0.2rem;
          }

          .title {
            position: absolute;
            right: 0;
            bottom: 0;
            padding: 0.1rem 0.15rem;
            color: #fff;
            border-radius: 0.2rem 0 0.2rem 0;
          }
        }
      }
    }
  }
}

.my-bullet-active {
  background: #ff6600;
  opacity: 1;
}
</style>