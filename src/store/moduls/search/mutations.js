export default {
  // 设置搜索关键词
  setSearchKeywords(state, keywords) {
    state.searchKeywords = keywords
  },
  // 设置搜索页当前索引
  setSearchCurrentIndex(state, index) {
    state.searchCurrentIndex = index
  },
  // 设置显示搜索列表
  setShowSearchList(state, showSearchList) {
    state.showSearchList = showSearchList
  }
}
