<template>
  <div class="editPassword-container">
    <!-- 头部导航 -->
    <van-sticky>
      <van-nav-bar :title="$route.meta.title"
                   left-arrow
                   @click-left="routerBack"
                   @click-right="save"
                   right-text="保存" />
    </van-sticky>

    <div class="find-password-form">
      <van-cell-group>
        <van-field v-model="updateForm.phone"
                   required
                   type="tel"
                   label="手机号"
                   placeholder="请输入手机号"
                   :error-message="phoneErrMsg"
                   maxlength="11" />
        <van-field v-model="updateForm.password"
                   required
                   label="新密码"
                   maxlength="16"
                   :type="pwdType"
                   :right-icon="pwdIcon"
                   :error-message="pwdErrMsg"
                   @click-right-icon="handleShowPwd"
                   placeholder="请输入密码" />
        <van-field v-model="updateForm.captcha"
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
    </div>
  </div>
</template>
<script>
import { checkIsNull, checkPassword, checkPhone, PASSWORD_VALID_TEXT } from 'common/js/valid.js'
import registerApi from '@/api/register.js'
import {
  ERR_OK
} from '@/api/config.js'
export default {
  name: 'editPassword',
  data () {
    return {
      updateForm: {
        phone: '', // 手机号
        password: '', // 密码
        captcha: ''// 验证码
      },
      showPassword: false, // 显示密码
      isDisabled: false, // 是否禁用按钮
      time: 2 * 60 * 1000, // 倒计时
      sendText: '发送验证码',
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
    // 返回上一个路由
    routerBack () {
      this.$route.meta.isBack = true
      this.$utils.routerBack()
    },
    // 表单验证
    validForm () {
      // 手机号
      if (checkIsNull(this.updateForm.phone)) {
        this.$toast('手机号不能为空')
        return false
      }
      // 密码
      if (checkIsNull(this.updateForm.password)) {
        this.$toast('密码不能为空')
        this.pwdErrMsg = PASSWORD_VALID_TEXT
        return false
      }
      // 验证码
      if (checkIsNull(this.updateForm.captcha)) {
        this.$toast('验证码不能为空')
        return false
      }
      // 验证手机号
      if (!checkPhone(this.updateForm.phone)) {
        this.phoneErrMsg = '手机号格式有误, 请输入正确的手机号'
        return false
      }
      // 验证密码
      if (!checkPassword(this.updateForm.password)) {
        this.pwdErrMsg = PASSWORD_VALID_TEXT
        return false
      }
      // 清空错误提示
      this.phoneErrMsg = ''
      this.pwdErrMsg = ''
      return true
    },
    cutDown (time) {
      let newTime = time / 1000
      return setInterval(() => {
        newTime--
        this.sendText = newTime + 's'
      }, 1000)
    },
    // 保存
    save () {
      if (this.validForm()) { // 验证用户输入
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: '保存中...'
        })
        // 检查手机号是否已经注册
        registerApi.checkRegister(this.updateForm.phone).then(res => {
          if (res.data.code === ERR_OK) {
            if (res.data.exist === 1) { // 存在
              // 检查验证码是否输入正确
              registerApi.checkSms(this.updateForm.phone, this.updateForm.captcha).then(res => {
                if (res.data.code === ERR_OK) {
                  // 修改
                  registerApi.register(this.updateForm).then(res => {
                    if (res.data.code === ERR_OK) {
                      this.$toast('修改成功')
                      this.$router.replace('/user/edit')
                      this.$router.go(-1)// 这里执行go是为了解决需要返回两次才能回退上一个页面的问题
                    }
                  })
                }
              }).catch(error => {
                this.$toast(error.data.message)
              })
            } else {
              this.$utils.alert({
                message: '该手机号尚未注册'
              }).then(() => {
                this.$router.push('/appIndex/login')
              })
            }
          } else {
            this.$toast(res.message)
          }
        }).catch(err => {
          this.$toast(err.data.message)
        })
      }
    },
    // 显示隐藏密码
    handleShowPwd () {
      this.showPassword = !this.showPassword
    },
    // 发送验证码
    handleSendSms () {
      if (checkIsNull(this.updateForm.phone)) { // 验证手机号是否输入
        this.$toast('手机号不能为空')
      } else if (!checkPhone(this.updateForm.phone)) { // 验证手机号格式
        this.$toast('手机号格式有误')
      } else { // 发送验证码
        registerApi.sendSms(this.updateForm.phone).then(res => {
          if (res.data.code === ERR_OK) {
            this.isDisabled = true
            this.$toast('验证码已发送至您的手机,请注意查收')
            // 恢复按钮状态
            setTimeout(() => {
              this.isDisabled = false
              this.sendText = '发送验证码'
            }, this.time)
          }
        }).catch(error => {
          this.$toast(error.message)
        })
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.editPassword-container {
  width: 100%;
  min-height: 100vh;
}

.editPassword-container>>>.van-nav-bar__text {
  color: $color-common;
}
</style>