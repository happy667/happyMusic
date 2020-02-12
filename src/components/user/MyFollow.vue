<template>
  <div class="my-follow-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar title="我的收藏"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>
    <!-- loading -->
    <van-loading v-if="loading"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <div class="singerList"
         v-if="singerSubList&&singerSubList.length!==0">
      <singer-item :singer="item"
                   :showFollow="true"
                   @clickFollow="handleClickFollow"
                   @select="selectItem(item)"
                   v-for="item in singerSubList"
                   :key="item.id"></singer-item>
    </div>
    <no-result v-if="singerSubList&&singerSubList.length===0"
               text="还没有收藏的歌手"></no-result>
  </div>
</template>
<script>
import NoResult from '@/components/common/NoResult'
import SingerItem from '@/components/home/singer/SingerItem'
import Singer from '@/assets/common/js/singer.js'
import userApi from '@/api/user.js'
import {
  ERR_OK
} from '@/api/config.js'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      singerSubList: null, // 歌手列表
      loading: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted () {
    if (this.user) {
      // 获取用户收藏的歌手
      this.getSingerSubList()
    }
  },
  watch: {
    user () {
      if (this.user) {
        // 获取用户收藏的歌手
        this.getSingerSubList()
      }
    }
  },
  methods: {
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    },
    // 获取用户收藏的歌手
    async getSingerSubList () {
      this.loading = true
      const {
        data: res
      } = await userApi.getUserFollowSinger()
      if (res.code === ERR_OK) {
        let singerSubList = []
        res.data.forEach(item => {
          let singer = new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            picUrl: item.picUrl
          })
          singer.followed = true
          singerSubList.push(singer)
        })
        this.singerSubList = singerSubList
        this.loading = false
      }
    },
    // 选择歌手
    selectItem (item) {
      this.$router.push(`/singerInfo/${item.id}`)
    },
    handleClickFollow (singer) {
      let follow = !singer.followed
      follow = follow ? 1 : 0// 1代表收藏，0代表不收藏

      this.utils.alertConfirm({ message: '确定不再收藏该歌手', confirmButtonText: '不再收藏' }).then(() => {
        userApi.updateFollow(singer.id, follow).then(res => {
          if (res.data.code === ERR_OK) {
            // 移除该歌手
            this.utils.removeItem(this.singerSubList, singer)
            this.$toast('已不再收藏')
          }
        }).catch(err => {
          this.$toast(err.data.message)
        })
      }).catch(() => { })
    }
  },
  components: {
    SingerItem,
    NoResult
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.my-follow-container {
  width: 100%;
  min-height: 100vh;
  background-color: $color-common-background;
}
</style>