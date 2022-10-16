<template>
  <div class="official-list-container"
       @click="selectItem(rankingObj)">
    <router-link to="/songSheetInfo"
                 tab="div"
                 class="official-list">
      <!-- 排行列表图片 -->
      <div class="official-list-img">
        <img v-lazy="rankingObj.coverImgUrl"
             class="animated fadeIn"
             :key="rankingObj.coverImgUrl" />
      </div>
      <!-- 歌曲排名 -->
      <ul class="official-list-info">
        <template v-for="(item,index) in rankingObj.tracks">
          <template v-if="index<3">
            <li class="official-list-item"
                :key="item.id">
              {{index+1+'. '}}{{item.name+' - '}} {{item.ar|convertSinger}}
            </li>
          </template>
        </template>
      </ul>
    </router-link>

  </div>
</template>
<script>
import 'common/js/convert.js'
export default {
  props: {
    rankingObj: Object
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
@import '~common/stylus/variable'
.official-list-container
  margin-bottom 0.3rem
  .official-list
    display flex
    width 100%
    box-shadow 0 0.02rem 0.2rem rgba(0, 0, 0, 0.1)
    border-radius 0.2rem
    padding 0.3rem
    box-sizing border-box
    .official-list-img
      width 2rem
      height 2rem
      border-radius 0.2rem
      margin-right 0.3rem
      background-color $color-common-b
      img
        display block
        width 100%
        height 100%
        border-radius 0.2rem
    .official-list-info
      display flex
      flex-direction column
      justify-content space-between
      flex 1
      overflow hidden
      .official-list-item
        color #000
        height 0.6rem
        line-height 0.6rem
        word-wrap break-word
        no-wrap()
</style>