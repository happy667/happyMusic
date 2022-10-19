<template>
  <div class="recommend-swiper-container">
    <div class="swiper-container sw-banner">
      <div class="swiper-wrapper">
        <div class="swiper-slide" @click.stop="selectItem(item)" v-for="(item,index) in banners" :key="index">
          <div class="image">
            <img :src="item.imageUrl" class="animated fadeIn">
            <div class="title">{{item.typeTitle}}</div>
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
  import Album from '@/assets/common/js/album.js'
  import Singer from '@/assets/common/js/singer.js'
  import songApi from '@/api/song.js'
  import {
    ERR_OK
  } from '@/api/config.js'
  import {
    TARGET_TYPE
  } from '@/assets/common/js/config.js'
  import {
    mapGetters
  } from 'vuex'
  export default {
    props: {
      // 轮播图数据
      banners: {
        type: Array
      }
    },
    mounted() {
      this.initSwiper()
    },
    computed: {
      ...mapGetters(['currentSong'])
    },
    methods: {
      selectItem(item) {
        let id = item.targetId
        let type = parseInt(item.targetType)
        switch (type) {
          case TARGET_TYPE.song: // 歌曲
            this.selectSong(id)
            break
          case TARGET_TYPE.video: // 视频
            this.$router.push(`/videoInfo/${id}`)
            break
          case TARGET_TYPE.album: // 专辑
            this.$router.push(`/singerAlbum/${id}`)
            break
          case TARGET_TYPE.songSheet: // 歌单
            this.$router.push(`/songSheetDisc/${id}`)
            break
        }
      },
      async getSongDetail(id) {
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
          let song = new Song({
            id: item.id,
            name: item.alia.length > 0 ? `${item.name} (${item.alia.join('/')})` : item.name,
            singers,
            singersList,
            picUrl: item.al.picUrl,
            st: item.st,
            mv: item.mv,
            album: new Album({
              id: item.al.id,
              name: item.al.name,
              picUrl: item.al.picUrl
            })
          })
          return Promise.resolve(song)
        }
      },
      // 初始化轮播图组件
      initSwiper() {
        // 通过settimeout 解决数据还没有完全加载的时候就已经渲染swiper，导致loop失效。
        setTimeout(() => {
          // eslint-disable-next-line no-unused-vars
          var mySwiper = new Swiper('.sw-banner', {
            pagination: {
              el: '.swiper-pagination',
              clickable: true
            },
            observer: true, // 修改swiper自己或子元素时，自动初始化swiper
            observeParents: true, // 修改swiper的父元素时，自动初始化swiper
            autoplay: {
              disableOnInteraction: false,
              delay: 5000
            },
            loop: true,
            // 使用图片懒加载
            lazy: {
              loadPrevNext: true,
              loadOnTransitionStart: true,
              loadPrevNextAmount: 1
            },
            on: {
              sliderMove(e) {
                e.stopPropagation()
              }

            }
          })
        }, 0)
      },
      selectSong(id) {
        this.getSongDetail(id).then(res => {
          // 比较两首歌曲
          let result = this.$utils.compareSong(this.currentSong, {
            id: res.id
          })
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
            background-color: $color-common-b;
            border-radius: 0.2rem;

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
              background: $color-common;
              border-radius: 0.2rem 0 0.2rem 0;
            }
          }
        }
      }
    }
  }

  .my-bullet-active {
    background: $color-common;
    opacity: 1;
  }
</style>