<template>
  <div id="app"
       :style="paddingCls">
    <transition :name="transitionName">
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
  USER_TOKEN, needLoginComponents
} from '@/assets/common/js/config.js'
import {
  getItem, clearItem
} from 'common/js/localStorage.js'
import Player from '@/components/common/Player'
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
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
    ...mapState(['user', 'token', 'noCacheComponents', 'isAdvance']),
    ...mapGetters(['currentSong']),
    paddingCls () {
      return {
        paddingBottom: Object.keys(this.currentSong).length === 0 ? '' : '1.5rem'
      }
    }
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
  watch: {// 使用watch 监听$router的变化
    $route (to, from) {
      // 如果from不是登录首页并且to不是登录首页并且from和to不包含appIndex(登录注册部分不用动画)就显示动画
      if (from.name !== 'index' && to.name !== 'index' && from.path.includes('appIndex') && to.path.includes('appIndex')) {
        this.transitionName = ''
        return
      }
      if (this.isAdvance) {
        // 设置动画名称
        this.transitionName = 'slide-left'
        // 如果to索引大于from索引,判断为前进状态,并且from.name不是登录页面，反之则为后退状态
      } else if (to.meta.index > from.meta.index && from.name !== 'login') {
        // 设置动画名称
        this.transitionName = 'slide-left'
      } else {
        this.transitionName = 'slide-right'
      }
      // 重置isAdvance
      this.setIsAdvance(false)
    }
  },
  methods: {
    ...mapMutations(['setToken', 'setLoginUser', 'setUserLikeList', 'setIsAdvance']),
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
  position: absolute;
  width: 100%;
  box-shadow: none;
}

// 转场动画
.slide-right-enter-active, .slide-right-leave-active, .slide-left-enter-active, .slide-left-leave-active {
  will-change: all;
  transition: all 300ms;
  position: absolute;
  background-attachment: fixed;
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
  transition-timing-function: ease-in;
}

.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
  transition-timing-function: cubic-bezier(0.5, 0, 1, 1);
}

.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
  transition-timing-function: ease-in;
}

.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
  transition-timing-function: cubic-bezier(0.5, 0, 1, 1);
}
</style>
