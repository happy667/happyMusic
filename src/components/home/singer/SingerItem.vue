<template>
  <div class="singer-list-item-container"
       @click.stop="selectItem(singer)">
    <div class="singer-list-item">
      <div class="left">
        <!-- 歌手头像 -->
        <div class="singer-avatar">
          <my-image :src="avatar" />
        </div>
        <!-- 歌手姓名 -->
        <div class="singer-name">{{singerName}}</div>
      </div>

      <div class="right"
           v-if="showFollow">

        <!-- 收藏 -->
        <follow @clickFollow="handleClickFollow"
                :followed="singer.followed"></follow>
      </div>
    </div>
  </div>

</template>
<script>
import MyImage from '@/components/common/img/Image'
import Follow from '@/components/common/Follow'
import {
  DEFAULT_SINGER_IMAGE
} from '@/assets/common/js/config.js'
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
    MyImage,
    Follow
  },
  computed: {
    avatar () {
      return this.singer.avatar ? this.singer.avatar : DEFAULT_SINGER_IMAGE
    },
    singerName () {
      let aliaName = ''
      if (this.singer.aliaName) {
        aliaName = ' (' + this.singer.aliaName + ')'
      }
      return this.singer.name + aliaName
    }
  },
  methods: {
    ...mapMutations(['setSingerCurrentIndex']),
    // 选择歌手
    selectItem (item) {
      this.$emit('select', item)
    },
    // 点击收藏
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
        max-width: 5rem;
        no-wrap();
      }
    }
  }
}
</style>