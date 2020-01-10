<template>
  <div class="letter-list-container"
       ref="letterList"
       @touchstart.stop.prevent="handleTouchStart"
       @touchmove.stop.prevent="handleTouchMove"
       @touchend.stop>
    <!-- 右侧字母表 -->
    <ul class="letter-list">
      <li class="letter-list-item"
          :class="scrollIndex===index?'active':''"
          :data-index="index"
          v-for="(item,index) in letterList"
          :key="index">{{item}}</li>
    </ul>
  </div>
</template>
<script>
import { getData } from '@/assets/common/js/dom.js'
import { mapMutations, mapState } from 'vuex'
export default {
  props: {
    letterList: {
      type: Array,
      default: () => []
    }

  },
  created () {
    // 没有放在data中是因为这个属性不需要监听，data中的属性会监听
    this.touch = {}
  },
  computed: {
    ...mapState(['scrollIndex'])
  },
  watch: {
    letterList () {
      if (this.letterList.length !== 0) {
        this.$nextTick(() => {
          // 获取字母表高度
          const height = this.$refs.letterList.clientHeight
          // 获取一个字母的高度
          const letterHeight = height / this.letterList.length
          this.letterHeight = letterHeight
        })
      }
    }
  },
  methods: {
    ...mapMutations(['setScrollIndex', 'setStop']),
    // 触摸开始
    handleTouchStart (e) {
      // 停止滚动
      this.setStop(true)
      let index = getData(e.target, 'index')
      // 获取当前触摸开始的距离
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.index = index
      // 设置当前滑动的索引
      this.setScrollIndex(index)
    },
    // 触摸移动
    handleTouchMove (e) {
      this.setStop(false)
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / this.letterHeight | 0
      if (delta <= 0) delta = 0
      // 加上上一次的滑动时的索引
      // 因为this.touch.index获取的索引 类型为string,所以需要转成数字类型再相加
      let anchorIndex = parseInt(this.touch.index) + delta
      // 设置当前滑动的索引
      this.setScrollIndex(anchorIndex)
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.letter-list-container {
  position: absolute;
  right: 0.1rem;
  top: 1rem;
  z-index: 99;

  .letter-list {
    .letter-list-item {
      width: 0.65rem;
      text-align: center;
      height: 0.44rem;
      line-height: 0.44rem;
    }

    .active {
      color: $color-common;
      font-weight: 600;
    }
  }
}
</style>
