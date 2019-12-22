<template>
  <!-- 功能区域 -->
  <div class="fun-Container">
    <ul class="fun-list"
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
      <!-- 搜索页 -->
      <li class="fun-list-item">
        <search />
      </li>
    </ul>
  </div>
</template>
<script>
import Recommend from './section/Recommend'
import Ranking from './section/Ranking'
import Singer from './section/Singer'
import Search from './section/Search'
import { mapState, mapMutations } from 'vuex'
export default {
  components: {
    Recommend,
    Ranking,
    Singer,
    Search
  },
  computed: {
    // 接受state中的
    // tabbar列表信息
    // 当前索引
    ...mapState(['currentIndex', 'tabbarList']),
    styleObj () {
      return {
        width: `${this.tabbarList.length * 100}%`,
        transform: `translate3d(-${this.currentIndex * 100 / this.tabbarList.length}%, 0, 0)`
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
    // 判断起始点击位置到最后释放位置
    // 如果小于释放位置，当前索引切换到下一页，否则切换上一页
    let touch = {}
    // 监听手指按下
    this.$el.addEventListener('touchstart', evt => {
      touch.startX = evt.touches[0].clientX// 获取起始位置
      touch.endX = 0
    })
    // 监听手指移动
    this.$el.addEventListener('touchmove', evt => {
      touch.endX = evt.touches[0].clientX// 获取最后位置
    })
    // 监听手指松开
    this.$el.addEventListener('touchend', () => {
      // 移动幅度小获取未获取到最后位置就不执行切换页面
      if (!touch.endX || Math.abs(touch.endX - touch.startX) < 10) {
        return
      }
      if (touch.endX < touch.startX) {
        this.nextPage()
      } else {
        this.prevPage()
      }
    })
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
    transition: all 0.5s ease;
    .fun-list-item {
      flex: 1;
    }
  }
}
</style>