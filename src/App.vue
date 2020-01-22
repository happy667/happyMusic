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
import { mapGetters } from 'vuex'
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
    ...mapGetters(['currentSong']),
    paddingBottom () {
      return Object.keys(this.currentSong).length === 0 ? '' : { paddingBottom: '1.8rem' }
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
