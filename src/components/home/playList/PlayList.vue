<template>
  <van-popup :show="togglePlayList"
             position="bottom"
             round
             @update:show="handleUpdateShow"
             class="play-list-popup">
    <div class="container"
         @click.stop>
      <p-l-header></p-l-header>
      <p-l-section></p-l-section>
    </div>
  </van-popup>
</template>
<script>
import { mapWritableState } from 'pinia'
import { usePlayerStore } from '@/stores'
import PLHeader from './header/Header'
import PLSection from './section/Section'
export default {
  computed: {
    ...mapWritableState(usePlayerStore, ['togglePlayList']),
  },
  components: {
    PLHeader,
    PLSection
  },
  methods: {
    handleUpdateShow (val) {
      if (!val) {
        this.togglePlayList = false
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.play-list-popup {
  border-radius: 0.5rem 0.5rem 0 0;
}

.container {
  width: 100%;
  background: #fff;
}
</style>