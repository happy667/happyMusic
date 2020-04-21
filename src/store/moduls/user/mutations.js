export default {
  // 设置登录用户
  setLoginUser(state, user) {
    state.user = user
  },
  // 设置用户喜欢列表
  setUserLikeList(state, userLikeList) {
    state.userLikeList = userLikeList
  },
  // 设置用户每日推荐页当前索引
  setUserRecommendIndex(state, index) {
    state.userRecommendIndex = index
  },
  // 设置token
  setToken(state, token) {
    state.token = token
  }
}
