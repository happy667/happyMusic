<template>
  <div class="songs-sheet-large-container">
    <song-sheet-title :isShowLoadMore="true"
                      :title="title"></song-sheet-title>
    <ul class="songs-sheet-list">
      <li @click="selectItem(item)"
          class="songs-sheet-list-item"
          v-for="item in recommendList"
          :key="item.id">
        <div class="sons-img">
          <img v-lazy="item.picUrl">
        </div>
        <div class="songs-desc">{{item.name}}</div>
        <div class="songs-playCount">
          <i class="iconfont icon-bofang"></i>{{item.playCount|convert}}
        </div>

      </li>
    </ul>
  </div>
</template>
<script>
import 'common/js/convert.js'
import SongSheetTitle from '@/components/common/Title'
export default {
  props: {
    title: String, // 标题
    recommendList: Array// 推荐列表
  },
  methods: {
    // 选择歌单进入歌单详情
    selectItem (item) {
      this.$router.push({ path: `/songSheetInfo/${item.id}` })
    }
  },
  components: {
    SongSheetTitle
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.songs-sheet-large-container {
  width: 100%;
  background: $color-common-background;

  .songs-sheet-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 0.4rem;

    .songs-sheet-list-item {
      box-sizing: border-box;
      padding: 0.1rem 0.5rem 0.2rem;
      margin-bottom: 0.6rem;
      width: 46%;
      background: $color-common-background;
      box-shadow: 0 0.25rem 0.6rem rgba(0, 0, 0, 0.1);
      border-radius: 0.3rem;

      .sons-img {
        width: 100%;
        padding: 0 0.17rem;
        height: 3rem;
        box-sizing: border-box;
        border-radius: 0.3rem;
        margin-bottom: 0.2rem;

        img {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 0.3rem;
        }
      }

      .songs-desc {
        margin-bottom: 0.1rem;
        width: 100%;
        line-height: 0.5rem;
        word-wrap: break-word;
        font-size: $font-size-smaller;
        font-family: $font-common-title;
        no-wrap2();
      }

      .songs-playCount {
        line-height: 0.6rem;
        width: 100%;
        color: #999;
        font-size: $font-size-smaller-x;
        no-wrap();
      }
    }
  }
}
</style>