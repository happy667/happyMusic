<template>
  <!-- 歌手简介 -->
  <div class="singer-synopsis-container">

    <template v-if="singer">
      <!-- 歌手图片 -->
      <div class="singer-img"
           @click="handleClick">
        <div id="image"
             class="animated fadeIn">
          <van-image :src="singer.picUrl"
                     fit="cover">
            <template v-slot:loading>
              <van-loading type="spinner"
                           size="20" />
            </template>
          </van-image>
        </div>

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
  name: 'singerSynopsis',
  props: {
    singer: Object
  },
  components: {
    Follow
  },
  computed: {
    ...mapState(['user', 'currentPlayIndex']),
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
        this.$utils.alertLogin(this.$router.currentRoute.fullPath)
      }
    },
    // 收藏/取消收藏歌手
    follow () {
      let singer = this.singer
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
            this.$toast('收藏成功')
          }
        }).catch(err => {
          this.$toast(err.data.message)
        })
      }
    },
    handleClick () {
      this.$emit('toggle')
    }

  }

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-synopsis-container>>>.singer-img>#image>.van-image {
  width: 100%;
  height: 100%;
}

.singer-synopsis-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 7.4rem;
  overflow: hidden;

  .singer-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 7.4rem;

    #image {
      width: 100%;
      height: 100%;
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

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
}
</style>