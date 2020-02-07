<template>
  <div class="my-follow-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar title="我的关注"
                   left-arrow
                   @click-left="routerBack" />
    </van-sticky>
    <div class="singerList"
         v-if="singerSubList&&singerSubList.length!==0">
      <singer-item :singer="item"
                   @select="selectItem(item)"
                   v-for="item in singerSubList"
                   :key="item.id"></singer-item>
    </div>
  </div>
</template>
<script>
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
      singerSubList: null// 歌手列表
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    },
    // 获取用户关注的歌手
    async getSingerSubList () {
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
          singerSubList.push(singer)
        })
        this.singerSubList = singerSubList
        console.log(singerSubList)
      }
    },
    // 选择歌手
    selectItem (item) {
      this.$router.push(`/singerInfo/${item.id}`)
    }
  },
  mounted () {
    // 获取用户关注的歌手
    this.getSingerSubList()
  },
  components: {
    SingerItem
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