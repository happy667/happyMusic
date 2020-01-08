<template>
  <div class="singer-list-container">
    <h2 class="fixed-title singer-list-group-title"
        v-if="this.singerList.length!==0 && scrollIndex!==0">{{singerList[scrollIndex].title}}</h2>
    <scroll :data="singerList"
            ref="singerList"
            @scroll="scroll"
            @scrollToEnd="scrollToEnd"
            @scrollCancle="handleScrollCancle"
            :listenScroll="listenScroll"
            :pullup="pullup"
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
  <!-- 歌手列表 -->

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
      isScroll: false
    }
  },
  created () {
    this.listHeight = [] // 列表高度
    this.listenScroll = true// 可以监听页面滚动
    this.pullup = true// 可以监听页面停止滚动
    this.probeType = 3// 可以监听缓冲时的滑动位置
  },
  mounted () {
    console.log(this.$refs.singerList)
  },
  computed: {
    ...mapState(['scrollIndex', 'stop'])
  },
  watch: {
    // 监听滚动索引变化
    scrollIndex () {
      if (!this.isScroll) {
        // 移动歌手列表分组元素
        this.$refs.singerList.scrollToElement(this.$refs.listGroup[this.scrollIndex], 0)
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
      }, 20)
    },
    scrollY (newY) {
      // 当滚动到顶部
      if (newY > 0) {
        this.setScrollIndex(0)
        return
      }
      // 在中间部分滚动
      const listHeight = this.listHeight
      for (let i = 0; i < listHeight.length - 1; i++) {
        // 获取两个分组区间范围高度
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        // 滑动到了该区间位置
        if (-newY >= height1 && -newY < height2) {
          this.setScrollIndex(i)
          return
        }
      }
      // 滚动到底部
      this.setScrollIndex(listHeight.length - 2)
    }
  },
  methods: {
    ...mapMutations(['setScrollIndex', 'setStop']),
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
      this.isScroll = true
      this.setStop(false)
      this.scrollY = pos.y
    },
    scrollToEnd () {
      this.isScroll = false
    },
    handleScrollCancle () {

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
  width: 100%;
  position: relative;

  h2.fixed-title {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
  }

  h2.singer-list-group-title {
    padding: 0 0.5rem;
    height: 0.8rem;
    line-height: 0.8rem;
    font-size: $font-size-smaller;
    background: #f4f4f4;
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