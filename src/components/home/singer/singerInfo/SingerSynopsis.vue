<template>
  <!-- 歌手简介 -->
  <div class="singer-synopsis-container">
    <!-- loading -->
    <van-loading v-if="!singer"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <template v-show="singer">
      <!-- 歌手图片 -->
      <div class="singer-img">
        <img :src="singer.picUrl">
      </div>
      <div class="singer-synopsis">
        <!-- 关注 -->
        <div class="left">
          <!-- 歌手名称 -->
          <div class="singer-name">
            {{singer.name}}
          </div>
          <div class="follows"
               v-if="followeds">{{followeds|convertCount}}粉丝</div>

        </div>
        <div class="right">
          <div class="followed">
            <follow @clickFollow="handleClickFollow"
                    :followed="singer.followed"></follow>
          </div>
        </div>
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
export default {
  props: {
    singer: Object
  },
  components: {
    Follow
  },
  computed: {
    followeds () {
      return this.singer.followeds ? this.singer.followeds : 0
    }
  },
  methods: {
    async handleClickFollow () {
      let singer = this.singer
      let follow = !singer.followed
      follow = follow ? 1 : 0// 1代表关注，0代表不关注
      if (!follow) {
        this.utils.alertConfirm({ message: '确定不再关注该用户', confirmButtonText: '不再关注' }).then(async () => {
          const { data: res } = await userApi.updateFollow(singer.id, follow)
          if (res.code === ERR_OK) {
            this.$set(singer, 'followed', false)
            this.$toast('已不再关注')
          }
        })
      } else {
        const { data: res } = await userApi.updateFollow(singer.id, follow)
        if (res.code === ERR_OK) {
          this.$set(singer, 'followed', true)
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-synopsis-container {
  width: 100%;
  position: relative;

  .singer-img {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 7.4rem;
    background: #b0b0b0;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      display: block;
    }
  }

  .singer-synopsis {
    position: absolute;
    width: 100%;
    padding: 0 0.5rem;
    bottom: 0.5rem;
    color: #fff;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;

    .left {
      .singer-name {
        font-size: $font-size-small;
        height: 1rem;
        line-height: 1rem;
      }

      .follows {
        float: left;
        height: 0.7rem;
        line-height: 0.7rem;
        font-size: $font-size-smaller;
        color:#d4d4d4;
      }
    }

    .right {
      display: flex;
      align-items: center;
    }
  }
}
</style>