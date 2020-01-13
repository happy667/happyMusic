<template>
  <div ref="wrapper"
       class="scroll">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'

export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: null
    },
    pullUp: {
      type: Boolean,
      default: false
    },
    scrollEnd: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        pullUpLoad: {
          threshold: -30 // 当上拉到超过底部 30px 时，
        }
      })

      if (this.listenScroll) {
        let me = this
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos)
        })
      }

      if (this.scrollEnd) {
        this.scroll.on('scrollEnd', () => {
          this.$emit('scrollToEnd')
        })
      }
      if (this.pullUp) {
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUpLoad')
          this.$nextTick(function () {
            this.scroll.finishPullUp()
            setTimeout(() => {
              this.scroll.refresh()
            }, 500)
          })
        })
      }
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    enable () {
      this.scroll && this.scroll.enable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    stop () {
      this.scroll && this.scroll.stop()
    },
    finishPullUp () {
      this.scroll && this.scroll.finishPullUp()
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.scroll {
  /* 减去搜索框、导航栏、底部播放区域高度 */
  height: calc(100vh - (1.7rem + 1.18rem + 1.8rem));
}
</style>
