<template>
  <!-- 歌手简介 -->
  <div class="singer-synopsis-container">
    <template v-if="imageUrl">
      <!-- 歌手图片 -->
      <div class="singer-img"
           @click="handleClick">
        <div id="image"
             class="animated fadeIn">
          <van-image :src="imageUrl"
                     fit="cover">
            <template v-slot:loading>
              <van-loading type="spinner"
                           size="20" />
            </template>
          </van-image>
        </div>
      </div>
    </template>
</div>
</template>
<script>
export default {
  name: 'singerImage',
  props: {
    imageUrl: String
  },
  methods: {
    handleClick () {
      this.$emit('toggle', this.imageUrl)
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-synopsis-container>>>.singer-img>#image>.van-image {
  width: 100%;
  height: 100%;
}

.singer-synopsis-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 6.7rem;
  background: $color-common-b;

  .singer-img {
    position: absolute;
    top: 0;
    width: 100%;
    height: 6.7rem;
    background: #fff;

    #image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>