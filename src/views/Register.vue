<template>
  <div class="register-container">
    <div class="container">
      <!-- logo -->
      <div class="logo">
        <img src="../assets/images/Logo.png" />
      </div>
      <!-- 标题 -->
      <div class="title">
        <h1 class="title-top">Sign Up</h1>
        <p class="title-Bottom">Create an account</p>
      </div>
      <!-- 注册表单 -->
      <form class="register-form">
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
        <!-- 确认密码 -->
        <div class="form-item">
          <input type="password"
                 class="pwdInputCfm"
                 placeholder="Comfirm Password" />
        </div>
        <!-- 注册 -->
        <div class="form-item">
          <input type="submit"
                 class="registerBtn"
                 value="Register" />
        </div>
      </form>
      <!-- 去登陆 -->
      <div class="other-wrapper">
        <span>Already have an account?</span>
        <router-link to="/Login">Login</router-link>
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

.register-container {
  width: 100%;

  .container {
    display: flex;
    flex-direction: column;

    .title {
      text-align: center;
      margin-bottom: 1rem;

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
      margin: 0 auto;
      width: 4rem;
      text-align: center;
      margin-bottom: 1.5rem;

      img {
        width: 100%;
      }
    }

    .register-form {
      display: flex;
      flex-direction: column;

      .form-item {
        margin-bottom: 1rem;
        padding-bottom: 0.4rem;
        border-bottom: 1px solid #ccc;
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

        .registerBtn {
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
      line-height: 1rem;

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