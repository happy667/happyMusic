<template>
  <div class="ranking-container">
    <ranking-list></ranking-list>
    <ranking-list></ranking-list>
    <ranking-list></ranking-list>
    <ranking-list></ranking-list>
    <ranking-list></ranking-list>
    <ranking-list></ranking-list>
    <ranking-list></ranking-list>
  </div>
</template>
<script>
import RankingList from './ranking/RankingList'
export default {
  components: {
    RankingList
  }
}
</script>
<style lang="stylus" scoped>
.ranking-container {
  width: 100%;
  height: 100%;
  padding: 0.3rem 0.5rem;
  box-sizing: border-box;
}
</style>