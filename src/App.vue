<template>
  <div id="app">
    <keep-alive>
      <router-view v-transition
                   v-if="isRouterAlive"></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import Player from '@/components/common/Player'
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
  methods: {
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
