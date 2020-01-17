<template>
  <div class="mv-list-item-container"
       @click="goToVideoInfo">
    <!-- mv 图片 -->
    <div class="mv-img">
      <img :src="mv.cover" />
      <!-- 播放次数 -->
      <div class="play-num">
        <i class="iconfont icon-bofang"></i>
        {{mv.playCount|convertPlayCount}}
      </div>
    </div>
    <!-- mv信息 -->
    <div class="mv-info">
      <!-- 标题 -->
      <div class="mv-title">{{mv.name}}</div>
      <div class="bottom">
        <!-- 时间 -->
        <div class="mv-time">{{mv.duration/1000|convertPlayTime}}</div>
        <!-- 来源 -->
        <div class="mv-source">{{mv.artistName}}</div>
      </div>

    </div>
  </div>
</template>
<script>
import 'common/js/convert.js'
import { mapMutations } from 'vuex'
export default {
  props: {
    mv: {
      type: Object
    }
  },
  inject: ['reload'],
  methods: {
    ...mapMutations(['setSelectVideo']),
    goToVideoInfo () {
      this.setSelectVideo(this.mv)
      if (this.$route.path === '/videoInfo') {
        this.reload()
      } else {
        this.$router.push('/videoInfo')
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.mv-list-item-container {
  width: 100%;
  display: flex;
  margin-bottom: 0.3rem;

  .mv-img {
    position: relative;
    margin-right: 0.4rem;
    width: 3rem;
    height: 1.8rem;

    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 0.1rem;
    }

    .play-num {
      position: absolute;
      right: 0.1rem;
      top: 0.1rem;
      color: #fff;
    }
  }

  .mv-info {
    flex: 1;

    .mv-title {
      width :6rem;
      margin-bottom: 0.2rem;
      line-height: 0.5rem;
      font-weight: bold;
      no-wrap2();
    }

    .bottom {
      display: flex;
      color: #999;

      .mv-time {
        margin-right: 0.3rem;
      }

      .mv-source {
        width: 3rem;
        no-wrap();
      }
    }
  }
}
</style>