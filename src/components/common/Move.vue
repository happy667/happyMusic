<template>
  <transition :name="transitionName"
              mode="out-in">
    <keep-alive>
      <slot></slot>
    </keep-alive>
  </transition>

</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    // 获取当前点击的索引
    clickIndex: Number
  },
  data () {
    return {
      transitionName: 'transitionLeft'
    }
  },
  computed: {
    ...mapState(['currentIndex'])
  },
  watch: {
    // 监听索引变化
    currentIndex () {
      const compare = this.currentIndex > this.clickIndex
      this.transitionName = compare ? 'transitionLeft' : 'transitionRight'
    }
  }
}
</script>
<style lang="stylus" scoped>
.transitionBody {
  position: absolute;
  left: 0;
  top: 10%;
  width: 100%;
  height: 100%;
  transition: all 1s ease; /* 定义动画的时间和过渡效果 */
}

.transitionLeft-enter, .transitionRight-leave-active {
  transform: translate3d(0%, 0, 0);
  /* 当左滑进入右滑进入过渡动画 */
}

.transitionLeft-leave-active, .transitionRight-enter {
  transform: translate3d(-100%, 0, 0);
}
</style>