import Vue from 'vue'
// 过滤播放次数
Vue.filter('convert', (num) => {
  let number = num.toString()
  return number.length < 4 ? number : parseInt(number / 10000) + '万'
})
// 过滤歌手
Vue.filter('convertSinger', (item) => {
  return item.map(item => item.name).join('/')
})
