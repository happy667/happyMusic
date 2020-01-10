import Vue from 'vue'
// 过滤播放次数
Vue.filter('convertPlayCount', (num) => {
  let number = num.toString()
  return number.length <= 4 ? number : parseInt(number / 10000) + '万'
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
Vue.filter('converPlayTime', (time) => {
  let h = Math.floor(time / 3600).toString().padStart(2, '0')
  let m = Math.floor(time % 3600 / 60).toString().padStart(2, '0')
  let s = Math.floor(time % 60).toString().padStart(2, '0')
  return h === '00' ? `${m}:${s}` : `${h}:${m}:${s}`
})
