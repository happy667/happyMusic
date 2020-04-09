<template>
  <div class="home-container">
    <home-header></home-header>
    <!-- 头部导航栏 -->
    <home-section></home-section>
  </div>
</template>
<script>
import HomeHeader from '@/components/home/Header'
import HomeSection from '@/components/home/Section'
import { mapState } from 'vuex'
export default {
  name: 'home',
  computed: {
    ...mapState(['oldVideo'])
  },
  beforeRouteLeave (to, from, next) {
    console.log(1111)
    if (this.oldVideo.$data && this.oldVideo.$data.isPlay) {
      this.oldVideo.pauseCurrentVideo()
    }
    next()
  },
  components: {
    HomeHeader,
    HomeSection
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.home-container>>>.header-navBar-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.home-container>>> .scroll {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.home-container>>>.van-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.home-container>>>.van-tabs__content {
  position: relative;
  flex: 1;
}

.home-container>>>.van-tabs__content .van-tabs__track, .home-container>>>.van-tabs__content .van-tab__pane {
  position: absolute;
  top: 0;
  bottom: 0;
}

.home-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-flow: column;
  background-color: $color-common-background;
}
</style>