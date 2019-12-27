<template>
  <div class="singer-list-item-container">
    <div class="singer-list-item">
      <!-- 歌手头像 -->
      <div class="singer-avatar">
        <avatar></avatar>
      </div>
      <!-- 歌手姓名 -->
      <p class="singer-name">隔壁老樊</p>
    </div>
  </div>

</template>
<script>
import Avatar from '../avatar/Avatar'
export default {
  components: {
    Avatar
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-list-item-container {
  .singer-list-item {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 0.3rem;

    .singer-avatar {
      margin-right: 0.5rem;
    }

    .singer-name {
      font-size: $font-size-smaller;
      color: #999;
    }
  }
}
</style>