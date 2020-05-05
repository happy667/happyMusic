import Vue from 'vue'
// 过滤次数
export function convertCount(num) {
  let number = num.toString()
  console.log(number)
  if (number.length > 8) { // 转换成亿
    number = parseFloat(number / 100000000).toFixed(1) + '亿'
  } else if (number.length > 4) { // 转换成万
    number = parseFloat(number / 10000).toFixed(1) + '万'
  }

  return number
}
Vue.filter('convertCount', convertCount)

export function convertDate(time) {
  let date = new Date(time)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  return `${year}-${month}-${day}`
}
// 过滤日期时间
Vue.filter('convertDate', convertDate)

// 过滤播放时间
export function convertTime(time) {
  let h = Math.floor(time / 3600).toString().padStart(2, '0')
  let m = Math.floor(time % 3600 / 60).toString().padStart(2, '0')
  let s = Math.floor(time % 60).toString().padStart(2, '0')
  return h === '00' ? `${m}:${s}` : `${h}:${m}:${s}`
}

Vue.filter('convertTime', convertTime)

// 过滤歌手
export function convertSinger(item) {
  return item.map(item => item.name).join('/')
}
Vue.filter('convertSinger', convertSinger)
