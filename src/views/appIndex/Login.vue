<template>

  <div class="login-container">
    <div class="container">
      <!-- logo -->
      <div class="logo">
        <img src="@/assets/images/Logo.png" />
      </div>
      <!-- 登录表单 -->
      <div class="login-form">
        <van-cell-group>
          <van-field v-model="loginForm.phone"
                     type="tel"
                     label="手机号"
                     placeholder="请输入手机号"
                     maxlength="11" />
          <van-field v-model="loginForm.password"
                     label="密码"
                     maxlength="16"
                     :type="pwdType"
                     :right-icon="pwdIcon"
                     @click-right-icon="handleShowPwd"
                     placeholder="请输入密码" />
        </van-cell-group>
        <!-- 忘记密码 -->
        <div class="remember-pwd">
          <router-link to="/appIndex/findPassword">忘记密码?</router-link>
        </div>
        <!-- 登录 -->
        <div class="submitBtn"
             @click="handleLogin">登录</div>
        <!-- 去注册 -->
        <div class="other-wrapper">
          <span>还没有账号?</span>
          <router-link to="/appIndex/register">去注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import {
  ERR_OK
} from '@/api/config.js'
import {
  setItem
} from 'common/js/localStorage.js'
import {
  USER_TOKEN
} from '@/assets/common/js/config.js'
import loginApi from '@/api/login.js'
import { checkIsNull, checkPhone, checkPassword } from 'common/js/valid.js'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      loginForm: {
        phone: '',
        password: ''
      },
      showPassword: false // 显示密码
    }
  },
  computed: {
    pwdType () {
      return this.showPassword ? 'text' : 'password'
    },
    pwdIcon () {
      return this.showPassword ? 'eye-o' : 'closed-eye'
    }
  },
  methods: {
    ...mapMutations(['setLoginUser', 'setToken']),
    // 显示隐藏密码
    handleShowPwd () {
      this.showPassword = !this.showPassword
    },
    // 表单验证
    validForm () {
      // 手机号
      if (checkIsNull(this.loginForm.phone)) {
        this.$toast('手机号不能为空')
        return false
      }
      // 密码
      if (checkIsNull(this.loginForm.password)) {
        this.$toast('密码不能为空')
        return false
      }
      // 验证手机号
      if (!checkPhone(this.loginForm.phone)) {
        this.$toast('手机号格式有误')
        return false
      }
      // 验证密码
      if (!checkPassword(this.loginForm.password)) {
        this.$toast('密码格式输入有误, 密码必须由字母、数字组成,密码长度为6 - 16位')
        return false
      }
      return true
    },
    // 登录
    handleLogin () {
      if (this.validForm()) {
        this.$toast.loading({
          message: '登陆中...',
          forbidClick: true
        })
        // 验证成功执行登录操作
        loginApi.login(this.loginForm).then(res => {
          if (res.data.code === ERR_OK) { // 登录成功
            // 保存token信息
            setItem(USER_TOKEN, res.data.token)
            this.setToken(res.data.token)
            this.setLoginUser(res.data.profile)

            if (this.$router.currentRoute.query.redirect) { // 跳回到原来页面
              // 使用replace是为了不保留登录页面历史记录
              this.$router.replace(this.$router.currentRoute.query.redirect)
            } else {
              this.$router.replace('/home')
            }
            this.$router.go(-1)// 这里执行go是为了解决需要返回两次才能回退上一个页面的问题
            this.$toast.clear()
          } else {
            this.$toast(res.data.message)
          }
        }).catch(error => {
          console.log(111111)
          this.$toast(error.message)
        })
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.login-container {
  width: 100%;
  height: 100vh;

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;

    .logo {
      position: relative;
      height: 0;
      padding-bottom: 5.5rem;
      margin: 0.7rem auto 0.5rem;
      width: 4rem;
      text-align: center;

      img {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
      }
    }

    .login-form>>>.van-cell {
      margin-bottom: 0.1rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      padding: 0.4rem 0.5rem;

      .submitBtn {
        margin-bottom: 0.45rem;
        padding: 0.5rem 0;
        width: 100%;
        color: #fff;
        font-size: $font-size-small;
        border-radius: 1rem;
        background: $color-common;
        box-shadow: 0 0.4rem 1.2rem #F4B3C5;
        text-align: center;
      }
    }

    .remember-pwd {
      height: 1.5rem;
      line-height: 1.5rem;
      text-align: right;
      font-size: $font-size-smaller;
    }
  }

  .other-wrapper {
    font-size: $font-size-smaller;
    text-align: center;
    line-height: 1rem;
    height: 1rem;

    span {
      color: #7d7b91;
      margin-right: 0.2rem;
    }

    a {
      color: $color-common;
      font-weight: bolder;
      font-family: $font-common;
    }
  }
}
</style>