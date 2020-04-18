<template>
  <div class="video-item-container">
    <m-video :videoParams="videoParams">
      <!-- 视频信息 -->
      <div class="video-info">
        <div class="info-top van-hairline--bottom"
             @click="goToVideoInfo">
          <!-- 视频标题 -->
          <div class="title">
            <div class="name">{{videoParams.name}}</div>
          </div>
        </div>

        <!-- 视频出处 -->
        <div class="info-bottom"
             @click="selectSinger(videoParams.artist)">
          <div class="play-source-img">
            <mini-image :avatar="this.videoParams.artist.avatarUrl"></mini-image>
          </div>
          <div class="play-source-author">
            {{videoParams.artist.name}}
          </div>
        </div>
      </div>
    </m-video>

  </div>
</template>
<script>
import MiniImage from '../img/MiniImage'
import MVideo from './Video'
import 'common/js/convert.js'
import { mapMutations } from 'vuex'
export default {
  props: {
    videoParams: {
      type: Object,
      default: () => { }
    }

  },
  methods: {
    ...mapMutations(['setSingerCurrentIndex']),
    // 跳转到video详情页
    goToVideoInfo () {
      // 说明不是视频详情页
      if (!this.moreInfo) {
        this.$router.push(`/videoInfo/${this.videoParams.id}`)
      } else { // 切换显示更多信息
        this.$emit('toggleInfo')
      }
    },

    // 选择歌手
    selectSinger (item) {
      this.setSingerCurrentIndex(0)
      this.$router.push(`/singerInfo/${item.id}`)
    }
  },
  components: {
    MiniImage,
    MVideo
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.video-item-container {
  margin-bottom: 0.5rem;

  .video-info {
    .info-top {
      padding: 0.1rem 0.2rem;

      .title {
        width: 100%;
        line-height: 1rem;
        no-wrap();

        .name {
          font-size: $font-size-smaller;
          no-wrap();
        }
      }
    }

    .info-bottom {
      padding: 0.2rem;
      display: flex;
      align-items: center;

      .play-source-img {
        margin-right: 0.3rem;
      }

      .play-source-author {
        font-size: $font-size-smaller;
      }
    }
  }
}
</style>