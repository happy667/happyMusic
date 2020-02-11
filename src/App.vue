<template>
  <div id="app">
    <router-view v-transition
                 v-if="isRouterAlive"></router-view>
    <player></player>
  </div>
</template>

<script>
import loginApi from '@/api/login.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  USER_TOKEN
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
    ...mapState(['user', 'token'])
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
  box-shadow: none;
}
</style>
