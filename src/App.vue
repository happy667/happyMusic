<template>
  <div id="app"
       :style="paddingBottom">
    <router-view v-transition
                 v-if="isRouterAlive"></router-view>
    <player></player>
  </div>
</template>

<script>
import Player from '@/components/common/Player'
import { mapGetters, mapActions } from 'vuex'
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
  mounted () {
    // 获取登录状态
    this.getLoginUser()
  },
  computed: {
    ...mapGetters(['currentSong']),
    paddingBottom () {
      return Object.keys(this.currentSong).length === 0 ? '' : { paddingBottom: '1.8rem' }
    }
  },
  methods: {
    ...mapActions(['getLoginUser']),
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
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
