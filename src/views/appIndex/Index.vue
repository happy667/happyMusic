<template>
  <div class="index-container">
    <div class="container">
      <!-- logo -->
      <transition name="fade"
                  mode="out-in"
                  appear>
        <div class="logo">
          <img src="@/assets/images/logoIndex.png" />
        </div>
      </transition>

      <!-- 操作 -->
      <div class="option">
        <router-link to="/appIndex/login">登录</router-link>
        <p>OR</p>
        <!-- 注册 -->
        <router-link to="/appIndex/register">注册</router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 1s;
}

.fade-enter-to {
  opacity: 1;
}

.index-container {
  width: 100%;

  .container {
    height: 100%;

    .logo {
      margin: 0 auto;
      width: 9rem;
      height: 8rem;
      text-align: center;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .option {
      display: flex;
      height: 8rem;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      text-align: center;

      a {
        padding: 0.6rem 0;
        width: 8rem;
        color: #fff;
        font-size: $font-size-small;
        border-radius: 1rem;
        background: $color-common;
        box-shadow: 0 0.15rem 0.4rem #F4B3C5;
      }

      p {
        color: $color-common;
        font-weight: bolder;
        font-size: $font-size-small;
      }
    }
  }
}
</style>
