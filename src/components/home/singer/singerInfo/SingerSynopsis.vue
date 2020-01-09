<template>
  <!-- 歌手简介 -->
  <div class="singer-synopsis-container">
    <!-- loading -->
    <van-loading v-show="!singer"
                 size="24px"
                 color="#FD4979"
                 vertical>加载中...</van-loading>
    <!-- 歌手图片 -->
    <div class="singer-img">
      <img :src="singer.picUrl">
    </div>
    <!-- 歌手名称 -->
    <div class="singer-name">{{singer.name}}</div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['singer'])
  }

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-synopsis-container {
  width: 100%;
  position: relative;

  .singer-img {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 6rem;
    background: #b0b0b0;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      display: block;
    }
  }

  .singer-name {
    position: absolute;
    bottom: 0.5rem;
    color: #fff;
    width: 100%;
    text-align: center;
    font-size: $font-size-small;
    margin-bottom: 0.2rem;
  }
}
</style>