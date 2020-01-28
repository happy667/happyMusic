<template>
  <div class="no-login-container">
    <div class="text">
      <p>您还未登录</p>
      <p>登录后将为您推荐精彩视频</p>
    </div>
    <div class="btn">
      <van-button color="#FD4979"
                  class="loginBtn"
                  round
                  :to="{name:'login'}">去登录</van-button>
    </div>

  </div>
</template>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.no-login-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .text {
    line-height: 1rem;
    color: $color-common-b;
    font-size: $font-size-smaller;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .btn {
    text-align: center;
  }
}
</style>