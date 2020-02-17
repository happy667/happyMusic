<template>
  <div id="app">
    <keep-alive :exclude="noCacheComponents">
      <router-view v-if="isRouterAlive"
                   :key="$route.fullPath"></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import loginApi from '@/api/login.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  USER_TOKEN, needLoginComponents
} from '@/assets/common/js/config.js'
import {
  getItem, clearItem
} from 'common/js/localStorage.js'
import Player from '@/components/common/Player'
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  computed: {
    ...mapState(['user', 'token', 'noCacheComponents'])
  },
  mounted () {
    if (this.token) {
      // 获取用户信息
      this.getLoginUserInfo()
    }

    // 监听Storage变化
    this.listenerStorage()
  },
  destroyed () {
    this.removeListener()
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
          if (needLoginComponents.includes(this.$route.name)) {
            // 添加不缓存路由
            this.$store.commit('setAddNoCacheComponents', 'user')
            if (name === 'user') {
              this.reload()
            } else {
              this.$router.replace({ name: 'user' })
            }
          }
        }
      })
    }
  },
  components: {
    Player
  }
}
</script>
<style lang="stylus" scoped>
#app {
  width: 100%;
  box-shadow: none;
}
</style>
