<template>
  <div class="song-sheet-info-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar title="歌单列表"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>

    <!-- 歌单图片 -->
    <div class="songs-img">
      <img :src="songSheetDisc.picUrl">
    </div>
    <!-- loading -->
    <van-loading v-show="!songSheetDisc.songs"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <!-- 歌单描述 -->
    <section v-if="songSheetDisc.songs">
      <div class="songs-desc">
        <div class="songs-title">{{songSheetDisc.name}}</div>
        <div class="songs-num">{{songSheetDisc.songs.length}}首</div>
        <!-- 播放按钮 -->
        <div class="playBtn">
          <i class="iconfont icon-bofang"></i>
        </div>
      </div>
      <!-- 歌曲列表 -->
      <songs-list :songsList="songSheetDisc.songs"></songs-list>
    </section>

  </div>
</template>
<script>
import SongsList from '@/components/home/song/SongList'
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    id: String
  },
  computed: {
    ...mapGetters(['songSheetDisc'])
  },
  methods: {
    ...mapActions(['getSongSheetById', 'getSingerAlbumDetail']),
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    }
  },
  components: {
    SongsList
  },
  beforeRouteEnter: (to, from, next) => {
    if (from.path === '/singerInfo') { // 说明从歌手页面传来
      next(vm => {
        vm.getSingerAlbumDetail(vm.id)
      })
    } else {
      next(vm => {
        vm.getSongSheetById(vm.id)
      })
    }
  },
  mounted () {
    // 根据id获取歌单列表
    // Router.beforeEach((to, from, next) => {
    //   console.log(from)
    // })
    // this.getSongSheetById(this.id)
    // console.log(this.id)
    //  this.getSingerAlbumDetail(this.id)
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.song-sheet-info-container>>>.van-loading {
  /* 减去标题栏、图片高度、播放区域高度 */
  height: calc(100vh - (100vw + 1.22667rem + 1.8rem));
  background: #fff;
}

.song-sheet-info-container {
  background: $color-common-background;
  padding-bottom: 1.8rem;

  .songs-img {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
    background: $color-common-b;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  section {
    .songs-desc {
      padding: 0.4rem;
      position: relative;
      background: $color-common-background;

      .songs-title {
        max-width: 7rem;
        line-height: 0.8rem;
        font-weight: 500;
        font-size: $font-size-large;
        margin-bottom: 0.4rem;
        no-wrap2();
      }

      .songs-num {
        font-size: $font-size-smaller;
        color: #777;
      }

      .playBtn {
        position: absolute;
        right: 0.6rem;
        top: 0;
        margin-top: -0.8rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: red;
        background: linear-gradient(to bottom right, #f48faa, #f57f9e);
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        box-shadow: 0 0.01rem 0.3rem #f48faa;

        i {
          color: #fff;
          font-size: 0.8rem;
        }
      }
    }
  }
}
</style>