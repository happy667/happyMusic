<template>
  <div class="song-comment-container">
    <header class="header">
      <van-sticky>
        <van-nav-bar title="评论列表"
                     left-arrow
                     @click-left="routerBack" />
      </van-sticky>
    </header>
    <template v-if="!commentList">
      <van-loading size="24px"
                   color="#FD4979"
                   vertical>加载中...</van-loading>
    </template>
    <template v-else>
      <section class="section">
        <div class="song"
             @click="handleClick(song)">
          <song-item :song="song"
                     :showImage="true"></song-item>
        </div>

        <!-- 评论列表 -->
        <div class="comment"
             v-if="commentList">
          <div class="comment-title">精彩评论{{commentText}}</div>
          <van-list v-model="loading"
                    :immediate-check='false'
                    :finished="finished"
                    :finished-text="commentCount===0?'':'没有更多了'"
                    @load="handlePullingUp">
            <template v-if="commentList.length!==0">
              <comment-list :commentList="commentList"></comment-list>
            </template>
            <template v-else>
              <no-result text="还没有小伙伴发表评论哦~"></no-result>
            </template>
          </van-list>
        </div>
      </section>
    </template>

  </div>
</template>
<script>
import SongItem from '@/components/home/song/SongItem'
import CommentList from '@/components/home/comment/CommentList'
import { mapGetters, mapMutations } from 'vuex'
import Song from '@/assets/common/js/song.js'
import Singer from '@/assets/common/js/singer.js'
import songApi from '@/api/song.js'
import {
  ERR_OK
} from '@/api/config.js'
import 'common/js/utils.js'
export default {
  props: {
    id: String
  },
  data () {
    return {
      loading: false, // 加载中
      finished: false, // 加载完所有数据
      commentList: null, // 评论列表
      commentCount: 0, // 评论数量
      song: null // 歌曲
    }
  },
  mounted () {
    this.getSongDetail(this.id)
    this.getSongComment(this.id)
  },
  computed: {
    ...mapGetters(['currentSong']),
    commentText () {
      return this.commentCount === 0 ? '' : this.commentCount
    }
  },
  methods: {
    ...mapMutations(['setPlayerFullScreen']),
    // 返回上一个路由
    routerBack () {
      this.$router.back()
    },
    // 获取该mv评论
    async getSongComment (id) {
      let offset = this.commentList ? this.commentList.length : 0
      let list = this.commentList ? this.commentList : []
      const {
        data: res
      } = await songApi.getSongComment(id, offset)
      if (res.code === ERR_OK) {
        this.commentCount = res.total
        this.commentList = list.concat(res.comments)
        console.log(this.commentList)
      }
    },
    // 上拉加载
    handlePullingUp () {
      setTimeout(async () => {
        await this.getSongComment(this.id)
        if (this.commentList.length >= this.commentCount) {
          this.finished = true
        }
        this.loading = false
      }, 500)
    },
    handleClick (item) {
      if (this.currentSong.id === item.id) { // 打开全屏播放器页面
        this.setPlayerFullScreen(true)
      } else {
        this.playMusic(this.song)
      }
    },
    async getSongDetail (id) {
      // 获取歌曲详情
      const {
        data: res
      } = await songApi.getSongDetail(this.id)
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
        this.song = song
        console.log(song)
      }
    },
    playMusic (song) {
      // 引入vue原型上的utils
      this.utils.playMusic(song)
    }
  },
  components: {
    SongItem,
    CommentList
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.song-comment-container>>> .songs-list-item-containter {
  border-radius: 0.2rem;
  padding: 0.2rem;
  box-shadow: 0 0.1rem 0.8rem rgba(0, 0, 0, 0.1);
}

.song-comment-container {
  min-height: 100vh;
  background: $color-common-background;

  .section {
    padding: 0.3rem 0.5rem;

    .song {
      margin-bottom: 0.5rem;
    }

    .comment {
      .comment-title {
        font-size: $font-size-smaller;
        font-weight: bold;
        height: 1rem;
        line-height: 1rem;
      }
    }
  }
}
</style>