<template>

  <div class="login-container">
    <div class="container">
      <!-- logo -->
      <div class="logo">
        <img src="@/assets/images/logo.png" />
      </div>
      <!-- 登录表单 -->
      <div class="login-form">
        <van-cell-group>
          <van-field v-model="loginForm.phone"
                     type="tel"
                     label="手机号"
                     :error-message="phoneErrMsg"
                     placeholder="请输入手机号"
                     maxlength="11" />
          <van-field v-model="loginForm.password"
                     size="large"
                     label="密码"
                     maxlength="16"
                     :type="pwdType"
                     :right-icon="pwdIcon"
                     :error-message="pwdErrMsg"
                     @click-right-icon="handleShowPwd"
                     placeholder="请输入密码" />
        </van-cell-group>
        <!-- 忘记密码 -->
        <div class="remember-pwd">
          <router-link to="/appIndex/findPassword">忘记密码?</router-link>
        </div>
        <!-- 登录 -->
        <div class="login"
             @click="handleLogin">
          <btn text="登录"></btn>
        </div>
        <!-- 去注册 -->
        <div class="other-wrapper">
          <span>还没有账号?</span>
          <router-link to="/appIndex/register"
                       replace>去注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Btn from '@/components/common/Button'
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
import { checkIsNull, checkPhone, checkPassword, PASSWORD_VALID_TEXT } from 'common/js/valid.js'
import { mapMutations } from 'vuex'

export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        phone: '',
        password: ''
      },
      showPassword: false, // 显示密码
      phoneErrMsg: '', // 手机号错误提示
      pwdErrMsg: ''// 密码错误提示
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
    ...mapMutations(['setLoginUser', 'setToken', 'setIsAdvance']),
    // 显示隐藏密码
    handleShowPwd () {
      this.showPassword = !this.showPassword
    },
    // 重置表单
    resetForm () {
      this.loginForm = {
        phone: '',
        password: ''
      }
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
        this.pwdErrMsg = PASSWORD_VALID_TEXT
        return false
      }
      // 验证手机号
      if (!checkPhone(this.loginForm.phone)) {
        this.phoneErrMsg = '手机号格式有误, 请输入正确的手机号'
        return false
      }
      // 验证密码
      if (!checkPassword(this.loginForm.password)) {
        this.pwdErrMsg = PASSWORD_VALID_TEXT
        return false
      }
      // 清空错误提示
      this.phoneErrMsg = ''
      this.pwdErrMsg = ''
      return true
    },
    // 登录
    handleLogin () {
      if (this.validForm()) {
        this.$toast.loading({
          message: '登陆中...',
          duration: 10000,
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
              this.$router.go(-1)// 这里执行go是为了解决需要返回两次才能回退上一个页面的问题
            } else {
              this.$router.replace('/home')
            }
            // 设置为前进页面
            this.setIsAdvance(true)
            this.resetForm()
            this.$toast.clear()
          } else {
            console.log(123)
            this.$toast(res.data.message)
          }
        }).catch(error => {
          this.$toast(error.data.message)
        })
      }
    }
  },
  components: {
    Btn
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

      .login {
        margin-bottom: 0.45rem;
        width: 100%;
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