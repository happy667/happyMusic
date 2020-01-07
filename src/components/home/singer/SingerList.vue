<template>
  <div class="singer-container">
    <van-loading v-show="this.singerList.length === 0"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>

    <ul class="singer-list"
        v-if="this.singerList.length !== 0">
      <li class="singer-list-item"
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

</template>
<script>
import SingerItem from './SingerItem'
import singerApi from '@/api/singer.js'
import Singer from '@/assets/common/js/singer.js'
import {
  ERR_OK
} from '@/api/config.js'
var pinyin = require('pinyin')
// const pinyin = require('pinyin')
const HOT_NAME = '热门'
const HOT_LENGTH = 30// 热门歌手数量
// import { mapActions, mapState } from 'vuex'
export default {
  data () {
    return {
      singerList: []// 歌手列表
    }
  },
  components: {
    SingerItem
  },
  computed: {
    // ...mapState(['singerList'])
  },
  methods: {
    // ...mapActions(['getSingerList', 'getRecommendSingerList'])
    // 处理歌手列表数据
    handleSingerList (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []// 歌手
        }
      }
      let hot = []// 热门
      let ret = []// 根据字母查询
      list.forEach((item, index) => {
        // 处理热门歌手
        if (index < HOT_LENGTH) {
          map.hot.items.push(new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliaName: item.alias.join(' / ')
          }))
        } else { // 处理歌手列表
          const key = item.initial
          // 判断是否存在该字母key
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliaName: item.alias[0]
          }))
        }
      })
      // 遍历map,处理歌手列表
      for (const key in map) {
        let val = map[key]
        if (val.title.match(/[A-Z]/)) { // 匹配字母，添加到按字母查询数组中
          ret.push(val)
        } else if (val.title === HOT_NAME) { // 添加到热门歌手数组中
          hot.push(val)
        }
      }
      // 将字母进行排序（升序）
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    // 获取歌手列表
    async getSingerList () {
      // 获取热门歌手
      const {
        data: res
      } = await singerApi.getRecommendSingerList()
      if (res.code === ERR_OK) {
        this.singerList = res.artists
        // 获取歌手列表
        const {
          data: res2
        } = await singerApi.getSingerList()
        if (res2.code === ERR_OK) {
          res2.artists.map(item => {
            // 获取歌手的首字母
            let py = pinyin(item.name[0], {
              style: pinyin.STYLE_FIRST_LETTER
            })
            item.initial = py[0][0].toUpperCase()
          })
          // 处理歌手列表数据
          this.singerList = this.singerList.concat(res2.artists)// 合并歌手列表
          this.singerList = this.handleSingerList(this.singerList)
          console.log(this.singerList)
        }
      }
    }

  },
  mounted () {
    // this.getSingerList()
    // this.getRecommendSingerList()
    this.getSingerList()
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-container {
  .singer-list {
    .singer-list-item {
      .singer-list-group-title {
        padding: 0 0.5rem;
        height: 0.8rem;
        line-height: 0.8rem;
        font-size: $font-size-smaller;
        background: #f4f4f4;
      }

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