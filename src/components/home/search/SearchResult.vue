<template>
  <div class="search-result-container">
    <!-- 标签页 -->
    <van-tabs v-model="currentIndex"
              title-active-color="#FD4979"
              color="#FD4979"
              animated
              swipeable>
      <!-- 单曲页 -->
      <van-tab title="单曲">
        <song @closeList="closeSearchList" />
      </van-tab>
      <!-- 歌手页 -->
      <van-tab title="歌手">
        <singer />
      </van-tab>
      <!-- 歌单页 -->
      <van-tab title="歌单">
        <SongSheet />
      </van-tab>
      <!-- mv页 -->
      <van-tab title="MV">
        <mv />
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>

import Singer from './searchResult/Singer'
import Song from './searchResult/Song'
import SongSheet from './searchResult/SongSheet'
import Mv from './searchResult/MV'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'searchResult',
  computed: {
    ...mapState(['searchKeywords', 'searchCurrentIndex', 'showSearchList']),
    currentIndex: {
      get () {
        return this.searchCurrentIndex
      },
      set (index) {
        this.setSearchCurrentIndex(index)
      }
    }
  },
  methods: {
    ...mapMutations(['setSearchCurrentIndex', 'setShowSearchList']),
    // 关闭搜索列表
    closeSearchList () {
      if (this.showSearchList) {
        this.setShowSearchList(false)
      }
    }
  },
  mouted () {
    console.log(11111)
    if (!this.searchKeywords) {
      this.$router.push('/search/searchPage')
    }
  },
  components: {
    Song,
    Singer,
    SongSheet,
    Mv
  }
}
</script>
<style lang="stylus">
.search-result-container {
  width: 100%;
}
</style>