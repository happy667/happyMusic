<template>
  <div class="official-list-container"
       @click="selectItem(rankingObj)">
    <div class="official-list">
      <!-- 排行列表图片 -->
      <div class="official-list-img">
        <img v-lazy="rankingObj.coverImgUrl"
             class="animated fadeIn"
             :key="rankingObj.coverImgUrl" />
      </div>
      <!-- 歌曲排名 -->
      <ul class="official-list-info">
        <li v-for="(item,index) in topThreeTracks"
            :key="item.id"
            class="official-list-item">
          {{index+1+'. '}}{{item.name+' - '}} {{ $filters.convertSinger(item.ar) }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import 'common/js/convert.js'
export default {
  props: {
    rankingObj: Object
  },
  computed: {
    // 只取前3首歌曲
    topThreeTracks () {
      return this.rankingObj.tracks ? this.rankingObj.tracks.slice(0, 3) : []
    }
  },
  methods: {
    // 选择排行榜进入歌单详情
    selectItem (item) {
      this.$router.push({ path: `/songSheetDisc/${item.id}`, query: { rank: true } })
    }
  }
}
</script>
<style lang="stylus" scoped>
.official-list-container {
  margin-bottom: 0.4rem;

  .official-list {
    display: flex;
    width: 100%;
    box-shadow: 0 0.06rem 0.16rem rgba(0, 0, 0, 0.07);
    border-radius: 0.2rem;
    padding: 0.3rem;
    box-sizing: border-box;

    .official-list-img {
      width: 2.2rem;
      height: 2.2rem;
      border-radius: 0.2rem;
      margin-right: 0.3rem;
      background-color: $color-common-b;

      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 0.2rem;
      }
    }

    .official-list-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      overflow: hidden;

      .official-list-item {
        color: #000;
        height: 0.6rem;
        line-height: 0.6rem;
        word-wrap: break-word;
        no-wrap();
      }
    }
  }
}
</style>
