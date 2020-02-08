<template>
  <div class="singer-list-item-container"
       @click="selectItem(singer)">
    <div class="singer-list-item">
      <div class="left">
        <!-- 歌手头像 -->
        <div class="singer-avatar">
          <music-img :avatar="singer.avatar"></music-img>
        </div>
        <!-- 歌手姓名 -->
        <div class="singer-name">{{singer.name}}</div>
      </div>

      <div class="right"
           v-if="showFollow">

        <!-- 关注 -->
        <follow @clickFollow="handleClickFollow"
                :followed="singer.followed"></follow>
      </div>
    </div>
  </div>

</template>
<script>
import MusicImg from '../img/MusicImg'
import Follow from '@/components/common/Follow'
import { mapMutations } from 'vuex'
export default {
  props: {
    singer: Object,
    showFollow: {
      type: Boolean,
      default: () => false
    }
  },
  components: {
    MusicImg,
    Follow
  },
  methods: {
    ...mapMutations(['setSingerCurrentIndex']),
    // 选择歌手
    selectItem (item) {
      this.$emit('select', item)
    },
    // 点击关注
    handleClickFollow () {
      this.$emit('clickFollow', this.singer)
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
    justify-content: space-between;
    width: 100%;

    .left {
      display: flex;
      align-items: center;

      .singer-avatar {
        margin-right: 0.5rem;
      }

      .singer-name {
        height: 0.7rem;
        line-height: 0.7rem;
        font-size: $font-size-smaller;
      }
    }

    .right {
    }
  }
}
</style>