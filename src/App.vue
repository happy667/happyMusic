<template>
  <div id="app">
    <transition name="fade"
                mode="out-in">
      <keep-alive :exclude="noCacheComponents">
        <router-view v-if="isRouterAlive"
                     :key="$route.fullPath"></router-view>
      </keep-alive>
    </transition>
    <player></player>
  </div>
</template>

<script>
import loginApi from '@/api/login.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  USER_TOKEN,
  NEED_LOGIN_COMPONENTS
} from '@/assets/common/js/config.js'
import {
  getItem,
  clearItem
} from 'common/js/localStorage.js'
import Player from '@/components/common/Player'
import {
  mapActions,
  mapState,
  mapMutations,
  mapGetters
} from 'vuex'
export default {
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      transitionName: '',
      isRouterAlive: true
    }
  },
  computed: {
    ...mapState(['user', 'token', 'noCacheComponents']),
    ...mapGetters(['currentSong'])
  },
  mounted () {
    if (this.token) {
      // 获取用户信息
      this.getLoginUserInfo()
    }
    // 监听Storage变化
    this.listenerStorage()
    // 监听网络连接
    this.listenerNetWork()
    //设置临时用户登录
    this.setTempUser()
  },
  destroyed () {
    this.removeListener()
    this.removeListenerNetWork()
  },
  methods: {
    ...mapMutations(['setToken', 'setLoginUser', 'setUserLikeList']),
    ...mapActions(['getLoginUserInfo', 'getUserLikeList']),
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    listenerStorage () {
      // 监听storage变化
      window.addEventListener('storage', () => {
        let token = getItem(USER_TOKEN)
        if (!token) {
          this.logout()
        }
      })
    },
    // 移除监听storage器
    removeListener () {
      window.removeEventListener('storage')
    },
    // 退出登录
    logout () {
      loginApi.logout().then(res => {
        if (res.data.code === ERR_OK) {
          // 清空用户所有信息
          clearItem(USER_TOKEN)
          this.setLoginUser(null)
          this.setToken(null)
          this.setUserLikeList(null)
          let name = this.$route.name
          // 判断当前路由是否为需要登录，如果是的话就刷新页面,否则跳转到用户首页
          if (NEED_LOGIN_COMPONENTS.includes(this.$route.name)) {
            // 添加不缓存路由
            this.$store.commit('setAddNoCacheComponents', 'user')
            if (name === 'user') {
              this.reload()
            } else {
              this.$router.replace({
                name: 'user'
              })
            }
          }
        }
      })
    },
    listenerNetWork () {
      window.addEventListener('offline', e => {
        this.$toast('网络已断开，请检查网络')
      })
      window.addEventListener('online', e => {
        this.$toast('网络已连接,请刷新页面')
      })
    },
    removeListenerNetWork () {
      window.removeEventListener('offline')
      window.removeEventListener('online')
    },
    setTempUser () {
      this.setLoginUser({
        "userId": 369271922,
        "userType": 0,
        "nickname": "Charming_ku",
        "avatarImgId": 109951168026971154,
        "avatarUrl": "http://p2.music.126.net/mywZrxHzoJfvxfEVsEE6Jg==/109951168026971154.jpg",
        "backgroundImgId": 2002210674180203,
        "backgroundUrl": "http://p1.music.126.net/bmA_ablsXpq3Tk9HlEg9sA==/2002210674180203.jpg",
        "signature": "I love happyMusic",
        "createTime": 1480300929486,
        "userName": "1_********172",
        "accountType": 1,
        "shortUserName": "********172",
        "birthday": 1665676800000,
        "authority": 0,
        "gender": 1,
        "accountStatus": 0,
        "province": 650000,
        "city": 650200,
        "authStatus": 0,
        "description": null,
        "detailDescription": null,
        "defaultAvatar": false,
        "expertTags": null,
        "experts": null,
        "djStatus": 0,
        "locationStatus": 30,
        "vipType": 11,
        "followed": false,
        "mutual": false,
        "authenticated": false,
        "lastLoginTime": 1741966879930,
        "lastLoginIP": "61.242.130.217",
        "remarkName": null,
        "viptypeVersion": 1730276361897,
        "authenticationTypes": 0,
        "avatarDetail": null,
        "anchor": false
      })
    }
  },
  components: {
    Player
  }
}
</script>
<style lang="stylus" scoped>
// 转场动画
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

#app>>>.van-popup .singerList {
  max-height: 6rem;
  padding-top: 0.1rem;
}
</style>