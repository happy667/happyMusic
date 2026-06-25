/**
 * v-swiper-nested 指令
 * 解决 Vant 4 van-tabs swipeable 与 Swiper.js 的触摸事件冲突
 * 
 * 用法：在 Swiper 容器元素上添加 v-swiper-nested
 *   <div class="swiper sw-song" v-swiper-nested>
 * 
 * 原理：水平滑动时 stopPropagation 阻断 Vant Swipe，垂直滑动不拦截
 */
const swiperNested = {
  mounted (el) {
    let startX = 0, startY = 0

    function handleTouchStart (e) {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
      }
    }

    function handleTouchMove (e) {
      if (e.touches.length !== 1) return
      const dx = e.touches[0].clientX - startX
      const dy = e.touches[0].clientY - startY
      if (Math.abs(dx) > Math.abs(dy)) {
        e.stopPropagation() // 水平滑动：阻断 Vant Swipe
      }
      // 垂直滑动不拦截，允许页面正常滚动
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true })

    // 保存引用以便 unmounted 时清理
    el._swiperNestedHandlers = { handleTouchStart, handleTouchMove }
  },

  unmounted (el) {
    if (el._swiperNestedHandlers) {
      const { handleTouchStart, handleTouchMove } = el._swiperNestedHandlers
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      delete el._swiperNestedHandlers
    }
  }
}

export default swiperNested
