<template>
  <div class="singer-container">
    <ul class="singer-list">
      <li class="singer-list-item">
        <!-- 歌手头像 -->
        <div class="singer-avatar">
          <img src="http://p3.music.126.net/Xl0WENt4F6wsgjjjQWuQsw==/109951164232034479.jpg?param=50y50" />
        </div>
        <!-- 歌手姓名 -->
        <p class="singer-name">隔壁老樊</p>
      </li>
      <li class="singer-list-item">
        <!-- 歌手头像 -->
        <div class="singer-avatar">
          <img src="http://p3.music.126.net/Xl0WENt4F6wsgjjjQWuQsw==/109951164232034479.jpg?param=50y50" />
        </div>
        <!-- 歌手姓名 -->
        <p class="singer-name">隔壁老樊</p>
      </li>
      <li class="singer-list-item">
        <!-- 歌手头像 -->
        <div class="singer-avatar">
          <img src="http://p3.music.126.net/Xl0WENt4F6wsgjjjQWuQsw==/109951164232034479.jpg?param=50y50" />
        </div>
        <!-- 歌手姓名 -->
        <p class="singer-name">隔壁老樊</p>
      </li>
      <li class="singer-list-item">
        <!-- 歌手头像 -->
        <div class="singer-avatar">
          <img src="http://p3.music.126.net/Xl0WENt4F6wsgjjjQWuQsw==/109951164232034479.jpg?param=50y50" />
        </div>
        <!-- 歌手姓名 -->
        <p class="singer-name">隔壁老樊</p>
      </li>
      <li class="singer-list-item">
        <!-- 歌手头像 -->
        <div class="singer-avatar">
          <img src="http://p3.music.126.net/Xl0WENt4F6wsgjjjQWuQsw==/109951164232034479.jpg?param=50y50" />
        </div>
        <!-- 歌手姓名 -->
        <p class="singer-name">隔壁老樊</p>
      </li>
      <li class="singer-list-item">
        <!-- 歌手头像 -->
        <div class="singer-avatar">
          <img src="http://p3.music.126.net/Xl0WENt4F6wsgjjjQWuQsw==/109951164232034479.jpg?param=50y50" />
        </div>
        <!-- 歌手姓名 -->
        <p class="singer-name">隔壁老樊</p>
      </li>
    </ul>
  </div>

</template>
<script>
export default {

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-container {
  .singer-list {
    padding:0.5rem;

    .singer-list-item {
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom: 0.3rem;

      .singer-avatar {
        margin-right: 0.5rem;
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 50%;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .singer-name {
        font-size: $font-size-smaller;
        color: #999;
      }
    }
  }
}
</style>