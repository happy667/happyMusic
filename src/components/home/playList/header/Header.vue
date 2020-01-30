<template>
  <header class="header">
    <!-- 左侧播放类型 -->
    <div class="left">
      <div class="play-type icon">
        <i class="iconfont icon-xunhuanbofang"></i>
      </div>
      <div class="type-name">随机播放</div>
      <div class="list-num">({{playList.length}}首)</div>
    </div>
    <div class="right"
         @click="clearPlayList">
      <div class="play-type icon">
        <i class="iconfont icon-shanchu"></i>
      </div>
    </div>
  </header>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState(['playList'])
  },
  methods: {
    ...mapMutations(['setPlayList']),
    clearPlayList () {
      this.$Dialog.confirm({
        message: '确定要清空播放列表?',
        confirmButtonColor: '#FD4979',
        width: '265px'
      }).then(() => {
        this.setPlayList([])
      }).catch(() => {

      })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.header {
  width: 100%;
  padding: 0 0.4rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  font-size: $font-size-smaller;
  border-bottom: 0.02rem solid #efefef;

  i {
    font-size: $font-size-small;
  }

  .left {
    height: 1.2rem;
    line-height: 1.2rem;
    display: flex;

    .icon {
      margin-right: 0.3rem;
    }
  }

  .right {
    height: 1.2rem;
    line-height: 1.2rem;
  }
}
</style>