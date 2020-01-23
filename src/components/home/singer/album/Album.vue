<template>
  <div class="album-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar title="专辑详情"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>
    <!-- loading -->
    <van-loading v-if="!albumObj.songs"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <template v-if="albumObj.album">
      <!-- 专辑头部 -->
      <div class="album-header">
        <section class="album-info">
          <div class="top">
            <div class="left-img">
              <div class="album-image">
                <img :src="albumObj.album.picUrl" />
              </div>
              <div class="
                   public-time">{{albumObj.album.publishTime|convertTime}}</div>
            </div>
            <div class="right-info">
              <div class="album-name">{{albumObj.album.name}}</div>
              <div class="album-singer">歌手:
                <a href="#"
                   v-for="item in albumObj.album.artists"
                   :key="item.id">{{item.name}}</a>
              </div>
              <div class="func">
                <div class="func-item">
                  <div class="icon">
                    <i class="iconfont icon-icon-test"></i>
                  </div>
                  收藏
                </div>
                <div class="func-item">
                  <div class="icon">
                    <van-icon name="more-o" />
                  </div>
                  <div class="num">{{albumObj.commentCount}}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <!-- 专辑简介 -->
      <div class="album-desc"
           v-if="albumObj.album.description">
        <section class="content">
          <p>简介:</p>
          <p v-html="albumObj.album.description"></p>
        </section>
      </div>
    </template>
    <section class="play-list"
             v-if="albumObj.songs&&albumObj.songs.length!==0">
      <div class="play">
        <div class="play-icon">
          <van-icon name="play-circle-o" />
        </div>
        <div class="play-all"
             @click="handleSelect(albumObj.songs[0],0)">
          播放全部({{albumObj.songs.length}})
        </div>
      </div>
      <!-- 歌曲列表 -->
      <songs-list :songsList="albumObj.songs"
                  @select="handleSelect"></songs-list>

    </section>
    <div class="play-list-null"
         v-if="albumObj.songs&&albumObj.songs.length===0">暂无相关资源</div>
  </div>

</template>
<script>
import 'common/js/convert.js'
import SongsList from '@/components/home/song/SongList'
import singerApi from '@/api/singer.js'
import Song from '@/assets/common/js/song.js'
import {
  ERR_OK
} from '@/api/config.js'
import { mapActions } from 'vuex'
export default {
  props: {
    id: String
  },
  data () {
    return {
      albumObj: {// 专辑对象
      }
    }
  },
  mounted () {
    // 获取专辑详情
    this.getAlbumInfo(this.id)
  },
  methods: {
    ...mapActions(['setSelectPlay', 'playMusic']),
    routerBack () {
      this.$router.back()
    },
    // 选择歌曲
    handleSelect (item, index) {
      this.playMusic({
        list: this.albumObj.songs,
        index,
        song: item
      })
    },
    // 获取专辑详情
    async getAlbumInfo (id) {
      const { data: res } = await singerApi.getAlbumInfo(id)
      if (res.code === ERR_OK) {
        let songList = []
        res.songs.map((item) => { // 循环数组对象对每个数据进行处理 返回需要得数据
          let singers = item.ar.map(item => item.name).join('/')
          let singersId = item.ar.map(item => item.id).join(',')
          songList.push(new Song({ id: item.id, name: item.name, singers, singersId, picUrl: item.al.picUrl }))
        })
        this.$set(this.albumObj, 'songs', songList)
        this.$set(this.albumObj, 'commentCount', res.album.info.commentCount)
        this.$set(this.albumObj, 'album', res.album)
      }
    }
  },
  components: {
    SongsList
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.album-container {
  background: $color-common-background;
  min-height: 100vh;

  .album-header {
    position: relative;
    height: 0;
    background-image: linear-gradient(160deg, #c4c4c4 60%, #fff 100%);
    padding-bottom: 3.2rem;

    .album-info {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      padding: 0.5rem;

      .top {
        display: flex;

        .left-img {
          position: relative;
          margin-right: 0.5rem;

          .album-image {
            width: 2.3rem;
            height: 2.3rem;
            border-radius: 0.3rem;

            img {
              display: block;
              width: 100%;
              height: 100%;
              border-radius: 0.3rem;
            }
          }

          .public-time {
            position: absolute;
            bottom: 0.2rem;
            right: 0.2rem;
            color: #fff;
            font-size: 0.28rem;
          }
        }

        .right-info {
          width: 100%;
          color: #fff;
          font-size: $font-size-smaller-x;
          no-wrap();

          .album-name {
            padding-top: 0.1rem;
            font-size: $font-size-smaller;
          }

          .album-singer {
            height: 1.1rem;
            line-height: 1.1rem;

            a {
              color: #fff;
            }
          }

          .func {
            display: flex;

            .func-item {
              display: flex;
              align-items: center;
              margin-right: 0.5rem;

              &:last-child {
                margin-right: 0;
              }

              .icon {
                margin-right: 0.05rem;
              }
            }

            .icon, .iconfont {
              font-size: 0.7rem;
            }
          }
        }
      }
    }
  }

  .album-desc {
    padding: 0.3rem 0.4rem;

    .content {
      no-wrap3();
      line-height: 0.5rem;
      color: #777;
      font-size: $font-size-smaller-x;
    }
  }

  .play-list {
    padding-top: 0.3rem;

    .play {
      display: flex;
      padding-left: 0.4rem;

      .play-icon {
        font-size: $font-size-small;
        color: $color-common;
        margin-right: 0.2rem;

        i {
          line-height: 0.8rem;
        }
      }

      .play-all {
        font-size: $font-size-smaller;
        height: 0.8rem;
        line-height: 0.8rem;
      }
    }
  }

  .play-list-null {
    height: 1rem;
    font-size: $font-size-smaller;
    text-align: center;
    color: $color-common-b;
  }
}
</style>