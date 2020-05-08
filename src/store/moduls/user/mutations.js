export default {
  // 设置登录用户
  setLoginUser(state, user) {
    state.user = user
  },
  // 设置用户喜欢列表
  setUserLikeList(state, userLikeList) {
    state.userLikeList = userLikeList
  },
  // 设置token
  setToken(state, token) {
    state.token = token
  }
}
