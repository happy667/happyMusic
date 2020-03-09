<template>
  <!-- 歌手简介 -->
  <div class="singer-synopsis-container">

    <template v-if="singer">
      <!-- 歌手图片 -->
      <div class="singer-img">
        <img :src="singer.picUrl"
             :key="singer.picUrl">
      </div>
      <div class="singer-synopsis">
        <!-- 歌手名称 -->
        <div class="singer-name">
          {{singer.name}}
        </div>
        <!-- 粉丝数量 -->
        <p class="follows"
           v-if="followeds">{{followeds|convertCount}}粉丝</p>
      </div>
      <!-- 收藏 -->
      <div class="follow">
        <follow @clickFollow="handleClickFollow"
                :followed="singer.followed"></follow>
      </div>
    </template>

  </div>
</template>
<script>
import 'common/js/convert.js'
import userApi from '@/api/user.js'
import {
  ERR_OK
} from '@/api/config.js'
import Follow from '@/components/common/Follow'
import { mapState } from 'vuex'
export default {
  props: {
    singer: Object
  },
  components: {
    Follow
  },
  computed: {
    ...mapState(['user']),
    followeds () {
      return this.singer.followeds ? this.singer.followeds : 0
    }
  },
  methods: {
    // 选中歌曲喜欢
    handleClickFollow () {
      if (this.user) { // 说明已经登录
        this.follow() // 收藏/取消收藏歌手
      } else { // 弹窗提示去登录
        this.utils.alertLogin(this.$router.currentRoute.fullPath)
      }
    },
    // 收藏/取消收藏歌手
    follow () {
      let singer = this.singer
      let follow = !singer.followed
      follow = follow ? 1 : 0// 1代表收藏，0代表不收藏
      if (!follow) {
        this.utils.alertConfirm({ message: '确定不再收藏该歌手', confirmButtonText: '不再收藏' }).then(() => {
          userApi.updateFollow(singer.id, follow).then(res => {
            if (res.data.code === ERR_OK) {
              this.$set(singer, 'followed', false)
              this.$toast('已不再收藏')
            }
          }).catch(err => {
            this.$toast(err.data.message)
          })
        }).catch(() => { })
      } else {
        userApi.updateFollow(singer.id, follow).then(res => {
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

.singer-synopsis-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 7.4rem;
  background: $color-common-b;
  overflow: hidden;

  .singer-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 7.4rem;

    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .singer-synopsis {
    position: absolute;
    padding-left: 0.5rem;
    bottom: 0.5rem;
    color: #fff;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .singer-name {
      font-size: $font-size-small;
      height: 1rem;
      line-height: 1rem;
      max-width: 6rem;
      no-wrap();
    }

    .follows {
      height: 0.7rem;
      line-height: 0.7rem;
      font-size: $font-size-smaller;
      color: #d4d4d4;
    }
  }

  .follow {
    position: absolute;
    right: 0.6rem;
    bottom: 0.6rem;
  }
}
</style>