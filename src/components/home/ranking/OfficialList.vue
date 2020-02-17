<template>
  <div class="official-list-container"
       @click="selectItem(rankingObj)">
    <router-link to="/songSheetInfo"
                 tab="div"
                 class="official-list">
      <!-- 排行列表图片 -->
      <div class="official-list-img">
        <img v-lazy="rankingObj.coverImgUrl" :key="rankingObj.coverImgUrl" />
      </div>
      <!-- 歌曲排名 -->
      <ul class="official-list-info">
        <li class="official-list-item"
            v-for="(item,index) in rankingObj.tracks"
            :key="item.id">
          <template v-if="index<3">
            {{index+1+'. '}}{{item.name+' - '}} {{item.ar|convertSinger}}
          </template>
        </li>
      </ul>
    </router-link>

  </div>
</template>
<script>
import 'common/js/convert.js'
import { mapMutations } from 'vuex'
export default {
  props: {
    rankingObj: Object
  },
  methods: {
    ...mapMutations(['setRank']),
    // 选择排行榜进入歌单详情
    selectItem (item) {
      this.setRank(true)
      this.$router.push({ path: `/songSheetDisc/${item.id}` })
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.official-list-container {
  margin-bottom: 0.3rem;

  .official-list {
    display: flex;
    width: 100%;
    box-shadow: 0 0.02rem 0.2rem rgba(0, 0, 0, 0.1);
    border-radius: 0.2rem;
    padding: 0.3rem;
    box-sizing: border-box;

    .official-list-img {
      width: 2rem;
      height: 2rem;
      border-radius: 0.2rem;
      margin-right: 0.3rem;

      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 0.2rem;
      }
    }

    .official-list-info {
      width: 5.5rem;

      .official-list-item {
        color: #000;
        line-height: 0.7rem;
        word-wrap: break-word;
        no-wrap();
      }
    }
  }
}
</style>