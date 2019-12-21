<template>
  <div class="index-container">
    <!-- logo -->
    <transition name="fade"
                mode="out-in"
                appear>
      <div class="logo">
        <img src="../assets/images/LogoIndex.png" />
      </div>
    </transition>

    <!-- 操作 -->
    <div class="option">
      <!-- 登录 -->
      <transition name="fadeOption1"
                  mode="out-in"
                  appear>
        <router-link to="/Login">登录</router-link>
      </transition>
      <transition name="fade"
                  mode="out-in"
                  appear>
        <p>OR</p>
        <!-- 注册 -->
      </transition>
      <transition name="fadeOption2"
                  mode="out-in"
                  appear>
        <router-link to="/Register">注册</router-link>
      </transition>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.index-container {
  padding: 3.5rem 2rem 2rem 2rem;
  width: 100%;
  box-sizing: border-box;
  background-color: $color-common-background;

  .logo {
    margin: 0 auto;
    margin-bottom: 2.5rem;
    width: 9rem;
    height: 100%;
    text-align: center;

    img {
      width: 100%;
    }
  }

  .fade-enter {
    opacity: 0;
  }

  .fade-enter-active {
    transition: opacity 2s;
  }

  .option {
    display: flex;
    height: 10rem;
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
      box-shadow: 0 0.4rem 1.2rem #F4B3C5;
    }

    p {
      color: $color-common;
      font-weight: bolder;
      font-size: $font-size-small;
    }

    .fadeOption1-enter-active, .fadeOption2-enter-active {
      transition: transform 1s;
    }

    .fadeOption1-enter {
      transform: translate3d(-150%, 0, 0);
    }

    .fadeOption2-enter {
      transform: translate3d(150%, 0, 0);
    }
  }
}
</style>
