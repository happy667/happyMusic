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
      <img :src="songSheetDisc.coverImgUrl">
    </div>
    <!-- loading -->
    <van-loading v-show="songSheetDisc.tracks==undefined"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <!-- 歌单描述 -->
    <section v-if="songSheetDisc.tracks!=undefined">
      <div class="songs-desc">
        <div class="songs-title">{{songSheetDisc.name}}</div>
        <div class="songs-num">{{songSheetDisc.tracks.length}}首</div>
        <!-- 播放按钮 -->
        <div class="playBtn">
          <i class="iconfont icon-bofang"></i>
        </div>
      </div>
      <!-- 歌曲列表 -->
      <songs-list :songsList="songSheetDisc.tracks"></songs-list>
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
  data () {
    return {
      playlist: []// 歌单列表
    }
  },
  computed: {
    ...mapGetters(['songSheetDisc'])
  },
  methods: {
    ...mapActions(['getSongSheetById']),
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    }
  },
  components: {
    SongsList
  },
  mounted () {
    // 根据id获取歌单列表
    this.getSongSheetById(this.id)
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.song-sheet-info-container {
  background: $color-common-background;
  padding-bottom: 0.2rem;

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
    padding: 0 0.4rem;

    .songs-desc {
      padding: 0.4rem 0;
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