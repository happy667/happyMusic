import Vue from 'vue'
Vue.filter('convert', (num) => {
  let number = num.toString()
  return number.length < 4 ? number : parseInt(number / 10000) + '万'
})
