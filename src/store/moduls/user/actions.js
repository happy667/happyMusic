import loginApi from '@/api/login.js'
import userApi from '@/api/user.js'
import {
  ERR_OK
} from '@/api/config.js'

export default {
  // 获取登录用户信息
  getLoginUserInfo(context) {
    loginApi.loginStatus().then(res => {
      if (res.data.code === ERR_OK) {
        let user = res.data.profile
        context.commit('setLoginUser', user)
        context.dispatch('getUserLikeList', user.userId)
      }
    }).catch(err => console.log(err.data.message))
  },
  // 获取用户喜欢列表
  async getUserLikeList(context, id) {
    const {
      data: res
    } = await userApi.getUserLikeList(id)
    if (res.code === ERR_OK) {
      context.commit('setUserLikeList', res.ids)
    }
  }

}
