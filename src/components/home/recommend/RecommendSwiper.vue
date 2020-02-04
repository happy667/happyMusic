<template>
  <div class="recommend-swiper-container">
    <van-swipe :autoplay="3000"
               indicator-color="white">
      <van-swipe-item @click="selectItem(item)"
                      v-for="(item,index) in banners"
                      :key="index">
        <img :src="item.imageUrl">
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
import Song from '@/assets/common/js/song.js'
import Singer from '@/assets/common/js/singer.js'
import songApi from '@/api/song.js'
import {
  ERR_OK
} from '@/api/config.js'
import 'common/js/utils.js'
import {
  targetType
} from '@/assets/common/js/config.js'
export default {
  props: {
    // 轮播图数据
    banners: {
      type: Array
    }
  },
  data () {
    return {

    }
  },
  methods: {
    selectItem (item) {
      console.log(item)
      let id = item.targetId
      switch (item.targetType) {
        case targetType.song:// 歌曲
          // 获取歌曲
          this.getSongDetail(id).then(res => {
            // 引入vue原型上的utils
            this.utils.playMusic(res)
          })

          break
        case targetType.video:// 视频
          this.$router.push(`/videoInfo/${id}`)
          break
        case targetType.album:// 专辑
          this.$router.push(`/singerAlbum/${id}`)
          break
      }
    },
    async getSongDetail (id) {
      // 获取歌曲详情
      const {
        data: res
      } = await songApi.getSongDetail(id)
      if (res.code === ERR_OK) {
        let item = res.songs[0]
        let singers = item.ar.map(item => item.name).join('/')
        // 处理歌手
        let singersList = []
        // 处理歌手
        item.ar.forEach(item => {
          singersList.push(new Singer({
            id: item.id,
            name: item.name
          }))
        })
        let song = new Song({ id: item.id, name: item.name, singers, singersList, picUrl: item.al.picUrl })
        return Promise.resolve(song)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.recommend-swiper-container {
  width: 100%;
  padding: 0.2rem 0.4rem;
  box-sizing: border-box;
  border-radius: 0.3rem;

  .van-swipe {
    width: 100%;
    border-radius: 0.3rem;

    .van-swipe-item {
      padding: 0.1rem;
      width: 100%;
      height: 4.2rem !important;
      box-sizing: border-box;
      border-radius: 0.3rem;

      img {
        width: 100%;
        height: 100%;
        border-radius: 0.3rem;
      }
    }
  }
}
</style>