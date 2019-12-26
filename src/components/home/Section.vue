<template>
  <!-- 功能区域 -->
  <div class="fun-Container">
    <ul class="fun-list"
        ref="ulObj"
        :style="styleObj">
      <!-- 推荐页 -->
      <li class="fun-list-item">
        <recommend />
      </li>
      <!-- 排行页 -->
      <li class="
          fun-list-item">
        <ranking />
      </li>
      <!-- 歌手页 -->
      <li class="fun-list-item">
        <singer />
      </li>
      <!-- mv页 -->
      <li class="fun-list-item">
        <!-- <search /> -->
      </li>
    </ul>
  </div>
</template>
<script>
import Recommend from './section/Recommend'
import Ranking from './section/Ranking'
import Singer from './section/Singer'
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      moveDiff: 0
    }
  },
  computed: {
    // 接受state中的
    // tabbar列表信息
    // 当前索引
    ...mapState(['currentIndex', 'tabbarList']),
    tranlate3dVal () {
      return -(this.currentIndex * 100 / this.tabbarList.length) - this.moveDiff
    },
    styleObj () {
      return {
        width: `${this.tabbarList.length * 100}% `,
        transform: `translate3d(${this.tranlate3dVal}%, 0, 0)`
      }
    }
  },
  methods: {
    // 接受Mutations中的
    // nextPage()
    // prevPage()
    ...mapMutations(['nextPage', 'prevPage'])
  },
  mounted () {
    // 动态添加transition
    // 因为在css中写transition,在js中获取这个属性是获取不到的
    this.$refs.ulObj.style.transition = 'all 0.5s ease'

    // 判断起始点击位置到最后释放位置
    // 如果小于释放位置，当前索引切换到下一页，否则切换上一页
    let touch = {}
    // 监听手指按下
    this.$el.addEventListener('touchstart', evt => {
      touch.startX = evt.touches[0].clientX// 起始位置
      touch.endX = 0// 结束位置
      touch.diffX = 0// 起始位置与结束位置的差值
      this.moveDiff = 0
    })
    // 监听手指移动
    this.$el.addEventListener('touchmove', evt => {
      // 在手指移动时移除transition,移除过渡效果
      this.$refs.ulObj.style.transition = ''
      touch.endX = evt.touches[0].clientX// 获取结束位置
      touch.diffX = (touch.startX - touch.endX) / 20// 获取起始位置与结束位置的差值
      if (touch.endX < touch.startX) { // 向左滑动
        // 当等于-75时不能向左滑动
        if (this.tranlate3dVal === -75) return
      } else { // 向右滑动
        // 当等于0时不能向右滑动
        if (this.tranlate3dVal === 0) return
      }
      this.moveDiff = touch.diffX
    })
    // 监听手指松开
    this.$el.addEventListener('touchend', () => {
      // 重置手指滑动偏移量
      this.moveDiff = 0
      // 添加transition,使结束后能有过渡效果
      this.$refs.ulObj.style.transition = 'all 0.5s ease'
      // 移动幅度小或者未获取到最后位置就不执行切换页面
      if (!touch.endX || Math.abs(touch.endX - touch.startX) < 50) {
        return
      }
      if (touch.endX < touch.startX) {
        this.nextPage()
      } else {
        this.prevPage()
      }
    })
  },
  components: {
    Recommend,
    Ranking,
    Singer
  }
}
</script>

<style lang="stylus" scoped>
.fun-Container {
  height: 100%;
  overflow: hidden;

  .fun-list, .fun-list-item {
    display: flex;
    height: 100%;
  }

  .fun-list {
    .fun-list-item {
      width: 25%;
    }
  }
}
</style>