<template>
  <div class="editNikename-container">
    <van-sticky>
      <van-nav-bar :title="$route.meta.title"
                   left-arrow
                   @click-left="routerBack"
                   @click-right="save"
                   right-text="保存" />
    </van-sticky>

    <van-cell-group>
      <van-field v-model="nickname"
                 label="昵称"
                 clearable
                 :error-message="nicknameErr"
                 placeholder="请输入昵称"
                 maxlength="16" />
    </van-cell-group>
  </div>
</template>
<script>
import { checkIsNull, checkNickname, NIKENAME_VALID_TEXT } from 'common/js/valid.js'
import userApi from '@/api/user.js'
export default {
  name: 'editNickname',
  data () {
    return {
      nickname: this.$route.params.nickname,
      nicknameErr: ''
    }
  },
  mounted () {
    console.log(this.$route.params)
    if (!this.nickname) {
      this.$router.back()
    }
  },
  methods: {
    // 返回上一个路由
    routerBack () {
      this.$route.meta.isBack = true
      this.$utils.routerBack()
    },
    valid () {
      // 昵称
      if (checkIsNull(this.nickname)) {
        this.$toast('昵称不能为空')
        this.nicknameErr = NIKENAME_VALID_TEXT
        return false
      } else if (!checkNickname(this.nickname)) {
        this.nicknameErr = NIKENAME_VALID_TEXT
        return false
      }
      // 清空错误提示
      this.nicknameErr = ''
      return true
    },
    // 保存修改昵称
    async save () {
      if (this.valid()) { // 验证成功
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          message: '保存中...'
        })
        try {
          // 执行修改昵称方法
          const { data: res } = await userApi.updateUserInfo({ nickname: this.nickname })
          if (res.code === 200) {
            // 修改成功就跳转到个人信息页
            this.$toast('修改成功')
            this.$router.replace('/user/edit')
            this.$router.go(-1)// 这里执行go是为了解决需要返回两次才能回退上一个页面的问题
          } else {
            this.$toast(res.data.message)
          }
        } catch (error) {
          this.nicknameErr = error.data.message
          this.$toast(error.data.message)
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.editNikename-container {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: $color-common-background;
}

.editNikename-container>>>.van-nav-bar__text {
  color: $color-common;
}
</style>