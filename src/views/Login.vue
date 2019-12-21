<template>
  <transition name="fade"
              mode="out-in"
              appear>
    <div class="login-container">
      <div class="container">
        <!-- logo -->
        <div class="logo">
          <img src="../assets/images/Logo.png" />
        </div>
        <!-- 标题 -->
        <div class="title">
          <h1 class="title-top">Sign In</h1>
          <p class="title-Bottom">Login to continue your account</p>
        </div>

        <!-- 登录表单 -->
        <form class="login-form">
          <!-- 用户名 -->
          <div class="form-item">
            <input type="text"
                   class="userInput"
                   placeholder="Username" />
          </div>
          <!-- 密码 -->
          <div class="form-item">
            <input type="password"
                   class="pwdInput"
                   placeholder="Password" />
          </div>

          <!-- 登录 -->
          <div class="form-item">
            <input type="submit"
                   class="submitBtn"
                   value="Login" />
          </div>
        </form>
        <!-- 去注册 -->
        <div class="other-wrapper">
          <span>Don`t have an account?</span>
          <router-link to="/Register">Sign up</router-link>
        </div>
      </div>

    </div>
  </transition>
</template>
<script>
export default {

}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

// 入场动画
.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 1s;
}

.login-container {
  padding: 2rem;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  background-color: $color-common-background;

  .container {
    .title {
      text-align: center;
      margin-bottom: 2rem;

      .title-top {
        margin-bottom: 1rem;
        font-weight: bolder;
        color: $color-login-text;
      }

      .title-Bottom {
        font-size: $font-size-small;
        color: #7d7b91;
      }
    }

    .logo {
      margin: 1.5rem 0;
      width: 100%;
      text-align: center;

      img {
        width: 4rem;
      }
    }

    .login-form {
      display: flex;
      flex-direction: column;

      .form-item {
        margin-bottom: 1rem;
        padding-bottom: 0.4rem;
        border-bottom: 1px solid #e8e8e8;
        font-size: $font-size-small;

        input {
          width: 100%;
          outline: 0;
          background: none;
          border: none;
        }

        &:last-child {
          border-bottom: none;
        }

        .submitBtn {
          padding: 0.5rem 0;
          width: 100%;
          color: #fff;
          font-size: $font-size-small;
          border-radius: 1rem;
          background: $color-common;
          box-shadow: 0 0.4rem 1.2rem #F4B3C5;
        }
      }
    }

    .other-wrapper {
      font-size: $font-size-small;
      text-align: center;

      span {
        color: #7d7b91;
        margin-right: 0.2rem;
      }

      a {
        color: #23203f;
        font-weight: bolder;
      }
    }
  }
}
</style>