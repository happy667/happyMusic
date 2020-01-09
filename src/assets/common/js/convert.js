import Vue from 'vue'
// 过滤播放次数
Vue.filter('convertPlayCount', (num) => {
  let number = num.toString()
  return number.length < 4 ? number : parseInt(number / 10000) + '万'
})
// 过滤歌手
Vue.filter('convertSinger', (item) => {
  return item.map(item => item.name).join('/')
})
Vue.filter('convertTime', (time) => {
  let date = new Date(time)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  return `${year}-${month}-${day}`
})
