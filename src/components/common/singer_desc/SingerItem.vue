<template>
  <div class="singer-list-item-container"
       @click.stop="selectItem(_singer)">
    <div class="singer-list-item">
      <div class="left">
        <!-- 歌手头像 -->
        <div class="singer-avatar">
          <my-image :src="avatar"
                    :size="imageSize"></my-image>
        </div>
        <!-- 歌手信息 -->
        <article class="singer-info">
          <div class="name">{{singerName}}</div>
          <div class="info">
            <span v-if="_singer.songSize"
                  class="songSize">单曲:{{_singer.songSize}}</span>
            <span v-if="_singer.albumSize"
                  class="albumSize">专辑:{{_singer.albumSize}}</span>
            <span v-if="_singer.mvSize"
                  class="mvSize">视频:{{_singer.mvSize}}</span>
          </div>
        </article>

      </div>

      <div class="right"
           v-if="showFollow">
        <!-- 收藏 -->
        <follow @clickFollow="handleClickFollow"
                plain
                :followed="_singer.followed"></follow>
      </div>
    </div>
  </div>

</template>
<script>
import MyImage from '@/components/common/img/Image'
import Follow from '@/components/common/Follow'
import userApi from '@/api/user.js'
import { ERR_OK } from '@/api/config.js'
import {
  DEFAULT_SINGER_IMAGE
} from '@/assets/common/js/config.js'
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    singer: Object,
    showFollow: {
      type: Boolean,
      default: () => true
    },
    imageSize: {
      type: String,
      default: () => 'big'
    }
  },
  computed: {
    ...mapState(['user']),
    _singer () {
      return this.singer
    },
    singerName () {
      let aliaName = ''
      if (this._singer.aliaName) {
        aliaName = ' (' + this._singer.aliaName + ')'
      }
      return this._singer.name + aliaName
    },
    avatar () {
      return this._singer.avatar ? this._singer.avatar : DEFAULT_SINGER_IMAGE
    }
  },
  components: {
    MyImage,
    Follow
  },
  methods: {
    ...mapMutations(['setSingerCurrentIndex']),
    // 选择歌手
    selectItem (item) {
      this.$emit('select', item)
    },
    // 点击收藏
    handleClickFollow () {
      if (this.user) { // 说明已经登录
        this.follow() // 收藏/取消收藏歌手
      } else { // 弹窗提示去登录
        this.$utils.alertLogin(this.$router.currentRoute.fullPath)
      }
    },
    // 收藏/取消收藏歌手
    follow () {
      let singer = this._singer
      let follow = !singer.followed
      follow = follow ? 1 : 0// 1代表收藏，0代表不收藏
      if (!follow) {
        this.$utils.alertConfirm({ message: '确定不再收藏该歌手', confirmButtonText: '不再收藏' }).then(() => {
          userApi.updateFollowSinger(singer.id, follow).then(res => {
            if (res.data.code === ERR_OK) {
              this.$set(singer, 'followed', false)
              this.$toast('已不再收藏')
            }
          }).catch(err => {
            this.$toast(err.data.message)
          })
        }).catch(() => { })
      } else {
        userApi.updateFollowSinger(singer.id, follow).then(res => {
          if (res.data.code === ERR_OK) {
            this.$set(singer, 'followed', true)
          }
        }).catch(err => {
          this.$toast(err.data.message)
        })
      }
    }
  }

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-list-item-container>>>.follow-container {
  font-size: $font-size-mini-x;
}

.singer-list-item-container {
  padding: 0.25rem 0.4rem;

  .singer-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .left {
      display: flex;
      flex: 1;
      align-items: center;
      overflow: hidden;

      .singer-avatar {
      }

      .singer-info {
        margin: 0 0.3rem 0 0.4rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;

        .name {
          height: 0.7rem;
          line-height: 0.7rem;
          font-size: $font-size-smaller;
          no-wrap();
        }

        .info {
          color: #777;

          span {
            display: inline-block;
            margin-right: 0.2rem;
            height: 0.6rem;
            line-height: 0.6rem;

            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
}
</style>