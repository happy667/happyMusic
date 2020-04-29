<template>
  <div class="register-container">
    <div class="container">
      <!-- logo -->
      <div class="logo">
        <img src="@/assets/images/logo.png" />
      </div>
      <!-- 注册表单 -->
      <div class="register-form">
        <van-cell-group>
          <van-field v-model="registerForm.nikeName"
                     required
                     label="用户名"
                     :error-message="nikeNameErrMsg"
                     placeholder="请输入用户名"
                     maxlength="16" />
          <van-field v-model="registerForm.phone"
                     required
                     type="tel"
                     label="手机号"
                     placeholder="请输入手机号"
                     :error-message="phoneErrMsg"
                     maxlength="11" />
          <van-field v-model="password1"
                     required
                     label="密码"
                     maxlength="16"
                     :error-message="pwdErrMsg1"
                     :type="pwdType"
                     :right-icon="pwdIcon"
                     @click-right-icon="handleShowPwd"
                     placeholder="请输入密码" />
          <van-field v-model="password2"
                     required
                     label="确认密码"
                     :error-message="pwdErrMsg2"
                     maxlength="16"
                     type="password"
                     placeholder="请输入确认密码" />
          <van-field v-model="registerForm.captcha"
                     required
                     center
                     clearable
                     type="tel"
                     maxlength="4"
                     label="短信验证码"
                     placeholder="请输入短信验证码">
            <van-button slot="button"
                        color="#FD4979"
                        size="small"
                        type="primary"
                        :disabled="isDisabled "
                        @click="handleSendSms">{{sendText}}
            </van-button>
          </van-field>
        </van-cell-group>

        <!-- 注册 -->
        <div class="register"
             @click="handleRegister">
          <btn text="注册"></btn>
        </div>
        <!-- 去登陆 -->
        <div class="other-wrapper">
          <span>已经有账号了?</span>
          <router-link to="/appIndex/login"
                       replace>去登陆</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Btn from '@/components/common/Button'
import { checkIsNull, checkPhone, checkPassword, checkNickname, NIKENAME_VALID_TEXT, PASSWORD_VALID_TEXT, compare } from 'common/js/valid.js'
import registerApi from '@/api/register.js'
import {
  ERR_OK
} from '@/api/config.js'
export default {
  name: 'register',
  data () {
    return {
      registerForm: {
        nikeName: '', // 用户名
        phone: '', // 手机号
        password: '', // 密码
        captcha: ''// 验证码
      },
      password1: '', // 输入密码
      password2: '', // 输入确认密码
      showPassword: false, // 显示密码
      isDisabled: false, // 是否禁用按钮
      time: 2 * 60 * 1000, // 倒计时
      sendText: '发送验证码',
      phoneErrMsg: '', // 手机号错误提示
      pwdErrMsg1: '', // 密码错误提示
      pwdErrMsg2: '', // 确认密码错误提示
      nikeNameErrMsg: ''// 用户名错误提示
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
  watch: {
    isDisabled () {
      if (this.isDisabled) { // 已经禁用按钮就倒计时
        this.timer = this.cutDown(this.time)
      } else { // 清除倒计时
        clearInterval(this.timer)
      }
    }
  },
  methods: {
    cutDown (time) {
      let newTime = time / 1000
      return setInterval(() => {
        newTime--
        this.sendText = newTime + 's'
      }, 1000)
    },
    // 表单验证
    validForm () {
      // 用户名
      if (checkIsNull(this.registerForm.nikeName)) {
        this.$toast('昵称不能为空')
        this.nikeNameErrMsg = NIKENAME_VALID_TEXT
        return false
      }
      // 手机号
      if (checkIsNull(this.registerForm.phone)) {
        this.$toast('手机号不能为空')
        return false
      }
      // 密码
      if (checkIsNull(this.password1)) {
        this.$toast('密码不能为空')
        this.pwdErrMsg1 = PASSWORD_VALID_TEXT
        return false
      }
      // 确认密码
      if (checkIsNull(this.password2)) {
        this.$toast('确认密码不能为空')
        return false
      }
      // 验证码
      if (checkIsNull(this.registerForm.captcha)) {
        this.$toast('验证码不能为空')
        return false
      }
      // 验证用户名
      if (!checkNickname(this.registerForm.nikeName)) {
        this.nikeNameErrMsg = NIKENAME_VALID_TEXT
        return false
      }
      // 验证手机号
      if (!checkPhone(this.registerForm.phone)) {
        this.phoneErrMsg = '手机号格式有误, 请输入正确的手机号'
        return false
      }
      // 验证密码
      if (!checkPassword(this.password1)) {
        this.pwdErrMsg1 = PASSWORD_VALID_TEXT
        return false
      }
      // 比较二次密码
      if (!compare(this.password1, this.password2)) {
        this.pwdErrMsg2 = '两次密码输入不一致'
        return false
      }
      // 清空错误提示
      this.phoneErrMsg = ''
      this.pwdErrMsg1 = ''
      this.pwdErrMsg2 = ''
      return true
    },
    // 重置表单
    resetForm () {
      this.registerForm = {
        nikeName: '', // 用户名
        phone: '', // 手机号
        password: '', // 密码
        captcha: ''// 验证码
      }
      this.password1 = '' // 输入密码
      this.password2 = '' // 输入确认密码
    },
    // 注册
    handleRegister () {
      if (this.validForm()) { // 验证用户输入
        this.$toast.loading({
          message: '正在注册...',
          duration: 10000,
          forbidClick: true
        })
        this.registerForm.password = this.password1
        // 检查手机号是否已经注册
        registerApi.checkRegister(this.registerForm.phone).then(res => {
          if (res.data.code === ERR_OK) {
            if (res.data.exist !== 1) { // 不存在
              // 检查验证码是否输入正确
              registerApi.checkSms(this.registerForm.phone, this.registerForm.captcha).then(res => {
                if (res.data.code === ERR_OK) {
                  // 注册
                  registerApi.register(this.registerForm).then(res => {
                    console.log(res)
                    if (res.data.code === ERR_OK) {
                      this.$toast.clear()
                      // this.$utils.alert({
                      //   message: '注册成功，快去登陆吧'
                      // }).then(() => {
                      //   this.$router.push('/appIndex/login')
                      // })
                      // // 清空表单
                      // this.resetForm()
                    }
                  })
                } else {
                  this.$toast(res.data.message)
                }
              }).catch(res => {
                this.$toast('验证码错误,请发送验证码至您的手机')
              })
            } else {
              this.$toast.clear()
              this.$utils.alert({
                message: '该手机号已经注册'
              })
              // 清空表单
              this.resetForm()
            }
          }
        })
      }
    },
    // 显示隐藏密码
    handleShowPwd () {
      this.showPassword = !this.showPassword
    },
    // 发送验证码
    handleSendSms () {
      if (checkIsNull(this.registerForm.phone)) { // 验证手机号是否输入
        this.$toast('手机号不能为空')
      } else if (!checkPhone(this.registerForm.phone)) { // 验证手机号格式
        this.$toast('手机号格式有误')
      } else { // 发送验证码
        registerApi.sendSms(this.registerForm.phone).then(res => {
          if (res.data.code === ERR_OK) {
            this.isDisabled = true
            this.$toast('验证码已发送至您的手机,请注意查收')
            // 恢复按钮状态
            setTimeout(() => {
              this.isDisabled = false
              this.sendText = '发送验证码'
            }, this.time)
          }
        }).catch(() => {
          this.$toast('验证码发送失败')
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

.register-container {
  width: 100%;
  height: 100vh;

  .container {
    display: flex;
    flex-direction: column;

    .logo {
      position: relative;
      margin: 1.5rem auto 0.9rem;
      width: 3.2rem;
      text-align: center;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .register-form>>>.van-cell {
      margin-bottom: 0.35rem;
    }

    .register-form {
      display: flex;
      flex-direction: column;
      padding: 0.4rem 0.5rem;

      .register {
        padding: 0 1rem;
        margin-bottom: 0.45rem;
        width: 100%;
        box-sizing: border-box;
      }
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