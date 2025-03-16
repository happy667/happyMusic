<template>
  <div class="songs-list-item-containter"
       :class="disableCls?'disable':''">
    <!-- 索引 -->
    <div class="song-index"
         :class="top?'rank':''"
         v-if="showIndex">{{index}}</div>
    <!-- 歌曲图片 -->
    <div class="song-img"
         v-if="showImage">
      <img v-lazy="picUrl"
           class="animated fadeIn"
           :key="picUrl">
    </div>
    <article class="right-info">
      <div class="song-desc">
        <!-- 歌曲名称 -->
        <div class="song-name">{{song.name}}</div>
        <!-- 歌手名称-专辑名称 -->
        <div class="song-detail">
          <div v-if="song.isOriginal"
               class="tag">
            <van-tag size="small"
                     plain
                     color="#FD4979">原唱</van-tag>
          </div>
          <div class="sg-info">{{sgName}}</div>
        </div>

      </div>
      <div class="icon-container"
           v-if="song.st>=0">
        <div v-if="song.mv"
             class="icon video"
             @click.stop="selectItemVideo">
          <van-icon name="tv-o" />
        </div>

        <div v-if="showPlayCount"
             class="play-count icon">
          <div class="icon">
            <van-icon name="play-circle-o" />
          </div>
          <div class="count">{{song.playCount}}次</div>
        </div>
        <div v-else
             class="icon love"
             :class="song.isLike ? 'active' : ''"
             @click.stop="selectItemLove">
          <i class="iconfont"
             :class="loveIcon"></i>
        </div>
      </div>
    </article>

  </div>
</template>

<script>
import userApi from '@/api/user.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  DEFAULT_IMAGE
} from 'common/js/config.js'
import {
  mapState,
  mapGetters
} from 'vuex'
export default {
  props: {
    song: Object,
    index: Number,
    showImage: {
      type: Boolean,
      default: () => false
    },
    top: {
      type: Boolean,
      default: () => false
    },
    // 是否显示索引
    showIndex: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    ...mapState(['user', 'userLikeList']),
    ...mapGetters(['currentSong']),
    loveIcon () {
      return this.song.isLike ? 'icon-aixin' : 'icon-icon-test'
    },
    picUrl () {
      return this.song.picUrl ? this.song.picUrl : DEFAULT_IMAGE
    },
    disableCls () {
      return this.song.st ? this.song.st < 0 : false
    },
    // 歌手名称-专辑名称
    sgName () {
      return this.song.album ? this.song.singers + ' - ' + this.song.album.name : this.song.singers
    }
  },
  watch: {
    userLikeList () {
      if (this.userLikeList) {
        this.updateSong(this.song)
      }
    },
    currentSong () {
      // 同步当前播放歌曲喜欢状态
      this.asyncCurrentLikeStatus()
    }

  },
  inject: {
    showPlayCount: {
      type: Boolean,
      default: () => false
    }
  },

  mounted () {
    if (this.userLikeList) {
      this.updateSong(this.song)
    }
    // 同步当前播放歌曲喜欢状态
    this.asyncCurrentLikeStatus()
  },
  methods: {
    // 选中歌曲喜欢
    selectItemLove () {
      let song = this.song
      if (this.user) { // 说明已经登录
        this.likeMusic(song) // 添加或取消喜欢音乐
      } else { // 弹窗提示去登录
        this.$utils.alertLogin(this.$router.currentRoute.fullPath)
      }
    },
    // 同步当前播放歌曲喜欢状态
    asyncCurrentLikeStatus () {
      if (this.song.id === this.currentSong.id) {
        // 同步喜欢状态
        this.$set(this.song, 'isLike', this.currentSong.isLike)
      }
    },
    // 更新歌曲状态
    updateSong (song) {
      let newItem = this.userLikeList.find(id => id === song.id)
      if (newItem) { // 说明用户已添加该歌曲到喜欢列表中
        // 修改song中的isLike属性
        this.$set(this.song, 'isLike', true)
      }
    },

    likeMusic (song) {
      let like = !song.isLike
      if (like) { // 喜欢
        userApi.likeMusic(song.id, like).then(res => {
          if (res.data.code === ERR_OK) {
            this.$set(this.song, 'isLike', like)
            if (this.song.id === this.currentSong.id) {
              // 同步喜欢状态
              this.$set(this.currentSong, 'isLike', like)
            }
          }
        }).catch(err => {
          this.$toast(err.data.message)
        })
      } else {
        this.$utils.alertConfirm({
          message: '确定要取消喜欢该歌曲吗',
          confirmButtonText: '取消'
        }).then(async () => {
          userApi.likeMusic(song.id, like).then(res => {
            if (res.data.code === ERR_OK) {
              this.$set(this.song, 'isLike', like)
              this.$emit('noLike', this.song) // 派发取消喜欢事件
              if (this.song.id === this.currentSong.id) {
                // 同步喜欢状态
                this.$set(this.currentSong, 'isLike', like)
              }
            }
          }).catch(err => {
            this.$toast(err.data.message)
          })
        }).catch(() => { })
      }
    },
    // 选择歌曲视频
    selectItemVideo () {
      this.$router.push(`/videoInfo/${this.song.mv}`)
    }

  }
}
</script>
<style lang="stylus">
@import '~common/stylus/variable';

.songs-list-item-containter {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.2rem 0.2rem 0.4rem 0.4rem;

  &.disable {
    color: $color-common-b2;
    opacity: 0.5;
  }

  .song-index {
    margin-right: 0.4rem;
    height: 1.4rem;
    line-height: 1.4rem;
    font-size: $font-size-small;
    color: $color-common-b2;
    text-align: center;

    &.rank {
      color: $color-common;
    }
  }

  .song-img {
    width: 1rem;
    height: 1rem;
    margin: 0.15rem 0.4rem 0.15rem 0;
    background-color: $color-common-b;
    border-radius: 50%;
    flex: none;

    img {
      text-align: center;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .right-info {
    flex: 1;
    width: 1%;
    height: 100%;
    display: flex;
    justify-content: space-between;

    .song-desc {
      flex: 1;
      width: 1%;

      .icon {
        margin-right: 0.2rem;
      }

      .song-name {
        line-height: 0.6rem;
        font-size: $font-size-smaller-x;
        no-wrap();
      }

      .song-detail {
        display: flex;

        .tag {
          display: flex;
          align-items: center;
          flex-direction: row;
          margin-right: 0.1rem;

          span {
            white-space: nowrap;
            font-size: 0.24rem;
          }
        }

        .sg-info {
          line-height: 0.5rem;
          font-size: $font-size-mini;
          color: $color-common-b2;
          no-wrap();
        }
      }
    }

    .icon-container {
      display: flex;
      align-items: center;

      .icon {
        width: 1rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $color-common-b2;

        &.active {
          color: $color-common;
        }

        i {
          font-size: $font-size-small;
        }
      }

      .play-count {
        margin-right: 0.2rem;
        width: auto;
        font-size: $font-size-smaller;

        .icon {
          width: auto;
          margin-right: 0.1rem;
        }

        i {
          font-size: $font-size-smaller-x;
        }

        .count {
          font-size: $font-size-smaller-x;
        }
      }
    }
  }
}
</style>