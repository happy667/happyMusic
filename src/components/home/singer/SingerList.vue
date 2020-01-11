<template>
  <div class="singer-list-container">
    <!-- 正在加载 -->
    <van-loading v-show="this.singerList.length === 0"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <h2 ref="fixed"
        class="fixed-title singer-list-group-title"
        v-show="fixedTitle">{{fixedTitle}}</h2>
    <scroll :data="singerList"
            ref="singerList"
            @scroll="scroll"
            @scrollToEnd="scrollToEnd"
            :listenScroll="listenScroll"
            :scrollEnd="scrollEnd"
            :probeType="probeType">
      <div class="singer-list-wrapper">
        <ul class="singer-list"
            v-if="this.singerList.length !== 0">
          <li class="singer-list-item"
              ref="listGroup"
              v-for="(group,index) in singerList"
              :key="index">
            <h2 class="singer-list-group-title">{{group.title}}</h2>
            <ul>
              <li v-for="item in group.items"
                  :key="item.id">
                <singer-item :singer="item"></singer-item>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </scroll>

  </div>

</template>
<script>
import Scroll from '@/components/common/Scroll'
import SingerItem from './SingerItem'
import { mapState, mapMutations } from 'vuex'
export default {
  props: {
    singerList: {
      type: Array,
      default: () => []
    }

  },
  data () {
    return {
      scrollY: -1,
      diff: -1
    }
  },
  created () {
    this.listHeight = [] // 列表高度
    this.titleHeight = 0// 标题高度
    this.listenScroll = true// 可以监听页面滚动
    this.scrollEnd = true// 可以监听页面停止滚动
    this.probeType = 3// 可以监听缓冲时的滑动位置
  },
  computed: {
    ...mapState(['scrollIndex', 'stop', 'isScroll']),
    // 固定标题
    fixedTitle () {
      if (this.scrollY > 0 || this.scrollIndex >= this.singerList.length - 1) {
        return ''
      }
      return this.singerList[this.scrollIndex] ? this.singerList[this.scrollIndex].title : ''
    }
  },
  watch: {
    // 监听滚动索引变化
    scrollIndex () {
      if (!this.isScroll) {
        this._scrollTo(this.scrollIndex)
      }
    },
    // 监听是否取消滚动动画
    stop () {
      if (this.stop) {
        this.$refs.singerList.stop()
      }
    },

    singerList () {
      setTimeout(() => {
        this.caleHeight()
        this.titleHeight = this.$refs.fixed.clientHeight
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部
      if (newY > 0) {
        this.setScrollIndex(0)
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        // 获取两个分组区间范围高度
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        // 滑动到了该区间位置
        if (-newY >= height1 && -newY < height2) {
          this.setScrollIndex(i)
          // 两个分组标题之间的距离
          this.diff = height2 + newY
          return
        }
      }

      // 滚动到底部
      this.setScrollIndex(listHeight.length - 2)
    },
    // 监听差值
    diff (newVal) {
      // 判断差值是否大于0并且是否小于分组标题的高度
      let fixedTop = (newVal > 0 && newVal < this.titleHeight) ? newVal - this.titleHeight : 0
      // 如果差值的高度等于标题高度就停止监听
      if (this.fixedTop === fixedTop) {
        return
      }
      // 移动动画
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  methods: {
    ...mapMutations(['setScrollIndex', 'setStop', 'setIsScroll', 'setSinger']),
    // 计算歌手列表元素高度
    caleHeight () {
      let height = 0
      this.listHeight.push(height)
      const list = this.$refs.listGroup
      for (let i = 0; i < list.length; i++) {
        height += list[i].clientHeight
        this.listHeight.push(height)
      }
      return this.listHeight
    },

    // 页面滚动
    scroll (pos) {
      this.setIsScroll(true)
      this.setStop(false)
      this.scrollY = pos.y
    },
    // 页面滚动停止
    scrollToEnd () {
      this.setIsScroll(false)
    },
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        this.setScrollIndex(0)
      } else if (index > this.listHeight.length - 2) {
        this.setScrollIndex(this.listHeight.length - 2)
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.singerList.scrollToElement(this.$refs.listGroup[index], 0)
    }
  },
  components: {
    SingerItem,
    Scroll
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-list-container {
  position: relative;
  width: 100%;

  h2.fixed-title {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
  }

  h2.singer-list-group-title {
    width: 100%;
    padding: 0 0.5rem;
    height: 0.8rem;
    line-height: 0.8rem;
    font-size: $font-size-smaller;
    background: #f4f4f4;
    box-sizing: border-box;
  }
}

.singer-list-wrapper {
  .singer-list {
    .singer-list-item {
      ul {
        padding: 0 0.5rem;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: space-between;
      }
    }
  }
}
</style>