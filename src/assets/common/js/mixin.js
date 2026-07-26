import { mapWritableState } from 'pinia'
import { usePlayerStore } from '@/stores'

export const playlistMixin = {
  computed: {
    ...mapWritableState(usePlayerStore, ['playList'])
  },
  mounted() {
    this.handlePlaylist(this.playList)
  },
  activated() {
    this.handlePlaylist(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

// 解决 Vant4 swipeable 滑动时浏览器合成 click 误触内容元素
// 原理：touchend 比合成 click 先触发，用位移判断是否 swipe 后拦截
export const tabSwipeMixin = {
  data() {
    return { _sx: 0, _sy: 0, _sm: false }
  },
  methods: {
    _ts(e) { this._sx = e.touches[0].clientX; this._sy = e.touches[0].clientY; this._sm = false },
    _te(e) { this._sm = Math.abs(e.changedTouches[0].clientX - this._sx) > 1 },
    _cc(e) { if (this._sm) { e.stopPropagation(); e.preventDefault() } },
  }
}
