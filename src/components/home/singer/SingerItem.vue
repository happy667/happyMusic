<template>
  <div class="singer-list-item-container"
       @click="selectItem(singer)">
    <div class="singer-list-item">
      <!-- 歌手头像 -->
      <div class="singer-avatar">
        <music-img :avatar="singer.avatar"></music-img>
      </div>
      <!-- 歌手姓名 -->
      <p class="singer-name">{{singer.name}}</p>
    </div>
  </div>

</template>
<script>
import MusicImg from '../img/MusicImg'
import { mapMutations } from 'vuex'
export default {
  props: {
    singer: Object
  },
  components: {
    MusicImg
  },
  methods: {
    ...mapMutations(['setSingerCurrentIndex']),
    // 选择歌手
    selectItem (item) {
      this.$emit('select', item)
    }
  }

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-list-item-container {
  padding: 0.25rem 0.4rem;

  .singer-list-item {
    display: flex;
    align-items: center;
    width: 100%;

    .singer-avatar {
      margin-right: 0.5rem;
    }

    .singer-name {
      height: 0.7rem;
      line-height: 0.7rem;
      font-size: $font-size-smaller;
    }
  }
}
</style>