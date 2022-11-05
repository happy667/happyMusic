<template>
  <div class="my-follow-container">
    <!-- 头部导航栏 -->
    <van-sticky>
      <van-nav-bar :title="$route.meta.title" left-arrow @click-left="routerBack" />
    </van-sticky>
    <section>
      <scroll ref="my_follow_scroll">
        <div class="container" ref="container">
          <!-- loading -->
          <loading :loading="loading" />
          <div class="singerList" v-if="singerSubList&&singerSubList.length!==0">
            <singer-item :singer="item" :showFollow="true" @clickFollow="handleClickFollow" @select="selectItem(item)"
              v-for="item in singerSubList" :key="item.id"></singer-item>
          </div>
          <no-result v-if="singerSubList&&singerSubList.length===0" text="暂无收藏的歌手"></no-result>
        </div>
      </scroll>
    </section>

  </div>
</template>
<script>
  import Scroll from '@/components/common/Scroll'
  import NoResult from '@/components/common/NoResult'
  import SingerItem from '@/components/home/singer/SingerItem'
  import Singer from '@/assets/common/js/singer.js'
  import userApi from '@/api/user.js'
  import {
    ERR_OK
  } from '@/api/config.js'
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import {
    playlistMixin
  } from '@/assets/common/js/mixin.js'
  export default {
    name: 'myFollow',
    data() {
      return {
        singerSubList: null, // 歌手列表
        loading: true
      }
    },
    mixins: [playlistMixin],
    computed: {
      ...mapState(['user'])
    },
    mounted() {
      if (this.user) {
        // 获取用户收藏的歌手
        this.getSingerSubList()
      }
    },
    watch: {
      user() {
        if (this.user) {
          // 获取用户收藏的歌手
          this.getSingerSubList()
        }
      }
    },
    methods: {
      ...mapMutations(['setSingerCurrentIndex']),
      // 返回上一个路由
      routerBack() {
        this.$utils.routerBack()
      },
      // 获取用户收藏的歌手
      async getSingerSubList() {
        const {
          data: res
        } = await userApi.getUserFollowSinger()
        if (res.code === ERR_OK) {
          let singerSubList = []
          res.data.forEach(item => {
            let singer = new Singer({
              id: item.id,
              name: item.name,
              aliaName: item.alias.join(' / '),
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
      selectItem(item) {
        this.setSingerCurrentIndex(0)
        this.$router.push(`/singerInfo/${item.id}`)
      },
      handleClickFollow(singer) {
        let follow = !singer.followed
        follow = follow ? 1 : 0 // 1代表收藏，0代表不收藏

        this.$utils.alertConfirm({
          message: '确定不再收藏该歌手',
          confirmButtonText: '不再收藏'
        }).then(() => {
          userApi.updateFollowSinger(singer.id, follow).then(res => {
            if (res.data.code === ERR_OK) {
              // 移除该歌手
              this.$utils.removeItem(this.singerSubList, singer)
              this.$toast('已不再收藏')
            }
          }).catch(err => {
            this.$toast(err.data.message)
          })
        }).catch(() => { })
      },
      handlePlaylist(playList) {
        // 适配播放器与页面底部距离
        const bottom = playList.length > 0 ? '1.5rem' : ''
        this.$nextTick(() => {
          this.$refs.container.style.paddingBottom = bottom
          this.$refs.my_follow_scroll.refresh()
        })
      }
    },
    components: {
      SingerItem,
      NoResult,
      Scroll
    }
  }
</script>
<style lang="stylus" scoped>
  @import '~common/stylus/variable';

  .my-follow-container>>>.scroll {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .my-follow-container {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: $color-common-background;

    section {
      position: relative;
      flex: 1;
    }
  }
</style>