<template>
  <div class="singer-popup-container">
    <van-popup v-model="_showPopup"
               round
               position="bottom"
               :get-container="getContainer">
      <div class="singerList">
        <singer-item :singer="item"
                     @select="handleSelect"
                     v-for="item in list"
                     :key="item.id"></singer-item>
      </div>
    </van-popup>
  </div>
</template>
<script>
import SingerItem from '@/components/home/singer/SingerItem'
import { mapMutations } from 'vuex'
import {
  ERR_OK
} from '@/api/config.js'
import singerApi from '@/api/singer.js'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    // 是否要加载图片
    isLoadImage: {
      type: Boolean,
      default: () => true
    },
    showPopup: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    // 显示弹出层
    _showPopup: {
      get () {
        return this.showPopup
      },
      set (val) {
        console.log(123)
        if (val) {
          this.$emit('showPopup')
        } else {
          this.$emit('closePopup')
        }
      }
    }
  },
  watch: {
    _showPopup () {
      if (this._showPopup) {
        console.log(this.list)
        this.getSingerListImage()
      }
    }
  },
  methods: {
    ...mapMutations(['setSingerCurrentIndex', 'setAddNoCacheComponents']),
    // 选择歌手
    getSingerListImage () {
      if (this.isLoadImage) { // 判断是否要加载图片
        this.list.forEach(async (item, index) => { // 查询该歌手图片
          item.avatar = await this.getSingerImage(item.id)
          if (index === this.list.length - 1) { // 如果index等于当前歌手列表长度-1就说明数据全部获取完毕
            // 已获取成功
            this.$emit('finishedLoadImage')
          }
        })
      }
    },
    // 获取歌手图片
    async getSingerImage (id) {
      // 获取歌手
      console.log(1111)
      const { data: res } = await singerApi.getSingerSong(id)
      if (res.code === ERR_OK) { // 成功获取歌手
        return res.artist.img1v1Url
      }
    },
    getContainer () {
      return document.querySelector('#app')
    },
    // 选择歌手列表中歌手
    handleSelect (item) {
      this.$emit('clickListItem', item)
      if (this.$route.path !== `/singerInfo/${item.id}`) {
        this.setSingerCurrentIndex(0)
        // 添加不缓存路由
        this.setAddNoCacheComponents('singerInfo')
        this.$router.push(`/singerInfo/${item.id}`)
      }
    }
  },
  components: {
    SingerItem
  }
}
</script>
<style lang="stylus" scoped></style>