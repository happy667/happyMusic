<template>
  <div class="songSheet-container">
    <!-- 头部导航栏 -->
    <van-nav-bar title="songSheet"
                 left-arrow
                 @click-left="onClickLeft" />
    <!-- 歌单分类 -->
    <van-tabs v-model="currentIndex"
              title-active-color="#FD4979"
              color="#FD4979"
              animated
              sticky
              swipeable>
      <!-- 推荐页 -->
      <van-tab title="推荐">
        <song-sheet-small></song-sheet-small>
      </van-tab>
      <!-- 排行页 -->
      <van-tab title="排行">
        <ranking />
      </van-tab>
      <!-- 歌手页 -->
      <van-tab title="歌手">
        <singer />
      </van-tab>
      <!-- 搜索页 -->
      <van-tab title="搜索">
        <search />
      </van-tab>
      <van-tab title="搜索">
        <search />
      </van-tab>
      <van-tab title="搜索">
        <search />
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import songSheetSmall from './SongSheetSmall'
export default {
  data () {
    return {
      currentIndex: 0// 当前索引

    }
  },
  methods: {
    // 返回上一个路由
    onClickLeft () {
      this.$router.back()
    }
  },
  components: {
    songSheetSmall
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.songSheet-container {
  width: 100%;
  height: 100%;

  .songsSheet-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .songsSheet-list-item {
      box-sizing: border-box;
      padding: 0.2rem;
      margin-top: 2%;
      width: 32%;
      height: 5.5rem;
      background: #fff;
      box-shadow: 0 0 46px rgba(0, 0, 0, 0.1);
      border-radius: 0.3rem;

      .sons-img {
        display: block;
        margin: 0 auto;
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 0.3rem;
        margin-bottom: 0.2rem;
      }

      .songs-desc {
        width: 4rem;
        height: 1rem;
        line-height: 1rem;
        word-wrap: break-word;
        font-size: $font-size-small-x;
        font-family: $font-common-title;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .songs-author {
        width: 100%;
        height: 1rem;
        line-height: 1rem;
        color: #999;
        font-size: $font-size-smaller;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}
</style>