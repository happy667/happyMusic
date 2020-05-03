<template>
  <div class="singer-container"
       ref="container">
    <!-- 歌手列表 -->
    <div class="container">
      <div class="singer-cat-container">
        <ul class="area-list list">
          <li class="item"
              @click="selectAreaTypeList(item.typeId)"
              :class="item.typeId===area?'active':''"
              v-for="item in areaTypeList"
              :key="item.typeId">{{item.name}}</li>
        </ul>
        <ul class="singer-type-list list">
          <li class="item"
              @click="selectSingerTypeList(item.typeId)"
              :class="item.typeId===singerType?'active':''"
              v-for="item in singerTypeList"
              :key="item.typeId">{{item.name}}</li>
        </ul>

      </div>
      <scroll :data="singerList"
              :pullUp="pullUp"
              @pullingUpLoad="handlePullingUp"
              ref="singer_list_scroll">
        <div class="box">

          <template v-if="singerList.length === 0">
            <!-- loading -->
            <loading />
          </template>
          <template v-else>
            <div class="list-wrapper">
              <ul class="list">
                <li class="item"
                    v-for="item in singerList"
                    :key="item.id">
                  <singer-item :singer="item"
                               imageSize="normal"
                               @select="handleSelect"></singer-item>
                </li>
              </ul>
              <!-- loading -->
              <loading :loading="loadMore"
                       height="3rem" />
            </div>
          </template>

        </div>
      </scroll>
    </div>

  </div>

</template>
<script>
import Scroll from '@/components/common/Scroll'
import SingerItem from '@/components/common/singer_desc/SingerItem'
import { mapMutations } from 'vuex'
import singerApi from '@/api/singer.js'
import Singer from '@/assets/common/js/singer.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  AREA_TYPE,
  SINGER_TYPE,
  AREA_TYPE_LIST,
  SINGER_TYPE_LIST
} from '@/assets/common/js/config.js'
export default {
  data () {
    return {
      singerList: [], // 歌手列表
      singerTypeList: SINGER_TYPE_LIST, // 歌手类型列表
      areaTypeList: AREA_TYPE_LIST, // 地区类型列表
      area: AREA_TYPE.chinese, // 地区类型
      singerType: SINGER_TYPE.maleSinger, // 歌手类型
      loadMore: false,
      more: false
    }
  },
  created () {
    this.pullUp = true
  },
  watch: {
    loadMore () {
      this.$nextTick(() => {
        this.refresh()
      })
    }
  },
  computed: {
    cat () {
      return this.area + '' + this.singerType
    }
  },
  methods: {
    ...mapMutations(['setSingerCurrentIndex']),
    // 获取歌手列表
    async getSingerList (cat) {
      const offset = this.singerList.length
      const {
        data: res
      } = await singerApi.getSingerList({ cat, offset })
      if (res.code === ERR_OK) {
        let singerList = []
        this.more = res.more
        // 处理歌手列表数据
        res.artists.forEach(item => {
          let singer = new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliaName: item.alias.join(' / '),
            picUrl: item.picUrl,
            songSize: item.musicSize,
            albumSize: item.albumSize,
            followed: item.followed
          })
          singerList.push(singer)
        })
        this.singerList = this.singerList.concat(singerList)
        this.loadMore = false
      }
    },
    // 选择歌手类型
    selectSingerTypeList (typeId) {
      // 如果当前点击的歌手类型相同则不作处理
      if (this.singerType === typeId) {
        return
      }
      this.singerType = typeId
      // 清空歌手列表
      this.singerList = []
      this.getSingerList(this.cat)
    },
    // 选择地区类型
    selectAreaTypeList (typeId) {
      // 如果当前选择地区类型相同则不作处理
      if (this.area === typeId) {
        return
      }
      this.area = typeId
      // 清空歌手列表
      this.singerList = []
      this.getSingerList(this.cat)
    },
    // 选择歌手
    handleSelect (item) {
      this.setSingerCurrentIndex(0)
      this.$router.push(`/singerInfo/${item.id}`)
    },
    // 上拉加载
    handlePullingUp () {
      if (this.loadMore) { // 如果请求未完成就不继续请求数据
        return
      }
      if (this.more) { // 还有更多
        clearTimeout(this.loadTimer)
        this.loadMore = true
        this.loadTimer = setTimeout(async () => {
          await this.getSingerList(this.cat)
          this.$nextTick(() => {
            this.finishPullUp()
          })
        }, 300)
      }
    },
    finishPullUp () {
      this.$refs.singer_list_scroll.finishPullUp()
    },
    refresh () {
      this.$refs.singer_list_scroll.refresh()
    }
  },
  activated () {
    this.refresh()
  },
  mounted () {
    this.getSingerList(this.cat)
  },
  components: {
    SingerItem,
    Scroll
  }
}

</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-container .item>>>.follow-container {
  font-size: $font-size-mini-x;
}

.singer-container {
  position: absolute;
  width: 100%;
  height: 100%;

  .container {
    position: absolute;
    width: 100%;
    height: 100%;

    .singer-cat-container {
      padding: 0.25rem 0.4rem 0.25rem;
      position: sticky;
      left: 0;
      top: 0;

      .list {
        display: flex;
        margin-bottom: 0.3rem;

        &:last-child {
          margin-bottom: 0;
        }

        .item {
          margin-right: 0.3rem;
          padding: 0 0.25rem;
          height: 0.7rem;
          border-radius: 0.5rem;
          line-height: 0.7rem;
          color: #868e94;
          background: #f2f2f2;
          font-size: $font-size-smaller-x;

          &.active {
            color: #fff;
            background: $color-common;
          }

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    .box {
      .list-wrapper {
        .list {
          .list-item {
            ul {
              display: flex;
              flex-direction: column;
              flex-wrap: wrap;
              justify-content: space-between;
            }
          }
        }
      }
    }
  }
}
</style>