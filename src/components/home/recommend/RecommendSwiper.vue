<template>
  <div class="recommend-swiper-container">
    <div class="swiper-container sw-banner">
      <div class="swiper-wrapper">
        <div class="swiper-slide"
             @click="selectItem(item)"
             v-for="(item,index) in banners"
             :key="index">
          <div class="image"
               :data-bannerid="item.targetId"
               :data-bannertype="item.targetType">
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
import { mapMutations, mapGetters } from 'vuex'
import { getData, getParentByClassName } from '@/assets/common/js/dom.js'
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
  computed: {
    ...mapGetters(['currentSong'])
  },
  methods: {
    ...mapMutations(['setIsAdvance']),
    selectItem (id, type) {
      type = parseInt(type)
      switch (type) {
        case targetType.song:// 歌曲
          this.selectSong(id)
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
      // 这里的this是vue对象，提前声明(需要在swiper中应用)
      let _this = this
      // 通过settimeout 解决数据还没有完全加载的时候就已经渲染swiper，导致loop失效。
      setTimeout(() => {
        // eslint-disable-next-line no-unused-vars
        var mySwiper = new Swiper('.sw-banner', {
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          autoplay: {
            disableOnInteraction: false,
            delay: 5000
          },
          loop: true,
          on: {
            touchStart (e) {
              e.stopPropagation()
            },
            touchEnd (e) {
              e.stopPropagation()
            },
            // 解决阻止事件传播点击事件失效
            // 利用自定义属性获取轮播图id和type
            click (e) {
              let target = getParentByClassName(e.target, 'image')
              // 获取id
              let id = getData(target, 'bannerid')
              // 获取type
              let type = getData(target, 'bannertype')
              _this.selectItem(id, type)
            }

          }
        })
      }, 0)
    },
    selectSong (id) {
      this.getSongDetail(id).then(res => {
        // 比较两首歌曲
        let result = this.$utils.compareSong(this.currentSong, { id: res.id })
        if (!result) {
          // 引入vue原型上的utils
          this.$utils.playMusic(res)
        }
      })
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
  margin: 0.2rem 0;
  box-sizing: border-box;
  border-radius: 0.3rem;
  height: 0;
  padding-bottom: 4.2rem;

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