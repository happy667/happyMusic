<template>
  <section class="section-container">
    <div class="song-img">
      <img src="http://p2.music.126.net/8dzD62VK8jLDbhEqkmpIAg==/18277181788626198.jpg?imageView&thumbnail=360y360&quality=75&tostatic=0">
    </div>
  </section>
</template>
<script>
export default {

}
</script>
<style lang="stylus" scoped>
.section-container {
  flex: 1;
  width: 100%;
  height: 10rem;
  display: flex;
  justify-content: center;
  align-items: center;

  .song-img {
    width: 6.5rem;
    height: 6.5rem;
    border-radius: 0.3rem;

    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 0.3rem;
    }
  }
}
</style>