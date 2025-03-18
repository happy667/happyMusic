<template>
  <div class="song-comment-container">
    <header class="header">
      <van-sticky>
        <van-nav-bar :title="$route.meta.title"
                     left-arrow
                     @click-left="routerBack" />
      </van-sticky>
    </header>
    <section class="container"
             ref="container">
      <template v-if="!commentList">
        <!-- loading -->
        <loading />
      </template>
      <template v-else>
        <section class="section">
          <div class="song"
               @click="selectSong(song)">
            <song-item :song="song"
                       :showImage="true"></song-item>
          </div>

          <!-- 评论列表 -->
          <div class="comment"
               v-if="commentList">
            <div class="comment-title">精彩评论 {{commentText}}</div>
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
</section>

</div>
</template>
<script>
import SongItem from '@/components/home/song/SongItem'
import CommentList from '@/components/home/comment/CommentList'
import {
  mapState,
  mapGetters,
  mapMutations
} from 'vuex'
import Song from '@/assets/common/js/song.js'
import Album from '@/assets/common/js/album.js'
import Singer from '@/assets/common/js/singer.js'
import songApi from '@/api/song.js'
import {
  ERR_OK
} from '@/api/config.js'
import {
  playlistMixin
} from '@/assets/common/js/mixin.js'
export default {
  name: 'songComment',
  props: {
    id: String
  },
  mixins: [playlistMixin],
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
    ...mapState(['playerFullScreen', 'isPlayerClick']),
    ...mapGetters(['currentSong']),
    commentText () {
      return this.commentCount === 0 ? '' : this.commentCount
    }
  },
  methods: {
    ...mapMutations(['setPlayerFullScreen', 'setIsPlayerClick']),
    // 返回上一个路由
    routerBack () {
      if (!this.playerFullScreen && this.currentSong && this.isPlayerClick) {
        this.setPlayerFullScreen(true)
      }
      this.$utils.routerBack()
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
    selectSong (item) {
      // 比较两首歌曲
      let result = this.$utils.compareSong(this.currentSong, item)
      if (!result) {
        // 引入vue原型上的utils
        this.$utils.playMusic(item)
      }
      // 不是由播放器页面点击
      this.setIsPlayerClick(false)
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
        let song = new Song({
          id: item.id,
          name: item.name,
          singers,
          singersList,
          picUrl: item.al.picUrl,
          album: new Album({
            id: item.al.id,
            name: item.al.name,
            picUrl: item.al.picUrl
          })
        })
        this.song = song
        console.log(song)
      }
    },
    handlePlaylist (playList) {
      // 适配播放器与页面底部距离
      const bottom = playList.length > 0 ? '1.5rem' : ''
      this.$nextTick(() => {
        this.$refs.container.style.paddingBottom = bottom
      })
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

.song-comment-container>>>.song-list-item-containter {
  border-radius: 0.2rem;
  padding: 0.2rem;
  box-shadow: 0 0.06rem 0.16rem rgba(0 0 0, 7%);
}

.song-comment-container {
  width: 100%;
  height: 100%;
  background: $color-common-background;

  .container {
    .section {
      padding: 0.3rem 0.4rem;

      .song {
        margin-bottom: 0.3rem;
      }

      .comment {
        .comment-title {
          font-size: $font-size-smaller-x;
          font-weight: bold;
          height: 1rem;
          line-height: 1rem;
        }
      }
    }
  }
}
</style>