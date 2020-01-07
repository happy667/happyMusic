<template>
  <div class="singer-list-item-container">
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
export default {
  props: {
    singer: Object
  },
  components: {
    MusicImg
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-list-item-container {
  padding: 0.25rem 0;

  .singer-list-item {
    display: flex;
    align-items: center;
    width: 100%;

    .singer-avatar {
      margin-right: 0.5rem;
    }

    .singer-name {
      font-size: $font-size-smaller;
    }
  }
}
</style>