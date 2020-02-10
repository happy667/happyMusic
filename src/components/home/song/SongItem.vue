<template>
  <div class="songs-list-item-containter">
    <!-- 索引 -->
    <div class="song-index"
         :class="top?'rank':''"
         v-if="index">{{index}}</div>
    <!-- 歌曲图片 -->
    <div class="song-img"
         v-if="showImage">
      <img v-lazy="song.picUrl"
           :key="song.picUrl" />
    </div>
    <div class="song-desc">
      <!-- 歌曲名称 -->
      <div class="song-name">{{song.name}}</div>
      <!-- 歌手名称-专辑名称 -->
      <div class="sg-info">{{song.singers}}</div>
    </div>

    <div v-if="showPlayCount"
         class="play-count">
      <div class="icon">
        <van-icon name="play-circle-o" />
      </div>
      <div class="count">{{song.playCount}}</div>
    </div>
    <div v-else
         class="love"
         @click.stop="selectItemLove">
      <i class="iconfont"
         :class="loveIcon"></i>
    </div>
  </div>
</template>

<script>
import userApi from '@/api/user.js'
import {
  ERR_OK
} from '@/api/config.js'
import { mapState, mapGetters } from 'vuex'
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
    }
  },
  computed: {
    ...mapState(['user', 'userLikeList']),
    ...mapGetters(['currentSong']),
    loveIcon () {
      return this.song.isLike ? 'icon-aixin' : 'icon-icon-test'
    }
  },
  watch: {
    userLikeList () {
      this.updateSong(this.song)
    },
    currentSong () {
      if (this.song.id === this.currentSong.id) {
        // 同步喜欢状态
        this.$set(this.song, 'isLike', this.currentSong.isLike)
      }
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
  },
  methods: {
    // 选中歌曲喜欢
    selectItemLove () {
      let song = this.song
      if (this.user) { // 说明已经登录
        this.likeMusic(song)// 添加或取消喜欢音乐
      } else { // 弹窗提示去登录
        this.utils.alertLogin(this.$router.currentRoute.fullPath)
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
          }
        }).catch(err => {
          this.$toast(err.data.message)
        })
      } else {
        this.utils.alertConfirm({ message: '确定要取消喜欢该歌曲吗', confirmButtonText: '取消' }).then(async () => {
          userApi.likeMusic(song.id, like).then(res => {
            if (res.data.code === ERR_OK) {
              this.$set(this.song, 'isLike', like)
              this.$emit('noLike', this.song)// 派发取消喜欢事件
            }
          }).catch(err => {
            this.$toast(err.data.message)
          })
        }).catch(() => { })
      }
    }

  }
}
</script>
<style lang="stylus">
@import '~common/stylus/variable';

.songs-list-item-containter {
  position: relative;
  display: flex;
  padding: 0.2rem 0;

  .song-index {
    width: 1.3rem;
    height: 1.4rem;
    line-height: 1.4rem;
    font-size: $font-size-small;
    color: $color-common-b;
    text-align: center;

    &.rank {
      color: $color-common;
    }
  }

  .song-img {
    width: 1.2rem;
    height: 1.2rem;
    margin: 0.1rem;
    margin-right: 0.4rem;

    img {
      text-align: center;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .song-desc {
    font-size: $font-size-smaller;
    line-height: 0.7rem;

    .song-name {
      max-width: 5rem;
      font-weight: 500;
      no-wrap();
    }

    .sg-info {
      max-width: 4.5rem;
      color: #777;
      no-wrap();
    }
  }

  .love, .play-count {
    position: absolute;
    top: 50%;
    right: 0.6rem;
    width: 1rem;
    height: 1rem;
    margin-top: -0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 0.55rem;
    }
  }

  .love {
    i {
      color: $color-common;
    }
  }

  .play-count {
    color: $color-common-b;

    i {
      margin-right: 0.1rem;
    }
  }
}
</style>