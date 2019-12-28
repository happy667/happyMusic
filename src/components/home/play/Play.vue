<template>
  <div class="play-container">
    <!-- 头部导航栏 -->
    <play-header></play-header>
    <!-- 内容区域 -->
    <play-section></play-section>
    <!-- 页面底部 -->
    <play-footer></play-footer>
    <!-- 背景 -->
    <div class="bg"></div>
  </div>
</template>
<script>
import PlayHeader from './header/Header'
import PlaySection from './section/Section'
import PlayFooter from './footer/Footer'
export default {
  components: {
    PlayHeader,
    PlaySection,
    PlayFooter
  }
}
</script>
<style lang="stylus" scoped>
.play-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: transparent url('http://p2.music.126.net/8dzD62VK8jLDbhEqkmpIAg==/18277181788626198.jpg?imageView&thumbnail=360y360&quality=75&tostatic=0') center center no-repeat;
    background-size: 100% 100%;
    filter: blur(5px);
    z-index: -1;
    opacity: 0.5;
  }
}
</style>