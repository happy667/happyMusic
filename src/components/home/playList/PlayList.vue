<template>
  <div class="play-list-container">
    <p-l-header></p-l-header>
    <p-l-section ></p-l-section>
  </div>
</template>
<script>
import PLHeader from './header/Header'
import PLSection from './section/Section'
export default {
  components: {
    PLHeader,
    PLSection
  }
}
</script>
<style lang="stylus" scoped>
.play-list-container {
  width: 100%;
  background: #fff;
}
</style>