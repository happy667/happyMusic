<template>
  <header class="header-container">
    <div class="back"
         @click="handleBack">
      <van-icon name="arrow-down" />
    </div>
    <div class="song-info">
      <div class="song-name">{{currentSong.name}}</div>
      <div class="singer"
           @click="selectSingers">{{currentSong.singers}}</div>
    </div>
    <van-popup v-model="showSingerPopup"
               round
               position="bottom"
               :get-container="getContainer">
      <div class="singerList">
        <singer-item :singer="item"
                     @select="handleSelect"
                     v-for="item in currentSong.singersList"
                     :key="item.id"></singer-item>
      </div>
    </van-popup>
  </header>

</template>
<script>
import SingerItem from '@/components/home/singer/SingerItem'
import { mapState, mapGetters, mapMutations } from 'vuex'
import {
  ERR_OK
} from '@/api/config.js'
import singerApi from '@/api/singer.js'
export default {
  data () {
    return {
      showSingerPopup: false// 显示歌手弹出层
    }
  },
  inject: ['reload'],
  computed: {
    ...mapState(['isGetSingerImage']),
    ...mapGetters(['currentSong'])
  },
  methods: {
    ...mapMutations(['setPlayerFullScreen', 'setSinger', 'setSingerCurrentIndex', 'setIsPlayerClick', 'setAddNoCacheComponents', 'setIsGetSingerImage', 'setIsAdvance']),
    handleBack () {
      this.setPlayerFullScreen(false)
    },
    // 选择歌手
    selectSingers () {
      if (this.currentSong.singersList.length === 1) { // 只有一个歌手直接跳转到歌手页面
        let currentPath = `/singerInfo/${this.currentSong.singersList[0].id}`
        if (this.$route.path !== currentPath) { // 如果当前歌手详情页就是所选歌手直接隐藏全屏播放器
          this.setSingerCurrentIndex(0)
          this.$router.push(`/singerInfo/${this.currentSong.singersList[0].id}`)
        }
        this.setIsPlayerClick(true)
        this.setPlayerFullScreen(false)
      } else {
        this.showSingerPopup = true
        if (!this.isGetSingerImage) { // 判断是否获取过歌手图片
          this.currentSong.singersList.forEach(async (item, index) => { // 查询该歌手图片
            item.avatar = await this.getSingerImage(item.id)
            if (index === this.currentSong.singersList.length - 1) { // 如果index等于当前歌手列表长度-1就说明数据全部获取完毕
              this.setIsGetSingerImage(true)// 设置vuex已经获取过歌手图片
            }
          })
        }
      }
    },
    // 获取歌手图片
    async getSingerImage (id) {
      // 获取歌手
      const { data: res } = await singerApi.getSingerSong(id)
      if (res.code === ERR_OK) { // 成功获取歌手
        return res.artist.img1v1Url
      }
    },
    getContainer () {
      return document.querySelector('.play-container')
    },
    // 选择歌手列表中歌手
    handleSelect (item) {
      // 设置为前进页面
      this.setIsAdvance(true)
      this.setIsPlayerClick(true)
      this.showSingerPopup = false
      this.setPlayerFullScreen(false)
      if (this.$route.path !== `/singerInfo/${item.id}`) {
        this.setSingerCurrentIndex(0)
        // 添加不缓存路由
        this.setAddNoCacheComponents('singerInfo')
        this.$router.replace(`/singerInfo/${item.id}`)
      }
    }

  },
  components: {
    SingerItem
  }

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.header-container {
  margin: 0.3rem 0.3rem 0.1rem 0.3rem;
  position: relative;
  display: flex;
  font-size: $font-size-small;

  .back {
    position: absolute;
    top: 0;
    left: 0;
    width: 1rem;
    height: 0.7rem;
    line-height: 0.7rem;
    color: $color-common;
    z-index: 999;
  }

  .song-info {
    width: 100%;
    padding: 0 1.5rem;
    box-sizing: border-box;

    .song-name, .singer {
      width: 100%;
      height: 0.7rem;
      line-height: 0.7rem;
      text-align: center;
      no-wrap();
      font-size: $font-size-smaller;
    }

    .song-name {
      font-weight: 600;
    }

    .singer {
      color: $color-common-x;
    }
  }
}
</style>