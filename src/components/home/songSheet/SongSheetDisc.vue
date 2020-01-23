<template>
  <div class="song-sheet-desc-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar title="歌单列表"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>

    <!-- 歌单图片 -->
    <div class="songs-img">
      <template v-if="songSheetDisc.picUrl">
        <img :src="songSheetDisc.picUrl">
      </template>

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
        <div class="songs-nt">
          <div class="songs-num">{{songSheetDisc.songs.length}}首</div>
          <div class="songs-time"
               v-if="songSheetDisc.songs.length!==0">{{songSheetDisc.trackUpdateTime|convertTime}}</div>
        </div>

        <!-- 播放按钮 -->
        <div class="playBtn"
             @click="playAll">
          <i class="iconfont icon-bofang"></i>
        </div>
      </div>
      <!-- 歌曲列表 -->
      <songs-list :songsList="songSheetDisc.songs"
                  @select="handleSelect"></songs-list>
      <div class="songs-list-null"
           v-if="songSheetDisc.songs.length===0">暂无相关资源</div>
    </section>

  </div>
</template>
<script>
import 'common/js/convert.js'
import SongsList from '@/components/home/song/SongList'
import { mapGetters, mapActions } from 'vuex'
export default {
  props: {
    id: String
  },
  computed: {
    ...mapGetters(['songSheetDisc'])
  },
  mounted () {
    this.getSongSheetById(this.id)
  },
  methods: {
    ...mapActions(['getSongSheetById', 'getSingerAlbumDetail', 'playMusic', 'setSelectPlay']),
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    },
    // 选择歌曲
    handleSelect (item, index) {
      this.playMusic({
        list: this.songSheetDisc.songs,
        index,
        song: item
      })
    },
    // 播放所有
    playAll () {
      this.setSelectPlay({
        index: 0,
        list: this.songSheetDisc.songs
      })
    }
  },
  components: {
    SongsList
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.song-sheet-desc-container>>>.van-loading {
  /* 减去标题栏、图片高度 */
  height: calc(100vh - (100vw + 1.22667rem));
  background: $color-common-background;
}

.song-sheet-desc-container {
  background: $color-common-background;
  min-height: 100vh;

  .songs-img {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;

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

      .songs-title {
        max-width: 7rem;
        line-height: 0.8rem;
        font-weight: 500;
        font-size: $font-size-small;
        margin-bottom: 0.4rem;
        no-wrap2();
      }

      .songs-nt {
        display: flex;
        justify-content: space-between;
        color: $color-common-b;

        .songs-num {
          font-size: $font-size-smaller;
        }

        .songs-time {
          font-size: $font-size-smaller-x;
        }
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

    .songs-list-null {
      height: 1rem;
      font-size: $font-size-smaller;
      text-align: center;
      color: $color-common-b;
    }
  }
}
</style>