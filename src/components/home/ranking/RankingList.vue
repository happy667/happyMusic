<template>
  <div class="rankingList-container">
    <router-link to="/songSheetInfo"
                 tab="div"
                 class="ranking-list">
      <!-- 排行列表图片 -->
      <div class="ranking-list-img">
        <img src="http://p2.music.126.net/DrRIg6CrgDfVLEph9SNh7w==/18696095720518497.jpg?param=150y150" />
      </div>
      <!-- 歌曲排名 -->
      <ul class="ranking-list-info">
        <li class="ranking-list-item">1.别再对我好-Uu12321312312323213122132132132</li>
        <li class="ranking-list-item">1.别再对我好-Uu</li>
        <li class="ranking-list-item">1.别再对我好-Uu</li>
      </ul>
    </router-link>

  </div>
</template>
<script>
export default {

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.rankingList-container {
  margin-bottom: 0.5rem;

  .ranking-list {
    display: flex;
    width: 100%;
    box-shadow: 0 0.02rem 0.2rem rgba(0, 0, 0, 0.1);
    border-radius: 0.2rem;
    padding: 0.3rem;
    box-sizing: border-box;

    .ranking-list-img {
      width: 2rem;
      height: 2rem;
      border-radius: 0.2rem;
      margin-right: 0.3rem;

      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 0.2rem;
      }
    }

    .ranking-list-info {
      width: 5.5rem;

      .ranking-list-item {
        color: #000;
        line-height: 0.7rem;
        word-wrap: break-word;
        no-wrap();
      }
    }
  }
}

&:last-child {
  margin-bottom: 0;
}
</style>