const SET_MAX_LENGTH = 10
const LOCAL_LIST_NAME = 'localSearchList'
export function addLocalSearch(value) {
  // 添加到本地历史搜索列表
  let arr = getItem(LOCAL_LIST_NAME)
  if (!arr) { // 如果本地中还没有该搜索列表就初始化一个数组
    arr = []
  }
  // 查询该搜索内容是否存在
  let index = arr.findIndex(item => item === value)
  if (index === -1) { // 不存在就添加
    arr.unshift(value)
  }
  if (arr.length > SET_MAX_LENGTH) { // 当搜索内容超过最大值时弹出最后一个
    arr.pop()
  }
  setItem(LOCAL_LIST_NAME, arr) // 最后将该历史搜索列表添加到本地存储中
}
// 移除本地存储搜索列表
export function clearLocalList() {
  window.localStorage.removeItem(LOCAL_LIST_NAME)
}
// 获取本地存储搜索列表
export function getLocalList() {
  return JSON.parse(window.localStorage.getItem(LOCAL_LIST_NAME))
}
// 获取本地存储搜索列表
function getItem(item) {
  return JSON.parse(window.localStorage.getItem(item))
}
// 设置本地存储搜索列表
function setItem(item, value) {
  window.localStorage.setItem(item, JSON.stringify(value))
}
