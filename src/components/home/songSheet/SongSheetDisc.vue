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
                  :showImage="true"
                  @select="handleSelect"></songs-list>
      <no-result v-if="songSheetDisc.songs.length===0"
                 text="暂无相关资源"></no-result>
    </section>

  </div>
</template>
<script>
import 'common/js/convert.js'
import 'common/js/utils.js'
import recommendApi from '@/api/recommend.js'
import {
  ERR_OK
} from '@/api/config.js'
import Song from '@/assets/common/js/song.js'
import SongsList from '@/components/home/song/SongList'
import SongSheetDetail from '@/assets/common/js/songSheetDetail.js'
import NoResult from '@/components/common/NoResult'
import { mapMutations, mapGetters, mapActions } from 'vuex'
export default {
  props: {
    id: String
  },
  data () {
    return {
      songSheetDisc: {}
    }
  },
  mounted () {
    this.getSongSheetById(this.id)
  },
  computed: {
    ...mapGetters(['currentSong'])
  },
  methods: {
    ...mapMutations(['setPlayerFullScreen']),
    ...mapActions(['setSelectPlay']),
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    },
    // 根据id获取歌单列表
    async getSongSheetById (id) {
      const {
        data: res
      } = await recommendApi.getSongSheetById(id)
      if (res.code === ERR_OK) {
        let songList = []
        res.playlist.tracks.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
          let singerName = item.ar.map(item => item.name).join('/')
          let singersId = item.ar.map(item => item.id).join(',')
          songList.push(new Song({
            id: item.id,
            name: item.name,
            singers: singerName,
            singersId,
            picUrl: item.al.picUrl
          }))
        })
        this.songSheetDisc = new SongSheetDetail({
          id: res.playlist.id,
          picUrl: res.playlist.coverImgUrl || res.playlist.backgroundCoverUrl,
          songs: songList,
          name: res.playlist.name,
          trackUpdateTime: res.playlist.trackUpdateTime
        })
      }
    },
    // 选择歌曲
    handleSelect (item, index) {
      // 判断点击的是否是当前播放的歌曲
      if (this.currentSong.id === item.id) {
        this.setPlayerFullScreen(true)
        return
      }
      // 引入vue原型上的utils
      this.utils.playMusic(item, this.songSheetDisc.songs, index)
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
    SongsList,
    NoResult
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
    background: #e4e4e4;

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
  }
}
</style>