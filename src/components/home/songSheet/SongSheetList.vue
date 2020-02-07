<template>
  <div class="songs-sheet-list-container">

    <slot></slot>
    <van-loading v-if="this.songSongList.length===0&&!this.msg"
                 size="24px"
                 color="#FD4979"
                 class="load"
                 vertical>加载中...</van-loading>
    <div v-if="this.msg"
         class="songs-sheet-list-zw">
      暂时还没有相关歌单哦~
    </div>
    <template v-if="this.songSongList.length!==0">
      <ul class="songs-sheet-list">
        <li @click="selectItem(item)"
            class="songs-sheet-list-item"
            v-for="item in songSongList"
            :key="item.id">
          <song-sheet-item :song-sheet="item"></song-sheet-item>
        </li>
      </ul>
    </template>
  </div>
</template>
<script>

import SongSheetItem from './SongSheetItem'
import { mapActions, mapMutations } from 'vuex'
export default {
  props: {
    title: String, // 标题
    list: Array// 列表
  },
  data () {
    return {
      newList: [], // 新查询的列表
      msg: ''// 查询数据响应的信息
    }
  },
  computed: {
    songSongList () {
      return this.title ? this.newList : this.list
    }
  },
  methods: {
    ...mapActions(['getSongSheet']),
    ...mapMutations(['setRank']),
    // 选择歌单进入歌单详情
    selectItem (item) {
      this.setRank(false)// 不需要排行
      this.$router.push(`/songSheetDisc/${item.id}`)
    }
  },
  mounted () {
    if (this.title) {
      console.log(this.title)
      // 根据名称获取列表
      this.getSongSheet({ tag: this.title }).then((res) => {
        if (res.msg) {
          this.msg = res.msg
        } else {
          this.newList = res.playlists
        }
      })
    }
  },

  components: {
    SongSheetItem
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.songs-sheet-list-container {
  width: 100%;

  .songs-sheet-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 0.4rem;

    .songs-sheet-list-item {
      width: 46%;
      margin-bottom: 0.6rem;
    }
  }

  .songs-sheet-list-zw {
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    color: $color-common-b;
    font-size: $font-size-smaller;
    text-align: center;
  }
}
</style>